export const PI2 = Math.PI * 2
export const { PI } = Math

/**
 *
 * @param {{x:Number, y:Number}} startPoint
 * @param {{x:Number, y:Number}} endPoint
 * @returns
 */
export const getAngle = (startPoint, endPoint) => {
	const difX = Math.round(endPoint.x - startPoint.x)
	const difY = Math.round(endPoint.y - startPoint.y)
	return Math.atan2(difY, difX)
}

/**
 *
 * @param {Number} angle
 * @returns
 */
export const normalizeAngle = (angle) => {
	const turns = angle / PI2
	const pct = turns - Math.floor(turns)
	return pct * PI2
}

export const toFixed = (value, places = 5) => {
	return parseFloat(value.toFixed(places))
}

export const normalizePct = (value) => {
	return Math.max(Math.min(value, 1), 0)
}

export const clamp = (number, min, max) => {
	return Math.max(min, Math.min(number, max))
}

export const abs = (value) => {
	return Math.abs(value)
}

export const pow = (value, exp = 2) => {
	return value ** exp
}

export const hypot = (a, b) => {
	return Math.hypot(a, b)
}

export const random = (value = 1) => {
	return Math.random() * value
}

export const degree2Radian = (degrees) => {
	return (degrees * Math.PI) / 180
}

export const radian2Degree = (radians) => {
	return (radians * 180) / Math.PI
}
