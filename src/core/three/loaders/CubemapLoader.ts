import { CubeTexture, CubeTextureLoader } from "three";

export class CubemapLoader {
  private static _Loader = new CubeTextureLoader();

  public static async Load(path: string): Promise<CubeTexture> {
    const promise = new Promise<CubeTexture>(resolve => {})
    const cubeMap =  this._Loader
      .setPath(path)
      .load([
        'px.png',
        'nx.png',
        'py.png',
        'ny.png',
        'pz.png',
        'nz.png',
      ])

    return cubeMap;
  }
}