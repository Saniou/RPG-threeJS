import { Object3D } from 'three'
// const SPEED = 3

export default class Player extends Object3D {
//   collider = null
//   rigidBody = null
//   ctrl = new Gamepad()

  constructor(mesh, physic) {
    super()
    this.position.copy(mesh.position)
    this.initPhysic(physic)
    this.initVisual(mesh)
  }

  initPhysic(physic) {

  }

  initVisual(mesh) {
    mesh.position.set(0, 0, 0)
    mesh.castShadow = true
    this.add(mesh)
  }

//   update() {
//     this.updatePhysic()
//     this.updateVisual()
//   }

//   updatePhysic() {
//     const x = this.ctrl.x * SPEED
//     const z = this.ctrl.z * SPEED
//     const y = this.rigidBody.linvel().y
//     this.rigidBody.setLinvel({ x, y, z }, true)
//   }

//   updateVisual() {
//     this.position.copy(this.rigidBody.translation())
//   }

}