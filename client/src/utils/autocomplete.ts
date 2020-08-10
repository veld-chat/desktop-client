import { emojis } from "@/utils/emoji";
import userStore from "@/store/user-store";

export interface AutoComplete {
  text: string;
  textLowerCased: string;
  emoji?: string;
  image?: string;
  avatar?: string;
  value: string;
  description?: string;
}

const emojisItems: AutoComplete[] = [];
const commandItems: AutoComplete[] = [];

for (const n of Object.keys(emojis)) {
  emojisItems.push({
    text: n,
    textLowerCased: n,
    image: emojis[n].image,
    value: `:${n}:`,
  });
}

commandItems.push({
  text: "avatar",
  textLowerCased: "avatar",
  value: `/avatar`,
  description: "Changes your avatar to a random avatar.",
});

commandItems.push({
  text: "nick",
  textLowerCased: "nick",
  value: `/nick`,
  description: "Changes your nickname.",
});

export function autoComplete(word: string): AutoComplete[] {
  const list = [];


  if (word[0] === ":") {
    const name = word.substr(1);

    for (let i = 0; i < emojisItems.length; i++) {
      const item = emojisItems[i];

      if (item.value.toLowerCase().includes(name)) {
        list.push(item);

        if (list.length >= 50) {
          break;
        }
      }
    }
  }

  if (word[0] === "@") {
    const name = word.substr(1);
    const visited = [];

    for (const item of userStore.list()) {
      const itemName = item.name.toLowerCase();

      if (visited.indexOf(itemName) !== -1) {
        continue;
      }

      visited.push(itemName);

      if (itemName.toLowerCase().includes(name)) {
        list.push({
          text: item.name,
          textLowerCased: itemName,
          avatar: item.avatarUrl,
          value: "@" + item.name,
        });

        if (list.length >= 50) {
          break;
        }
      }
    }
  }

  return list.sort((a,b) => (a.textLowerCased > b.textLowerCased)
    ? 1
    : ((b.textLowerCased > a.textLowerCased) ? -1 : 0))
}
