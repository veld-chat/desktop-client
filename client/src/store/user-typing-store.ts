import { UserTyping } from "@/models/events";
import { Store } from "./store";

export class UserTypingStore extends Store<string, UserTyping> {
  constructor() {
    super();
  }

  getEntityKey(value: UserTyping): string {
    return value.id;
  }
}

// Singleton pattern
const instance = new UserTypingStore();
export default instance;