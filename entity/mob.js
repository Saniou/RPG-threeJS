import { Object3D, Vector3 } from 'three';
import { createRigidBodyEntityMob } from '../tool/function';
import Animator from './animation';

const FOLLOW_SPEED = 1;
const ATTACK = 'attack';
const IDLE = 'idle';
const RUN = 'walk';

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
        this.spawnAwayFromTarget(target, 2);
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

    spawnAwayFromTarget(target, distance) {
        const offset = new Vector3(
            (Math.random(3, 5) - 0.5) * distance * 2,
            0,
            (Math.random() - 0.5) * distance * 2
        );
        this.position.copy(target.position.clone().add(offset));

        // Установлюємо висоту моба
        this.position.y = 0; // Не допускаємо негативні координати

        this.rigidBody.setTranslation(this.position, true);
    }

    update(dt) {
        this.updateFollow(dt);
        this.updateAnimation(dt);
    }

    updateFollow(dt) {
        const followDistance = 1;
        const stopDistance = 0.5; // Відстань, на якій моб зупиняється

        const mobPosition = new Vector3().copy(this.rigidBody.translation());
        const playerPosition = new Vector3().copy(this.target.position);

        const distanceToPlayer = mobPosition.distanceTo(playerPosition);

        if (distanceToPlayer > followDistance) {
            const direction = new Vector3().subVectors(playerPosition, mobPosition).normalize();
            const moveDirection = direction.multiplyScalar(FOLLOW_SPEED * dt);

            // Оновлюємо нову позицію моба
            const newPosition = mobPosition.add(moveDirection);

            // Переконуємося, що моб не провалюється
            newPosition.y = 0; // Не допускаємо негативні координати

            this.rigidBody.setTranslation(newPosition, true);
            this.position.copy(newPosition);

            // Поворот моба до персонажа
            const targetAngle = Math.atan2(direction.x, direction.z);
            const currentAngle = this.rotation.y;
            const deltaAngle = range(targetAngle, currentAngle);

            // Обмеження кута обертання
            const rotationSpeed = Math.PI * dt;
            this.rotation.y += Math.sign(deltaAngle) * Math.min(Math.abs(deltaAngle), rotationSpeed);
        } else if (distanceToPlayer <= stopDistance) {
            // Якщо моб досяг зупиненої відстані, зупиняємося
            this.rigidBody.setTranslation(mobPosition, true);
            this.position.copy(mobPosition);

            // Поворот моба до персонажа
            const targetAngle = Math.atan2(playerPosition.x - mobPosition.x, playerPosition.z - mobPosition.z);
            const currentAngle = this.rotation.y;
            const deltaAngle = range(targetAngle, currentAngle);

            // Обмеження кута обертання
            const rotationSpeed = Math.PI * dt;
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
