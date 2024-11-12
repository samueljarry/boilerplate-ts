import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export class HdrLoader {
  private static _Loader = new RGBELoader();

  public static async Load(path: string): Promise<unknown> {
    const promise = await new Promise((resolve) => {
      this._Loader.load(path, (rgbe) => resolve(rgbe))
    })

    return promise;
  }
}