import { Module } from "vuex";
import { RootState, store } from "@/store";
import { Channel, Message, MessagePart, ScrollPosition, ServerMessage, User } from "@/models";
import Vue from "vue";
import { processMessage } from "@/utils/string";

export interface ChannelState {
  channels: readonly Channel[];
  channelsById: { [id: string]: Channel };
  currentChannel: string;
}

export const channels: Module<ChannelState, RootState> = {
  namespaced: true,

  state: {
    channels: [],
    channelsById: {},
    currentChannel: null,
  },

  getters: {
    byId: state => id => state.channelsById[id],
    current: state => state.currentChannel ? state.channelsById[state.currentChannel] : null,
  },

  actions: {
    async addMember({ state, commit }, payload: { id: string, member: string }) {
      commit("setMembers", {
        id: payload.id,
        members: [
          ...state.channelsById[payload.id].members,
          payload.member
        ],
      });
    },
    async clear({ commit }) {
      commit("setChannels", []);
    },
    async set({ commit }, channels: Channel[]) {
      commit("setChannels", channels);
    },
    async setCurrentChannel({ commit }, channel: string) {
      commit("setCurrentChannel", channel);
    },
    update({ state, commit }, channel: Channel) {
      commit("setChannels", [
        channel,
        ...state.channels.filter(u => u.id != channel.id),
      ]);
    },
    async remove({ state, commit }, channelOrId: Channel | string) {
      if (typeof channelOrId !== "string") {
        channelOrId = channelOrId.id;
      }

      if (state.currentChannel == channelOrId) {
        commit("setCurrentChannel", "0");
      }

      commit("setChannels", [...state.channels.filter(u => u.id !== channelOrId)]);
    },
    removeMember({ state, commit }, payload: { id: string, member: string }) {
      commit("setMembers", {
        id: payload.id,
        members: state.channelsById[payload.id].members
          .filter(x => x !== payload.member)
      });
    },
    addMessage({ commit, rootState }, message: ServerMessage) {
      const { id } = rootState.session.user;
      const isMention = message.mentions.includes(id);
      const part = processMessage(message, isMention);

      commit("addMessage", {
        message,
        part
      });
    },
    setScroll({ commit }, payload: { id: string, scroll: ScrollPosition }) {
      commit("setScroll", payload);
    },
  },

  mutations: {
    setChannels(state, payload: Channel[]) {
      const channeldById = {};

      for (const channel of payload) {
        channeldById[channel.id] = {
          ...channel,
          messages: channel.messages || [],
          scroll: "end",
          unreadAmount: channel.unreadAmount || 0,
          mentionAmount: channel.mentionAmount || 0
        } as Channel;
      }

      state.channels = Object.values(channeldById);
      state.channelsById = channeldById;
    },
    setCurrentChannel(state, payload: string) {
      const channel = state.channelsById[payload];

      if (channel) {
        state.currentChannel = payload;
        Vue.set(channel, "unreadAmount", 0);
        Vue.set(channel, "mentionAmount", 0);
      }
    },
    setMembers(state, payload: { members: string[], id: string }) {
      const channel = state.channelsById[payload.id];
      channel.members = payload.members;

      state.channels = Object.freeze([
        ...state.channels.filter(x => x.id !== channel.id),
        channel,
      ]);
      state.channelsById = Object.freeze({
        ...state.channelsById,
        [payload.id]: channel,
      });
    },
    addMessage(state, { message, part }: { message: ServerMessage, part: MessagePart }) {
      const channel = state.channelsById[message.channelId];
      if (!channel) {
        return;
      }

      const user = store.state.users.usersById[message.user];
      if (!user) {
        return;
      }

      const data: Message = {
        user,
        id: message.id,
        parts: [part]
      };

      const messages = channel.messages;
      const isCurrent = channel.id === state.currentChannel;
      const lastMessageId = messages.length - 1;
      const lastMessage = messages[lastMessageId];

      if (lastMessage && lastMessage.user.id === message.user) {
        Vue.set(messages, lastMessageId, {
          ...data,
          id: lastMessage.id,
          parts: [...lastMessage.parts, ...data.parts]
        })
      } else {
        messages.push(data);

        if (isCurrent) {
          Vue.set(channel, "lastMessageId", data.id);
        }
      }

      if (!isCurrent) {
        Vue.set(channel, "unreadAmount", channel.unreadAmount + 1);

        if (part.isMention) {
          Vue.set(channel, "mentionAmount", channel.mentionAmount + 1);
        }
      }
    },
    setScroll(state, { id, scroll }: { id: string, scroll: ScrollPosition }) {
      const channel = state.channelsById[id];

      if (channel && channel.scroll !== scroll) {
        Vue.set(channel, "scroll", scroll);
      }
    }
  }
};
