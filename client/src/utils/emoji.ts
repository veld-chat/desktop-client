import { emojisItems } from "../utils/autocomplete";
export interface Emoji {
  name: string;
  value: string;
  image: string
}

const isOnlyEmojiRegex = /^(?:<img class="emoji"[^>]+>|\s+)*$/;
const emojiRegex = /:([A-Za-z_0-9]+):/g;
export const emojis: { [name: string]: Emoji } = {};
export const emojisByValue: { [name: string]: Emoji } = {};

export function registerEmoji(emoji: Emoji) {
  emojis[name] = emoji;
  emojisByValue[emoji.value] = emoji;

  emojisItems.push({
    text: emoji.name,
    textLowerCased: emoji.name.toLowerCase(),
    image: emoji.image,
    value: emoji.value,
  });
}

export function replaceEmojis(text: string) {
  return text.replace(emojiRegex, (text, name) => {
    const e = emojisByValue[text];
    return e ? `<img class="emoji" alt="${e.value}" title="${e.value}" src="${e.image}" />` : text;
  })
}

export function isEmojiOnly(text: string) {
  return isOnlyEmojiRegex.test(text);
}
