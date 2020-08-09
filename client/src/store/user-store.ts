import { User } from "@/models/events";
import { Store } from "./store";

export class UserStore extends Store<string, User> {
  constructor() {
    super();
  }

  getEntityKey(value: User): string {
    return value.id;
  }
}

// Singleton pattern
const instance = new UserStore();
export default instance;
