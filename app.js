import { Scene } from 'three'
import Graphic from './engine/graphic'
import Camera from './engine/camera'
import Light from './engine/light'
import World from './entity/world'
import loadAssets from './tool/loader'
import Player from './entity/player'
import physic from './engine/physics'

const meshes = await loadAssets('./public/world0.glb')

const scene = new Scene()
const world = new World(meshes.visuals, meshes.colliders, physic)
const light = new Light()
const camera = new Camera()
const graphic = new Graphic(scene, camera)
const player = new Player(meshes.players[0], physic)

scene.add(world)
scene.add(light)
scene.add(player)

graphic.onUpdate((dt) => {
    physic.step()
    player.update()
    camera.update(player)
    light.update(player)
})

graphic.start()