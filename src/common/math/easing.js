import { PI2 } from './function'

const { PI } = Math
const { cos } = Math
const { sin } = Math
const { sqrt } = Math

const easeInSine = (x) => {
	return 1 - cos((x * PI) / 2)
}

const easeOutSine = (x) => {
	return sin((x * PI) / 2)
}

const easeInOutSine = (x) => {
	return -(cos(PI * x) - 1) / 2
}

const easeInQuad = (x) => {
	return x * x
}

const easeOutQuad = (x) => {
	return 1 - (1 - x) * (1 - x)
}

const easeInOutQuad = (x) => {
	return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2
}

const easeInCubic = (x) => {
	return x * x * x
}

const easeOutCubic = (x) => {
	return 1 - (1 - x) ** 3
}

const easeInOutCubic = (x) => {
	return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2
}

const easeInQuart = (x) => {
	return x * x * x * x
}

const easeOutQuart = (x) => {
	return 1 - (1 - x) ** 4
}

const easeInOutQuart = (x) => {
	return x < 0.5 ? 8 * x * x * x * x : 1 - (-2 * x + 2) ** 4 / 2
}

const easeInQuint = (x) => {
	return x * x * x * x * x
}

const easeOutQuint = (x) => {
	return 1 - (1 - x) ** 5
}

const easeInOutQuint = (x) => {
	return x < 0.5 ? 16 * x * x * x * x * x : 1 - (-2 * x + 2) ** 5 / 2
}

const easeInExpo = (x) => {
	return x === 0 ? 0 : 2 ** (10 * x - 10)
}

const easeOutExpo = (x) => {
	return x === 1 ? 1 : 1 - 2 ** (-10 * x)
}

const easeInOutExpo = (x) => {
	return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2
}

const easeInCirc = (x) => {
	return 1 - sqrt(1 - x ** 2)
}

const easeOutCirc = (x) => {
	return sqrt(1 - (x - 1) ** 2)
}

const easeInOutCirc = (x) => {
	return x < 0.5 ? (1 - sqrt(1 - (2 * x) ** 2)) / 2 : (sqrt(1 - (-2 * x + 2) ** 2) + 1) / 2
}

const easeInBack = (x) => {
	const c1 = 1.70158
	const c3 = c1 + 1
	return c3 * x * x * x - c1 * x * x
}

const easeOutBack = (x, p = 1) => {
	const c1 = 1.70158 * p
	const c3 = c1 + 1
	return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
}

const easeInOutBack = (x) => {
	const c1 = 1.70158
	const c2 = c1 * 1.525
	return x < 0.5
		? ((2 * x) ** 2 * ((c2 + 1) * 2 * x - c2)) / 2
		: ((2 * x - 2) ** 2 * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
}

const easeInElastic = (x) => {
	const c4 = PI2 / 3
	return x === 0 ? 0 : x === 1 ? 1 : -(2 ** (10 * x - 10)) * sin((x * 10 - 10.75) * c4)
}

const easeOutElastic = (x) => {
	const c4 = PI2 / 3
	return x === 0 ? 0 : x === 1 ? 1 : 2 ** (-10 * x) * sin((x * 10 - 0.75) * c4) + 1
}

const easeInOutElastic = (x) => {
	const c5 = PI2 / 4.5
	return x === 0
		? 0
		: x === 1
			? 1
			: x < 0.5
				? -(2 ** (20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
				: (2 ** (-20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1
}

const easeInBounce = (x) => {
	return 1 - easeOutBounce(1 - x)
}

const easeOutBounce = (x) => {
	const n1 = 7.5625
	const d1 = 2.75
	if (x < 1 / d1) {
		return n1 * x * x
	}
	if (x < 2 / d1) {
		x -= 1.5
		return n1 * (x / d1) * x + 0.75
	}
	if (x < 2.5 / d1) {
		x -= 2.25
		return n1 * (x / d1) * x + 0.9375
	}
	x -= 2.625
	return n1 * (x / d1) * x + 0.984375
}

const easeInOutBounce = (x) => {
	return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2
}

export {
	easeInBack,
	easeInBounce,
	easeInCirc,
	easeInCubic,
	easeInElastic,
	easeInExpo,
	easeInOutBack,
	easeInOutBounce,
	easeInOutCirc,
	easeInOutCubic,
	easeInOutElastic,
	easeInOutExpo,
	easeInOutQuad,
	easeInOutQuart,
	easeInOutQuint,
	easeInOutSine,
	easeInQuad,
	easeInQuart,
	easeInQuint,
	easeInSine,
	easeOutBack,
	easeOutBounce,
	easeOutCirc,
	easeOutCubic,
	easeOutElastic,
	easeOutExpo,
	easeOutQuad,
	easeOutQuart,
	easeOutQuint,
	easeOutSine
}
