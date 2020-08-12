import { Module } from "vuex";
import { RootState } from "@/store";
import { Message, MessagePart, ServerMessage, User } from "@/models";
import Vue from "vue";
import { isEmojiOnly, replaceEmojis } from "@/utils/emoji";
import DOMPurify from "dompurify";
import marked from "marked";

export interface MessageState {
  messages: Message[]
}

function processMessage(input: string, isMention: boolean): MessagePart {
  const content = replaceEmojis(
    DOMPurify.sanitize(
      marked(input, {
        headerIds: false,
        breaks: true,
      }),
      {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "code", "span"],
        ALLOWED_ATTR: ["href"],
      }
    )
  );

  return {
    isMention,
    content,
    isEmojiOnly: isEmojiOnly(content)
  };
}

export const messages: Module<MessageState, RootState> = {
  namespaced: true,

  state: {
    messages: []
  },

  getters: {},

  actions: {
    async add({ commit, rootState }, message: ServerMessage) {
      const { id } = rootState.session.user;
      const isMention = message.mentions.includes(id);
      const part = processMessage(message.message, isMention);

      commit("add", {
        user: message.user,
        part
      });
    }
  },

  mutations: {
    add(state, { user, part }: { user: string, part: MessagePart }) {
      const { messages } = state;
      const lastMessageId = messages.length - 1;
      const lastMessage = messages[lastMessageId];

      if (lastMessage && lastMessage.user === user) {
        Vue.set(messages, lastMessageId, {
          user,
          parts: [...lastMessage.parts, part]
        });
      } else {
        messages.push({
          user,
          parts: [part]
        });
      }
    }
  }
};
