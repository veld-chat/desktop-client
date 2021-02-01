export class TaskCompletionSource {
  private callbacks: (() => void)[] = [];
  private isComplete = false;

  wait() {
    if (this.isComplete) {
      return Promise.resolve();
    }

    return new Promise(resolve => this.callbacks.push(resolve));
  }

  setComplete() {
    if (this.isComplete) {
      return;
    }

    this.isComplete = true;

    for (const callback of this.callbacks) {
      callback();
    }
  }
}
