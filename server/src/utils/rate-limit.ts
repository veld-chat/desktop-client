export class RateLimit {
  private readonly maxCount: number;
  private readonly ms: number;
  private readonly interval: NodeJS.Timeout;
  private items: { [key: string]: { count: number; lastReset: number } } = {};

  constructor(amount: number, ms: number) {
    this.maxCount = amount;
    this.ms = ms;

    this.interval = setInterval(this.clean.bind(this), 60000 * 5);
  }

  check(id: string) {
    let item = this.items[id];
    const now = Date.now();

    if (!item) {
      item = { count: 0, lastReset: now };
      this.items[id] = item;
    } else if (now - item.lastReset >= this.ms) {
      item.lastReset = now;
      item.count = 0;
    }

    return ++item.count <= this.maxCount;
  }

  dispose() {
    clearInterval(this.interval);
  }

  private clean() {
    const now = Date.now();

    for (const key of Object.keys(this.items)) {
      const item = this.items[key];

      if (now - item.lastReset >= this.ms) {
        delete this.items[key];
      }
    }
  }
}
