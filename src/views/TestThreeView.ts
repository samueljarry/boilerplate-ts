import { BoxGeometry, DodecahedronGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial } from "three";

import { ThreeViewBase } from "../core/three/bases/ThreeViewBase";
import { ViewId } from "../constants/LayoutConstants";
import { ViewLayer } from "../core/common/constants/views/ViewLayer";

export class TestThreeView extends ThreeViewBase {
  private _mesh: Mesh<BoxGeometry, MeshStandardMaterial>
  constructor() {
    super(ViewId.THREE_TEST, ViewLayer.NULL);

    this._mesh = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: 'red' })
    )

    this._mesh.rotation.x = Math.PI * 0.25;
    this._mesh.rotation.y = Math.PI * 0.25;

    this.add(this._mesh);
  }

  public init() {
    super.init() 
  }
}