export class InitCommandBase {
  public async init(): Promise<void> {
    await this.initBefore();
    await this.initProxies();
    await this.initManagers();
    await this.initThree();
    await this.loadAssets();
    await this.initCommons();
    await this.initAfter();

    await this.initViews();
    await this.initTheaters();
  }

  public async initBefore(): Promise<void> {}

  /**
   * Init all proxies
   */
  public async initProxies(): Promise<void> {}

  /**
   * Init all Managers
   */
  public async initManagers(): Promise<void> {}

  /**
   * Init every Three.js related assets
   */
  public async initThree(): Promise<void> {}

  /**
   * Init every common assets
   */
  public async initCommons(): Promise<void> {}

  /**
   * Init all views
   */
  public async initViews(): Promise<void> {}

  /**
   * Init theaters
   */
  public async initTheaters(): Promise<void> {}

  /**
   * Load all assets added to queue
   */
  public async loadAssets(): Promise<void> {}

  /**
   * Init anything after everything is loaded
   */
  public async initAfter(): Promise<void> {}
}
