import { Module } from "vuex";
import { RootState } from "@/store";
import { AutoComplete } from "@/utils/autocomplete";

export interface Emoji {
  name: string;
  value: string;
  image: string
}

export interface EmojiState {
  autoComplete: AutoComplete[],
  emojis: { [name: string]: Emoji },
  emojisByValue: { [name: string]: Emoji }
}

export const emoji: Module<EmojiState, RootState> = {
  namespaced: true,

  state: {
    emojis: {},
    emojisByValue: {},
    autoComplete: []
  },

  getters: {
    byName: state => (name: string) => state.emojis[name],
    byValue: state => (value: string) => state.emojisByValue[value],
  },

  actions: {
    async set({ commit }, emojis: Emoji[]) {
      commit("setEmojis", emojis)
    },
    async clear({ commit }) {
      commit("setEmojis", []);
    },
  },

  mutations: {
    setEmojis(state, payload: Emoji[]) {
      const emojis = {};
      const emojisByValue = {};
      const autoComplete = [];

      for (const emoji of payload) {
        emojis[emoji.name] = emoji;
        emojisByValue[emoji.value] = emoji;
        autoComplete.push({
          text: emoji.name,
          textLowerCased: emoji.name.toLowerCase(),
          image: emoji.image,
          value: emoji.value,
        });
      }

      state.emojis = emojis;
      state.emojisByValue = emojisByValue;
      state.autoComplete = autoComplete;
    },
  }
};
