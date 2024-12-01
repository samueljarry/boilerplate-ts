import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class GlbLoader {
  private static _DracoLoader = new DRACOLoader().setDecoderPath("/draco/");
  private static _Loader = new GLTFLoader().setDRACOLoader(this._DracoLoader);

  public static async Load(path: string): Promise<unknown> {
    const promise = await new Promise((resolve) => {
      this._Loader.load(path, (model) => resolve(model));
    });

    return promise;
  }
}