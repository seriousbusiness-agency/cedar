import gsap from 'gsap'

const killTweensOf = (targets) => {
	targets = Array.isArray(targets) ? targets : [targets]
	targets.forEach((target) => {
		gsap.killTweensOf(target)
	})
}

export { killTweensOf }
