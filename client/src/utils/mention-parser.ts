import { store } from "@/store";

export class MentionParser {
  fromString(content: string): string[] {
    const { users } = store.state.users;
    const mentionables = content
      .split(" ")
      .filter((x) => x.startsWith("@"))
      .map((x) => x.substr(1));

    return mentionables
      .map((x) => users.find((y) => x == y.name))
      .filter(x => x)
      .map((x) => x.id);
  }
}
