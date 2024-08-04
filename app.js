import { Scene } from 'three';
import Graphic from './engine/graphic';
import Camera from './engine/camera';
import Light from './engine/light';
import World from './entity/world';
import Player from './entity/player';
import Mob from './entity/mob';
import physic from './engine/physics';
import { loadWorld, loadEntity } from './tool/loader';

const assetW = await loadWorld('./public/world1.glb');
const assetP = await loadEntity('./public/persona.glb');
const assetP2 = await loadEntity('./public/mob1.glb');

const scene = new Scene();
const world = new World(assetW.visuals, assetW.colliders, physic);
const light = new Light();
const camera = new Camera();
const graphic = new Graphic(scene, camera);
const player = new Player(assetP, physic);
const mob = new Mob(assetP2, physic, player);

scene.add(world);
scene.add(light);
scene.add(player);
scene.add(mob);

graphic.onUpdate((dt) => {
  physic.step();
  player.update(dt);
  mob.update(dt);
  camera.update(player);
  light.update(player);
});

graphic.start();
