export class LoggerInstance {
  isDebug: boolean;
  ignoredCategories: Array<string>;
  category: string;

  constructor(category: string) {
    this.isDebug =
      typeof window !== "undefined"
        ? localStorage.getItem("debug") == "1"
        : false;
    this.ignoredCategories =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("debug_ignored") || "[]")
        : [];
    this.category = category;
  }

  createLogger(category: string): LoggerInstance {
    return new LoggerInstance(this.category + " -> " + category);
  }

  log(...message: unknown[]) {
    if (!this.isDebug || this.ignoredCategories.includes(this.category)) {
      return;
    }
    console.log(`[${this.category}]`, ...message);
  }
}

export function createLogger(category: string): LoggerInstance {
  return new LoggerInstance(category);
}
