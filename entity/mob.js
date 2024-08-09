import { Object3D, Vector3 } from 'three';
import { createRigidBodyEntityMob } from '../tool/function';
import Animator from './animation';

const FOLLOW_SPEED = 1.2;
const ATTACK = 'attack';
const IDLE = 'idle';
const RUN = 'walk';
const SPAWN_DISTANCE = 4; 

function range(target, current) {
    let delta = target - current;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    return delta;
}

export default class Mob extends Object3D {
    collider = null;
    rigidBody = null;
    animator = null;
    target = null;

    constructor(mesh, physic, target) {
        super();
        this.target = target;
        this.initPhysic(physic);
        this.initVisual(mesh);
        this.initAnimation(mesh);
        this.spawnAwayFromTarget(target);
    }

    initPhysic(physic) {
        const { rigidBody, collider } = createRigidBodyEntityMob(this.position, physic);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    initVisual(mesh) {
        this.add(mesh);
    }

    initAnimation(mesh) {
        const animator = new Animator(mesh);
        animator.load(ATTACK, 0.3);
        animator.load(IDLE, 5);
        animator.load(RUN, 1);
        this.animator = animator;
    }

    spawnAwayFromTarget(target) {
        const offset = new Vector3(SPAWN_DISTANCE, 0, 0);
        offset.applyAxisAngle(new Vector3(0, 1, 0), Math.floor(2) * Math.PI * 2);
        this.position.copy(target.position.clone().add(offset));

        this.position.y = 0;

        this.rigidBody.setTranslation(this.position, true);
    }

    update(dt) {
        this.updateFollow(dt);
        this.updateAnimation(dt);
    }

    updateFollow(dt) {
        const followDistance = 1;
        const mobPosition = new Vector3().copy(this.rigidBody.translation());
        const playerPosition = new Vector3().copy(this.target.position);

        if (mobPosition.distanceTo(playerPosition) > followDistance) {
            const direction = new Vector3().subVectors(playerPosition, mobPosition).normalize();
            const moveDirection = direction.multiplyScalar(FOLLOW_SPEED * dt);

            const newPosition = mobPosition.add(moveDirection);

            newPosition.y = 0; 

            this.rigidBody.setTranslation(newPosition, true);
            this.position.copy(newPosition);

            const targetAngle = Math.atan2(direction.x, direction.z);
            const currentAngle = this.rotation.y;
            const deltaAngle = range(targetAngle, currentAngle);

            const rotationSpeed = 3 * dt;
            this.rotation.y += Math.sign(deltaAngle) * Math.min(Math.abs(deltaAngle), rotationSpeed);
        }
    }

    updateAnimation(dt) {
        if (this.target.position.distanceTo(this.position) > 1) {
            this.animator.play(RUN);
        } else {
            this.animator.play(IDLE);
        }
        this.animator.update(dt);
    }
}
