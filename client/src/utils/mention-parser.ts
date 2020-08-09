import userStore from "../store/user-store";

export class MentionParser {
  fromString(content: string): string[] {
    const mentionables = content
      .split(" ")
      .filter((x) => x.startsWith("@"))
      .map((x) => x.substr(1));

    return mentionables
      .map((x) => userStore.list().find((y) => x == y.name))
      .filter(x => x)
      .map((x) => x.id);
  }
}
