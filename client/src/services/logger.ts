const isDebug = localStorage.getItem("debug") == "1";

class LoggerInstance {
  category: string;

  constructor(category: string) {
    this.category = category;
  }

  createLogger(category: string): LoggerInstance {
    return new LoggerInstance(this.category + " -> " + category);
  }

  log(...message: unknown[]) {
    log(this.category, ...message);
  }
}

export function createLogger(category: string): LoggerInstance {
  return new LoggerInstance(category);
}

export function log(category: string, ...message: unknown[]) {
  if (!isDebug) {
    return;
  }

  console.log(`[${category}]`, ...message)
}

