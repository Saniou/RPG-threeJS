import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d-compat'

export function getCanvas() {
  const canvas = document.getElementsByTagName('canvas')[0]
  canvas.width = innerWidth
  canvas.height = innerHeight
  return canvas
}

function createColliderBall(radius, rigidBody, physic) {
  const colliderDesc = ColliderDesc.ball(radius)
  return physic.createCollider(colliderDesc, rigidBody)
}

function createColliderGeo(geo, rigidBody, physic) {
  const vertices = new Float32Array(geo.attributes.position.array)
  const indices = new Float32Array(geo.index.array)
  const colliderDesc = ColliderDesc.trimesh(vertices, indices)
  return physic.createCollider(colliderDesc, rigidBody)
}

export function createRigidBodyFixed(mesh, physic) {
  const rigidBodyDesc = RigidBodyDesc.fixed()
  const rigidBody = physic.createRigidBody(rigidBodyDesc)
  createColliderGeo(mesh.geometry, rigidBody, physic)
}

export function createRigidBodyEntity(position, physic) {
  const rigidBodyDesc = RigidBodyDesc.dynamic()
  rigidBodyDesc.setTranslation(...position)
  const rigidBody = physic.createRigidBody(rigidBodyDesc)
  const collider = createColliderBall(0.25, rigidBody, physic)
  return { rigidBody, collider }
}

export function floor(float, max = 0.2) {
  return Math.abs(float) < max ? 0 : float
}

export function findByName(name, list) {
  return list.find((a) => name === a.name)
}

export function browse(object, callback) {
  if (object.isMesh) callback(object)
  const children = object.children
  for (let i = 0; i < children.length; i++) {
    browse(children[i], callback)
  }
}

Math.angle = function angle(x, z) {
  return Math.atan2(-z, x) + Math.PI / 2
}

export function range(angle1, angle2) {
  let angle = ((angle1 - angle2 + Math.PI) % (Math.PI * 2)) - Math.PI
  angle < -Math.PI ? angle + Math.PI * 2 : angle
  return angle
}