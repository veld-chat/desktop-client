import { SyncEvent } from "ts-events";

export abstract class Store<TKey, TValue> {
  values: Map<TKey, TValue>;
  _onUpdateEvent: SyncEvent<TValue>;

  constructor() {
    this.values = new Map<TKey, TValue>();
    this._onUpdateEvent = new SyncEvent();
  }

  onUpdate(evt: (value: TValue) => void): void {
    this._onUpdateEvent.attach(evt);
  }

  upsert(user: TValue): void {
    this.values.set(this.getEntityKey(user), user);
    this._onUpdateEvent.post(user);
  }

  upsertAll(users: TValue[]): void {
    for (const u of users) {
      this.upsert(u);
    }
  }

  get(id: TKey): TValue {
    return this.values.get(id);
  }

  getAll(ids: TKey[]): TValue[] {
    return this.list().filter((x) => ids.includes(this.getEntityKey(x)));
  }

  delete(id: TKey): void {
    this.values.delete(id);
  }

  list(): TValue[] {
    return Array.from(this.values.values());
  }

  abstract getEntityKey(value: TValue): TKey;
}
