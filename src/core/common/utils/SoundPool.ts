import { AssetsId } from "@constants/AssetsId";
import { CommonAssetsManager } from "../managers/CommonAssetsManager";

export class SoundPool {
  private _originalSound: HTMLAudioElement;
  private _soundArray = Array<HTMLAudioElement>();
  private _count: number;
  private _index: number = 0;
  private _prevSound: HTMLAudioElement;
  
  constructor(soundId: AssetsId, count: number) {
    this._originalSound = CommonAssetsManager.GetSound(soundId);
    this._count = count;

    for(let i = 0; i < count; i++) {
      const sound = new Audio(this._originalSound.src);
      sound.setAttribute('id', i.toString());
      this._soundArray.push(sound);
    }
  }

  public play(): void {
    this._index = this._index + 1 === this._count 
      ? 0 
      : this._index + 1;

    if(this._prevSound) {
      this._prevSound.pause();
      this._prevSound.currentTime = 0;
    }

    const sound = this._soundArray[this._index];
    sound.currentTime = 0;
    sound.play();    

    this._prevSound = sound;
  }

  public get src(): string { return this._originalSound.src }
}