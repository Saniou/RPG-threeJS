export default class Keyboard {
  constructor() {
    this.keys = {};
    this.SPEED = 3;

    window.addEventListener('keydown', (event) => this.onKeyDown(event), false);
    window.addEventListener('keyup', (event) => this.onKeyUp(event), false);
  }

  onKeyDown(event) {
    this.keys[event.code] = true;
  }

  onKeyUp(event) {
    this.keys[event.code] = false;
  }

  get x() {
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      return -this.SPEED;
    } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      return this.SPEED;
    } else {
      return 0;
    }
  }

  get z() {
    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      return -this.SPEED;
    } else if (this.keys['ArrowDown'] || this.keys['KeyS']) {
      return this.SPEED;
    } else {
      return 0;
    }
  }

  get moving() {
    return this.x !== 0 || this.z !== 0;
  }

  get angle() {
    return Math.atan2(this.z, this.x)
  }

}
