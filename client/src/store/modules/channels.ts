import { Module } from "vuex";
import { RootState } from "@/store";
import { Channel, User } from "@/models";

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
    currentChannel: "0",
  },

  getters: {
    byId: state => id => state.channelsById[id],
  },

  actions: {
    async addMember({ state, commit }, payload: { id: string, member: User }) {
      commit("setMembers", {
        id: payload.id,
        members: [
          ...state.channelsById[payload.id].members.filter(x => x == payload.member.id),
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
    async update({ state, commit }, channel: Channel) {
      commit("setChannels", [
        ...state.channels.filter(u => u.id !== channel.id),
        channel
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
          .filter(x => x == payload.member)
      });
    }
  },

  mutations: {
    setChannels(state, payload: Channel[]) {
      const channeldById = {};

      for (const channel of payload) {
        channeldById[channel.id] = channel;
      }

      state.channels = Object.freeze(payload);
      state.channelsById = Object.freeze(channeldById);
    },
    setCurrentChannel(state, payload: string) {
      state.currentChannel = Object.freeze(payload);
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
    }
  }
};
