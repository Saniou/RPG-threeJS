import { Object3D, Vector3 } from 'three'
import Keyboard from '../control/keyboard'
import { createRigidBodyEntity } from '../tool/function'

const SPEED = 3

function range(target, current) {
  let delta = target - current
  if (delta > Math.PI) delta -= 2 * Math.PI
  if (delta < -Math.PI) delta += 2 * Math.PI
  return delta
}

export default class Player extends Object3D {
  collider = null
  rigidBody = null
  ctrl = new Keyboard()

  constructor(mesh, physic) {
    super()
    const origin = new Vector3(0, 4, 0)
    this.initPhysic(physic, origin)
    this.initVisual(mesh)
  }

  initPhysic(physic, origin) {
    const { rigidBody, collider } = createRigidBodyEntity(origin, physic)
    this.rigidBody = rigidBody
    this.collider = collider
  }

  initVisual(mesh) {
    this.add(mesh)
  }

  update(dt) {
    this.updatePhysic()
    this.updateVisual(dt)
  }

  updatePhysic() {
    const x = this.ctrl.x * SPEED
    const z = this.ctrl.z * SPEED
    const y = this.rigidBody.linvel().y
    this.rigidBody.setLinvel({ x, y, z }, true)

  }

  updateVisual(dt) {
    this.position.copy(this.rigidBody.translation())

    if (this.ctrl.moving) {
      const direction = new Vector3(this.ctrl.x, 0, this.ctrl.z).normalize();
      const targetAngle = Math.atan2(direction.x, direction.z);  
      const currentAngle = this.rotation.y;
      let deltaAngle = range(targetAngle, currentAngle);
      this.rotation.y += deltaAngle * dt * 10
    }
  }
}
