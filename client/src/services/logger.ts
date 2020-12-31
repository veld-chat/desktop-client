
export class LoggerInstance {
  isDebug: boolean;
  category: string;

  constructor(category: string) {
    this.isDebug = process.isClient ? localStorage.getItem("debug") == "1" : false;
    this.category = category;
  }

  createLogger(category: string): LoggerInstance {
    return new LoggerInstance(this.category + " -> " + category);
  }

  log(...message: unknown[]) {
    if (!this.isDebug) {
      return;
    }
    console.log(`[${this.category}]`, ...message)
  }
}

export function createLogger(category: string): LoggerInstance {
  return new LoggerInstance(category);
}