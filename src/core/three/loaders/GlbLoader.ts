import { AnimationClip, Camera, Scene } from "three";

import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export type GLTF = {
  animations: AnimationClip[];
  scene: Scene;
  scenes: Scene[];
  cameras: Camera[];
};

export class GlbLoader {
  private static _DracoLoader = new DRACOLoader().setDecoderPath("/draco/");
  private static _Loader = new GLTFLoader().setDRACOLoader(this._DracoLoader);

  public static async Load(path: string): Promise<GLTF> {
    const promise: GLTF = await new Promise((resolve) => {
      this._Loader.load(path, (model) => resolve(model as unknown as GLTF));
    });

    return promise;
  }
}