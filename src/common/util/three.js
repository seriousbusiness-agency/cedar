import { Object3D, Vector2, Vector3 } from 'three'

class Vertex {
	index

	geometry

	geometryArr

	constructor(index, geometry) {
		this.index = index
		this.geometry = geometry
		this.geometryArr = geometry.attributes.position.array
	}

	get x() {
		return this.geometryArr[this.index]
	}

	set x(value) {
		this.geometryArr[this.index] = value
		this.needsUpdate()
	}

	get y() {
		return this.geometryArr[this.index + 1]
	}

	set y(value) {
		this.geometryArr[this.index + 1] = value
		this.needsUpdate()
	}

	get z() {
		return this.geometryArr[this.index + 2]
	}

	set z(value) {
		this.geometryArr[this.index + 2] = value
		this.needsUpdate()
	}

	needsUpdate = () => {
		this.geometry.attributes.position.needsUpdate = true
	}
}

const getVertexList = (geometry) => {
	const totalValues = geometry.attributes.position.array.length
	const vertexList = geometry.vertexList || []

	if (!geometry.vertexList) {
		for (let i = 0; i < totalValues; i += 3) {
			vertexList.push(new Vertex(i, geometry))
		}
		geometry.vertexList = vertexList
	}

	return vertexList
}

const toScreenPosition = (position, camera, canvas) => {
	const vector = position.clone()
	const widthHalf = 0.5 * canvas.width
	const heightHalf = 0.5 * canvas.height
	vector.project(camera)
	return new Vector2((vector.x + 1) * widthHalf, -(vector.y - 1) * heightHalf)
}

const toWorldPosition = (pointer, camera) => {
	const vector = new Vector3()
	const pos = new Vector3()
	vector.set(pointer.x, pointer.y, 1)
	vector.unproject(camera)
	vector.sub(camera.position).normalize()
	const distance = -camera.position.z / vector.z
	return pos.copy(camera.position).add(vector.multiplyScalar(distance))
}

const destroyObject = (obj) => {
	if (!(obj instanceof Object3D)) return false
	if (obj.geometry) obj.geometry.dispose()
	if (obj.material) {
		if (obj.material instanceof Array) obj.material.forEach((material) => material.dispose())
		else obj.material.dispose()
	}
	obj.removeFromParent()
}

export { Vertex, destroyObject, getVertexList, toScreenPosition, toWorldPosition }
