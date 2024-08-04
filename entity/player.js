import { Object3D, Vector3 } from 'three'
import Keyboard from '../control/keyboard'
import { createRigidBodyEntity } from '../tool/function'
import Animator from './animation'

const SPEED = 1
const ATTACK = 'knight_attack_2_heavy_weapon'
const IDLE = 'knight_idle'
const RUN = 'knight_walk_in_place'

function range(target, current) {
  let delta = target - current
  if (delta > Math.PI) delta -= 2 * Math.PI
  if (delta < -Math.PI) delta += 2 * Math.PI
  return delta
}

export default class Player extends Object3D {
  collider = null
  rigidBody = null
  animator = null 
  ctrl = new Keyboard()

  constructor(mesh, physic) {
    super()
    const origin = new Vector3(0, 1, 0)
    this.initPhysic(physic, origin)
    this.initVisual(mesh)
    this.initAnimation(mesh)
  }

  initPhysic(physic, origin) {
    const { rigidBody, collider } = createRigidBodyEntity(origin, physic)
    this.rigidBody = rigidBody
    this.collider = collider
  }

  initVisual(mesh) {
    this.add(mesh)
  }

  initAnimation(mesh) {
    const animator = new Animator(mesh)
    animator.load(ATTACK, 0.3)
    animator.load(IDLE, 5)
    animator.load(RUN, 1)
    this.animator = animator
  }

  update(dt) {
    this.updatePhysic()
    this.updateVisual(dt)
    this.updateAnimation(dt)
  }

  updatePhysic() {
    const attack = this.ctrl.attack
    let x = attack ? 0 : this.ctrl.x * SPEED 
    let z = attack ? 0 : this.ctrl.z * SPEED
    let y = this.rigidBody.linvel().y
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

  updateAnimation(dt) {
    if (this.ctrl.attack) {
      this.animator.play(ATTACK)
    } else if (this.ctrl.moving) {
      this.animator.play(RUN)
    } else {
      this.animator.play(IDLE)
    }
    this.animator.update(dt)
  }
}