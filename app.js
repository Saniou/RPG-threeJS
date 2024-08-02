import { Scene } from 'three'
import Graphic from './engine/graphic'
import Camera from './engine/camera'
import Light from './engine/light'
import World from './entity/world'
import Player from './entity/player'
import physic from './engine/physics'
import {loadWorld, loadEntity} from './tool/loader'

const assetW = await loadWorld('./public/world0.glb')
const assetP = await loadEntity('./public/character1.gltf')

const scene = new Scene()
const world = new World(assetW.visuals, assetW.colliders, physic)
const light = new Light()
const camera = new Camera()
const graphic = new Graphic(scene, camera)
const player = new Player(assetP, physic)

scene.add(world)
scene.add(light)
scene.add(player)

graphic.onUpdate((dt) => {
    physic.step()
    player.update(dt)
    camera.update(player)
    light.update(player)
})

graphic.start()