import { TheatersId, ViewId } from "@constants/LayoutConstants";

import { AssetsId } from "@constants/AssetsId";
import { CamerasManager } from "../core/three/managers/CamerasManager";
import { DebugCameraController } from "@controllers/cameras/DebugCameraController";
import { DefaultCameraController } from "@controllers/cameras/DefaultCameraController";
import { GuiManager } from "@core/common/managers/GuiManager";
import { InitCommandBase } from "@core/common/bases/commands/InitCommandBase";
import { MainTheater } from "@theaters/MainTheater";
import { MainThreeView } from "../core/three/views/MainThreeView";
import { TestThreeView } from "@views/TestThreeView";
import { TheatersManager } from "@core/common/managers/TheatersManager";
import { ThreeAssetsManager } from "../core/three/managers/ThreeAssetsManager";
import { ViewLayer } from "@core/common/constants/views/ViewLayer";
import { ViewsManager } from "@core/common/managers/ViewsManager";

export class InitCommand extends InitCommandBase {
  public async initProxies(): Promise<void> {}

  public async initManagers(): Promise<void> {
    CamerasManager.Init();
    GuiManager.Init();
  }

  public async initThree(): Promise<void> {
    CamerasManager.AddCamera(new DebugCameraController());
    CamerasManager.AddCamera(new DefaultCameraController());
    ThreeAssetsManager.AddHdr(AssetsId.HDR_SKY, 'hdr/sky.hdr');
  }

  public async initViews(): Promise<void> {
    ViewsManager.AddReactView(
      ViewId.MAIN_THREE,
      ViewLayer.MAIN_THREE,
      MainThreeView
    );

    ViewsManager.AddThreeView(TestThreeView)
  }

  public async initTheaters(): Promise<void> {
    TheatersManager.AddTheater(MainTheater);
  }

  public async loadAssets(): Promise<void> {
    await ThreeAssetsManager.Load();
  }

  public async initAfter(): Promise<void> {
  }
}
