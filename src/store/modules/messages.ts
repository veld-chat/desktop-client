import { Module } from "vuex";
import { RootState } from "../../store";
import { Message, MessagePart, ServerMessage } from "../../models";
import Vue from "vue";
import { processMessage } from "../../utils/string";

export interface MessagesState {
  messagesByChannel: { [id: string]: Message[] };
  lastMessageRead: { [id: string]: string };
}

export const messages: Module<MessagesState, RootState> = {
  namespaced: true,

  state: {
    messagesByChannel: {},
    lastMessageRead: {},
  },

  getters: {
    byChannel: state => id => state.messagesByChannel[id],
    unreadMessages: state => id => {
      const messages = state.messagesByChannel[id];
      const index = messages.findIndex(x => x.id == state.lastMessageRead[id]);
      if (index == -1) {
        return messages.length;
      }
      return messages.length - index;
    }
  },

  actions: {
    create({ commit, rootState }, message: ServerMessage) {
      const id = rootState.session.userId;
      //const isMention = message.mentions.includes(id);
      const part = processMessage(message, false);

      commit("create", {
        message,
        part,
      });
    },
    read({ commit }, { messageId, channelId }: { messageId: string, channelId: string }) {
      commit("setLastMessageRead", { messageId, channelId });
    }
  },

  mutations: {
    create(state, { message, part }: { message: ServerMessage, part: MessagePart }) {
      let messages = state.messagesByChannel[message.channelId];
      if (!messages) {
        state.messagesByChannel[message.channelId] = [];
        messages = state.messagesByChannel[message.channelId];
      }

      const data: Message = {
        author: message.author,
        id: message.id,
        timestamp: message.timestamp,
        parts: [part]
      };

      const lastMessageId = messages.length - 1;
      const lastMessage = messages[lastMessageId];

      if (lastMessage && lastMessage.author.id === message.author.id) {
        state.messagesByChannel = {
          ...state.messagesByChannel,
          [message.channelId]: [
            ...messages.filter(x => x.id != lastMessage.id),
            {
              ...data,
              id: lastMessage.id,
              parts: [...lastMessage.parts, ...data.parts]
            }
          ]
        }
      } else {
        state.messagesByChannel = {
          ...state.messagesByChannel,
          [message.channelId]: [
            ...messages,
            data
          ]
        }
        state.lastMessageRead[message.channelId] = message.id;
      }

    },
    setLastMessageRead(state, { messageId, channelId }: { messageId: string, channelId: string }) {
      state.lastMessageRead[channelId] = messageId;
    }
  }
};
