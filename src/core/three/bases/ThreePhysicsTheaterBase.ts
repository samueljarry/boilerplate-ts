import { PhysicsWorldManager } from "@managers/PhysicsWorldManager";
import { ThreeTheaterBase } from "./ThreeTheaterBase";

export class ThreePhysicsTheaterBase extends ThreeTheaterBase {
  public override init(): void {
    super.init();

    PhysicsWorldManager.Start();
  }

  public override reset(): void {
    super.reset();

    PhysicsWorldManager.Stop();
  }
}