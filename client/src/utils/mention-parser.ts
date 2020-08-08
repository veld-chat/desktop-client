import { UserStore } from "@/store/user-store";

export class MentionParser {
  users: UserStore;

  constructor(userStore: UserStore) {
    this.users = userStore;
  }

  fromString(content: string): string[] {
    const mentionables = content
      .split(" ")
      .filter((x) => x.startsWith("@"))
      .map((x) => x.substr(1));

    return mentionables
      .map((x) => this.users.list().find((y) => x == y.name))
      .map((x) => x.id);
  }
}
