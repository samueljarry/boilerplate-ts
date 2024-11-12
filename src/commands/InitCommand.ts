import { CamerasManager } from "../core/three/managers/CamerasManager";
import { DebugCameraController } from "../controllers/DebugCameraController";
import { DummyCameraController } from "../controllers/DummyCameraController";
import { InitCommandBase } from "@core/common/bases/commands/InitCommandBase";
import { MainTheater } from "@theaters/MainTheater";
import { MainThreeView } from "../core/three/views/MainThreeView";
import { TestThreeView } from "../views/TestThreeView";
import { TheatersManager } from "@core/common/managers/TheatersManager";
import { ThreeAssetsManager } from "../core/three/managers/ThreeAssetsManager";
import { ViewId } from "@constants/ViewId";
import { ViewLayer } from "@core/common/constants/views/ViewLayer";
import { ViewsManager } from "@core/common/managers/ViewsManager";

export class InitCommand extends InitCommandBase {
  public async init(): Promise<void> {
    await super.init();
  }
  
  public async initProxies(): Promise<void> {
  }

  public async initManagers(): Promise<void> {
    CamerasManager.Init()
  }

  public async initThree(): Promise<void> {
    ViewsManager.AddThreeView(ViewId.THREE_TEST, TestThreeView);

    CamerasManager.AddCamera(new DebugCameraController());
    CamerasManager.AddCamera(new DummyCameraController());
  }

  public async initViews(): Promise<void> {
    ViewsManager.AddReactView(ViewId.MAIN_THREE, ViewLayer.MAIN_THREE, MainThreeView);
  }

  public async initTheaters(): Promise<void> {
    TheatersManager.AddTheater(new MainTheater());
  }

  public async initAfterLoad(): Promise<void> {
    await ThreeAssetsManager.Load()
  }
}