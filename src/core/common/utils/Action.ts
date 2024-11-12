export class Action<T extends Array<unknown>> {
  actionSet = new Set<(...params: T) => void>();

  add(func: (...params: T) => void) {
    this.actionSet.add(func);
  }

  remove(func: (...params: T) => void) {
    this.actionSet.delete(func);
  }

  execute(...params: T) {
    for (const func of this.actionSet.values()) {
      func(...params);
    }
  }
}