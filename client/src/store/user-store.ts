import { User } from "@/models/events";

export class UserStore {
  users: Map<string, User>;

  constructor() {
    this.users = new Map<string, User>();
  }

  upsert(user: User): void {
    this.users.set(user.id, user);
  }

  upsertAll(users: User[]): void {
    for (const u of users) {
      this.upsert(u);
    }
  }

  get(id: string): User {
    return this.users.get(id);
  }

  getAll(ids: string[]): User[] {
    return this.list().filter((x) => ids.includes(x.id));
  }

  delete(id: string): void {
    this.users.delete(id);
  }

  list(): User[] {
    return Array.from(this.users.values());
  }
}
