import { MathUtils, Object3D } from "three";

type FloatParams = {
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
}

export class Float {
  private _t = 0;
  private _target: Object3D;
  private _speed: number;
  private _rotationIntensity: number;
  private _floatIntensity: number;
  private _floatingRange: [number, number];
  private _random = Math.random() * 1000;

  constructor(target: Object3D, params?: FloatParams) {
    this._target = target;

    this._speed = params?.speed ?? 1;
    this._rotationIntensity = params?.rotationIntensity ?? 1;
    this._floatIntensity = params?.floatIntensity ?? 1;
    this._floatingRange = params?.floatingRange ?? [-1, 1];
  }

  public update(dt: number): void {
    this._t += dt;

    const x = ((this._t + this._random) / 4) * this._speed
    
    this._target.rotation.x = (Math.cos(x) / 8) * this._rotationIntensity
    this._target.rotation.y = (Math.sin(x) / 8) * this._rotationIntensity
    this._target.rotation.z = (Math.sin(x) / 20) * this._rotationIntensity

    let yPosition = Math.sin(x) / 10
    yPosition = MathUtils.mapLinear(yPosition, -0.1, 0.1, this._floatingRange[0], this._floatingRange[1])
    this._target.position.y = yPosition * this._floatIntensity
  }
}