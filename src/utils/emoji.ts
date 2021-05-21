import store from "../store/store";

const isOnlyEmojiRegex = /^(\s*<p>)?\s*<img class="emoji"[^>]+>\s*(<\/p>\s*)$/;
const emojiRegex = /:([A-Za-z_0-9]+):/g;

export function replaceEmojis(text: string) {
  // const { emojisByValue } = store.getState().emojis;
  // return text.replace(emojiRegex, text => {
  //   const e = emojisByValue[text];
  //   return e
  //     ? `<img class="emoji" alt="${e.value}" title="${e.value}" src="${
  //         e.image
  //       }" />`
  //     : text;
  // });

  return text;
}

export function isEmojiOnly(text: string) {
  return isOnlyEmojiRegex.test(text);
}
