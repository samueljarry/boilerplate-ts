export class Action<T extends Array<unknown>> {
  public actionSet = new Set<(...params: T) => void>();

  public add(func: (...params: T) => void) {
    this.actionSet.add(func);
  }

  public remove(func: (...params: T) => void) {
    this.actionSet.delete(func);
  }

  public clear(): void {
    for(const func of this.actionSet) {
      this.remove(func);
    }
  }

  public execute(...params: T) {
    for (const func of this.actionSet.values()) {
      func(...params);
    }
  }
}