import store from "../store/store";

const isOnlyEmojiRegex = /^(:([A-Za-z_0-9]+):)+( ?)+$/;
const emojiRegex = /:([A-Za-z_0-9]+):/g;

export function replaceEmojis(text: string) {
  const { emojisByValue } = store.getState().emojis;
  return text.replace(emojiRegex, (text) => {
    const e = emojisByValue[text];
    return e
      ? `<img class="emoji" alt="${e.value}" title="${e.value}" src="${e.image}" />`
      : text;
  });
}

export function isEmojiOnly(text: string) {
  return isOnlyEmojiRegex.test(text);
}
