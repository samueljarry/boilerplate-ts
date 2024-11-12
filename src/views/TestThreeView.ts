import { DodecahedronGeometry, Mesh, MeshNormalMaterial } from "three";
import { ViewId } from "../constants/ViewId";
import { ViewLayer } from "../core/common/constants/views/ViewLayer";
import { ThreeViewBase } from "../core/three/bases/ThreeViewBase";

export class TestThreeView extends ThreeViewBase {
  constructor() {
    super(ViewId.THREE_TEST, ViewLayer.NULL)
  }

  init() {
    super.init() 

    this.mesh = new Mesh(new DodecahedronGeometry(1, 1), new MeshNormalMaterial()) ;
    this.add(this.mesh)
  }

  update = (dt) => {
    this.mesh.rotation.y += dt;
    this.mesh.rotation.z += dt;
  }
}