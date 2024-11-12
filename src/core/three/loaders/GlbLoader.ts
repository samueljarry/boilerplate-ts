import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class GlbLoader {
  private static _Loader = new GLTFLoader();

  public static async Load(path: string): Promise<unknown> {
    const promise = await new Promise((resolve) => {
      this._Loader.load(path, (model) => resolve(model))
    })

    return promise;
  }
}