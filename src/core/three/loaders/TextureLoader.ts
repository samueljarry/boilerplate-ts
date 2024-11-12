import * as THREE from 'three';

export class TextureLoader {
  private static _Loader = new THREE.TextureLoader();
  
  public static async Load(path: string): Promise<THREE.Texture> {
    const texture = await this._Loader.loadAsync(path);
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }
}