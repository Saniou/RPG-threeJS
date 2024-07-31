import RAPIER from "@dimforge/rapier3d-compat";

await RAPIER.init()

export default new RAPIER.World({x: 0, y: -9.81, z: 0})