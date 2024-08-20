import { Scene } from 'three';
import Graphic from './engine/graphic';
import Camera from './engine/camera';
import Light from './engine/light';
import World from './entity/world';
import Player from './entity/player';
import Mob from './entity/mob';
import physic from './engine/physics';
import { loadWorld, loadEntity } from './tool/loader';

async function init() {
  const assetWorld = await loadWorld('./public/world1.glb');
  const assetPlayer = await loadEntity('./public/Persona.glb');
  const assetPlayer2 = await loadEntity('./public/mob1.glb');

  const scene = new Scene();
  const world = new World(assetWorld.visuals, assetWorld.colliders, physic);
  const light = new Light();
  const camera = new Camera();
  const graphic = new Graphic(scene, camera);
  const player = new Player(assetPlayer, physic);
  const mob = new Mob(assetPlayer2, physic, player);

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
}

init().catch((error) => console.error('Initialization failed:', error));