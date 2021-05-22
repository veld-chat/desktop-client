import store from "../store/store";

export interface AutoComplete {
  text: string;
  textLowerCased: string;
  emoji?: string;
  image?: string;
  avatar?: string;
  value: string;
  description?: string;
}

const commandItems: AutoComplete[] = [];

function add(name: string, list: AutoComplete[], source: AutoComplete[]) {
  for (let i = 0; i < source.length; i++) {
    const item = source[i];

    if (item.value.toLowerCase().includes(name)) {
      list.push(item);

      if (list.length >= 50) {
        break;
      }
    }
  }
}

export function autoComplete(word: string): AutoComplete[] {
  if (!word) {
    return [];
  }

  const list = [];

  if (word[0] === "/") {
    add(word.substr(1), list, commandItems);
  } else if (word[0] === ":" && word.length > 2) {
    add(word.substr(1), list, store.getState().emojis.autoComplete);
  } else if (word[0] === "@") {
    const name = word.substr(1);
    const visited = [];

    for (const item of store.getState().users.users) {
      const itemName = item.name.toLowerCase();

      if (visited.indexOf(itemName) !== -1) {
        continue;
      }

      visited.push(itemName);

      if (itemName.toLowerCase().includes(name)) {
        list.push({
          text: item.name,
          textLowerCased: itemName,
          avatar: item.avatarUrl || (Number(item.id) % 5).toString(),
          value: `@${item.name}`,
        });

        if (list.length >= 50) {
          break;
        }
      }
    }
  } else if (word[0] === "#") {
    const channelName = word.substr(1);

    const channels = store
      .getState()
      .channels.channels.filter((channel) => channel.name.includes(channelName))
      .map((channel) => {
        return {
          text: `#${channel.name}`,
          textLowerCased: channel.name,
          value: `{#${channel.id}}`,
        };

        // Limit of 4 max channels, otherwise the list gets too long.
      })
      .slice(0, 4);

    // Add the channels that were found to the autocomplete list
    channels.map((channel) => {
      list.push(channel);
    });
  }

  return list.sort((a, b) =>
    a.textLowerCased > b.textLowerCased
      ? 1
      : b.textLowerCased > a.textLowerCased
      ? -1
      : 0
  );
}
