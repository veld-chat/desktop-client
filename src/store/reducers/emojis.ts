import { AutoComplete } from "@/utils/autocomplete";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Emoji } from "..";

export interface EmojiState {
  autoComplete: AutoComplete[];
  emojis: { [name: string]: Emoji };
  emojisByValue: { [name: string]: Emoji };
}

const setEmojis = (state, payload: Emoji[]) => {
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
      value: emoji.value
    });
  }

  state.emojis = emojis;
  state.emojisByValue = emojisByValue;
  state.autoComplete = autoComplete;
};

const initialState = {
  emojis: {},
  emojisByValue: {},
  autoComplete: []
};

export const emojiSlice = createSlice({
  name: "emojis",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Emoji[]>) => {
      setEmojis(state, action.payload);
    },
    clear: () => {
      return initialState;
    }
  }
});

// Action creators are generated for each case reducer function
export const { set, clear } = emojiSlice.actions;

export default emojiSlice.reducer;
