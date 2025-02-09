type TickerCallback = {
    callback: (dt: number) => void;
    priority: number;
}

export class Ticker {
  private static _IsRunning: boolean;
  private static _IntervalId: NodeJS.Timeout;
  private static _CurrentTime: number;
  private static _ElapsedTime = 0;
  private static _StartTime: number;
  private static _Callbacks = new Array();
  private static _MinTimeBetweenFrame = 60 / 1000;

  public static Start(time = -1): void {
    this.Stop();
    this._IsRunning = true;
    Ticker._CurrentTime = Date.now();
    this._StartTime = Date.now();
    clearInterval(this._IntervalId);
    if (time < 0) {
      Ticker._RenderRaf();
    } else {
      this._IntervalId = setInterval(this._RenderInterval, time);
    }
  }

  public static Stop() {
    this._IsRunning = false;
    clearInterval(this._IntervalId);
  }

  public static Add(callback: (dt: number) => void, priority = 0) {
    for (const icallback of Ticker._Callbacks) {
      if (icallback.callback === callback) return;
    }
    Ticker._Callbacks.push({ callback: callback, priority: priority });
    Ticker._Callbacks.sort(Ticker._SortCallbacks);
  }

  public static Remove(callback: (dt: number) => void): void {
    for (let i = 0; i < Ticker._Callbacks.length; i++) {
      if (Ticker._Callbacks[i].callback === callback) {
        Ticker._Callbacks.splice(i, 1);
        return;
      }
    }
  }

  private static _SortCallbacks(a: TickerCallback, b: TickerCallback): number {
    if (a.priority > b.priority) return -1;
    if (a.priority < b.priority) return 1;
    return 0;
  }

  public static SetFPS(fps: number): void {
    this._MinTimeBetweenFrame = fps / 1000;
  }

  private static _RenderRaf = (): void => {
    this._Render();
    if (this._IsRunning) {
      requestAnimationFrame(Ticker._RenderRaf);
    }
  };

  private static _RenderInterval = (): void => {
    this._Render();
  };

  private static _Render(): void {
    const now = Date.now();
    const lastFrame = Ticker._CurrentTime;
    const dt = now - lastFrame;
    if (dt < this._MinTimeBetweenFrame) {
      return;
    }
    this._ElapsedTime += dt;
    Ticker._CurrentTime = now;
    for (const icallback of Ticker._Callbacks) {
      icallback.callback(dt / 1000);
    }
  }

  /**
   * Timestamp in milliseconds at the start of the game
   */
  public static get StartTime(): number {
    return this._StartTime;
  }

  /**
   * Current timestamp of the game in milliseconds (Date.now())
   */
  public static get CurrentTime(): number {
    return this._CurrentTime;
  }

  /**
   * Time since the start of the game in milliseconds
   */
  public static get ElapsedTime(): number {
    return this._ElapsedTime * 0.001;
  }
}