import { Module } from "vuex";
import { RootState, store } from "@/store";
import { Embed, Message, MessagePart, ServerMessage } from "@/models";
import { isEmojiOnly, replaceEmojis } from "@/utils/emoji";
import DOMPurify from "dompurify";
import marked from "marked";

export interface MessageState {
  messages: { [channelId: string]: readonly Message[] }
}

function processString(input: string) {
  return replaceEmojis(
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
}

function processMessage(message: ServerMessage, isMention: boolean): MessagePart {
  const content = processString(message.content);

  return {
    id: message.id,
    isMention,
    content,
    embed: processEmbed(message.embed),
    isEmojiOnly: isEmojiOnly(content)
  };
}

function processEmbed(embed: Embed): Embed {
  if (!embed) {
    return embed;
  }

  if (embed.author) {
    if (!embed.author.value) {
      embed.author = null;
    } else {
      embed.author.value = processString(embed.author.value);
    }
  }

  if (embed.title) {
    embed.title = processString(embed.title);
  }

  if (embed.description) {
    embed.description = processString(embed.description);
  }

  if (embed.footer) {
    embed.footer = processString(embed.footer);
  }

  return embed;
}

export const messages: Module<MessageState, RootState> = {
  namespaced: true,

  state: {
    messages: {}
  },

  getters: {},

  actions: {
    async add({ commit, rootState }, message: ServerMessage) {
      const { id } = rootState.session.user;
      const isMention = message.mentions.includes(id);
      const part = processMessage(message, isMention);

      commit("add", {
        message,
        part
      });
    }
  },

  mutations: {
    add(state, { message, part }: { message: ServerMessage, part: MessagePart }) {
      const user = store.state.users.usersById[message.user];
      if (!user) {
        return;
      }

      const data: Message = {
        user,
        id: message.id,
        parts: [part]
      };

      const messageChannel = state.messages[message.channelId] || [];
      const messageCount = messageChannel.length;
      const lastMessage = messageChannel[messageCount - 1];
      const messages = [...messageChannel];

      if (lastMessage && lastMessage.user.id === message.user) {
        messages.pop();
        messages.push({
          ...data,
          id: lastMessage.id,
          parts: [...lastMessage.parts, ...data.parts]
        })
      } else {
        messages.push(data);
      }

      state.messages = Object.freeze({
        ...state.messages,
        [message.channelId]: messages
      });
    }
  }
};
