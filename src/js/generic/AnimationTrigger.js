import EventEmitter from 'events'
import gsap, { Quad } from 'gsap'
import { Observer } from '@common/observer'
import { addClass, each, queryAll, removeClass, setProps, splitText, hasClass } from '@common/util/function'

Observer.create('anim-trigger', { root: null, rootMargin: '0px', threshold: 0 })

export default class AnimationTrigger extends EventEmitter {
	triggers
	started

	constructor(triggers) {
		super()
		this.triggers = triggers
	}

	init = () => {
		if (this.started) return
		this.started = true
		each(this.triggers, (el) => {
			if (!el.isTriggerObserving) {
				Observer.observe('anim-trigger', el, AnimationTrigger.#handler)
				el.isTriggerObserving = true
			}
		})
		this.emit('init')
	}

	static scan(rootEl, forceReset) {
		const ignoredElements = [...queryAll(`[ignore-data-anim] [data-anim]`, rootEl)]
		const triggers = queryAll('[data-anim]', rootEl)
		const filtered = []
		each(triggers, (el) => {
			if (!ignoredElements.includes(el)) {
				AnimationTrigger.add(el, forceReset)
				filtered.push(el)
			}
		})
		return new AnimationTrigger(filtered)
	}

	static add(el, forceReset) {
		if (forceReset) removeClass(el, 'once-inview')
		if (hasClass(el, 'once-inview') || el.isTriggerObserving) return
		setProps(el, { opacity: 0 })
	}

	static #handler(el, entry, observer) {
		if (entry.isIntersecting) {
			const {
				'data-anim': data,
				'data-anim-duration': duration,
				'data-anim-delay': delay,
				'data-anim-stagger': stagger,
				'data-anim-params': animParams,
				'data-anim-keep': keep
			} = el.attributes

			const params = {
				duration: duration ? parseFloat(duration.value) : 0.75,
				delay: delay ? parseFloat(delay.value) : 0.1,
				stagger: stagger ? parseFloat(stagger.value) : 0,
				animParams: animParams ? JSON.parse(animParams.value) : {},
				keep
			}

			setProps(el, { opacity: '' })

			switch (data.value) {
				case 'lines':
					AnimationTrigger.showSplitText(el, { ...params, type: 2 })
					break
				case 'words':
					AnimationTrigger.showSplitText(el, { ...params, type: 1 })
					break
				case 'chars':
					AnimationTrigger.showSplitText(el, { ...params, type: 0 })
					break
				case 'slideup':
					gsap.from(el, {
						y: '101%',
						duration: params.duration,
						ease: Quad.easeOut
					})
					break
				case 'title':
					{
						addClass(el, 'split-text')
						const split = splitText(el)
						const lines = split.splitLines()
						const root = split.getRoot()

						setProps(el.firstChild, { perspective: '1000px' })
						setProps(root.children, { 'transform-style': 'preserve-3d' })

						const timeline = gsap.timeline({
							delay: params.delay,
							onComplete: () => {
								if (!params.keep) {
									split.revert(true)
									requestAnimationFrame(() => removeClass(el, 'split-text'))
								}
							}
						})

						each(lines, (line, i) => {
							setProps(line, { 'transform-origin': '50% 0' })

							const words = queryAll('.word', line)
							const $stagger = i / (params.stagger || 6)
							timeline.fromTo(
								words,
								{ y: '100%' },
								{ y: 0, duration: params.duration, ease: 'Quart.easeOut' },
								$stagger
							)
							timeline.fromTo(
								line,
								{ rotateX: '-35deg', rotateY: '-5deg', z: '-1rem' },
								{ rotateX: '0deg', rotateY: '0deg', z: '0rem', duration: params.duration, ease: 'Quad.easeOut' },
								$stagger
							)
						})
					}
					break
				case 'fadein':
					AnimationTrigger.showFadeIn(el, { ...params })
					break
				case 'fadeinkeep':
					AnimationTrigger.showFadeInAndKeep(el, { ...params })
					break
				case 'number': {
					AnimationTrigger.animateNumber(el)
					break
				}
				case 'grow-num':
					{
						const num = parseFloat(el.innerHTML)
						el.innerHTML = 0
						const dataNum = { value: 0 }
						gsap.to(dataNum, {
							value: num,
							duration: 0.75,
							delay: params.delay,
							ease: 'Circ.easeInOut',
							onUpdate: () => {
								el.innerHTML = Math.floor(dataNum.value)
							}
						})
					}
					break
				default:
					if (data.value) {
						if (params.stagger) {
							each(el.children, (child, i) => {
								setProps(child, { '--delay': `${(i * params.stagger).toFixed(3)}s` })
								addClass(child, data.value)
							})
						} else {
							if (delay) setProps(el, { '--delay': `${params.delay}s` })
							addClass(el, data.value)
						}
					}
			}

			requestAnimationFrame(() => {
				addClass(el, 'once-inview')
				el.isTriggerObserving = false
			})
			Observer.unobserve(observer.id, el, AnimationTrigger.#handler)
		}
	}

	static showFadeInAndKeep = (el, params) => {
		gsap.from(params.stagger ? el.children : el, {
			opacity: 0,
			y: `${params.animParams && Number.isFinite(params.animParams.pos) ? params.animParams.pos : 2}rem`,
			duration: params.duration,
			ease: 'Quart.easeOut',
			delay: params.delay,
			stagger: params.stagger
		})
	}

	static showFadeIn = (el, params) => {
		gsap.fromTo(
			params.stagger ? el.children : el,
			{
				opacity: 0,
				y: `${params.animParams && Number.isFinite(params.animParams.pos) ? params.animParams.pos : 2}rem`
			},
			{
				opacity: 1,
				y: 0,
				duration: params.duration,
				ease: 'Quart.easeOut',
				delay: params.delay,
				stagger: params.stagger,
				force3D: false,
				onComplete: () => {
					if (params.onComplete) params.onComplete()
				}
			}
		)
	}

	static hideFadeIn = (el, params) => {
		gsap.fromTo(
			params.stagger ? el.children : el,
			{
				opacity: 1,
				y: 0
			},
			{
				opacity: 0,
				y: `-${params.animParams && Number.isFinite(params.animParams.pos) ? params.animParams.pos : 1.5}rem`,
				duration: params.duration,
				ease: 'Quart.easeOut',
				delay: params.delay,
				stagger: params.stagger
			}
		)
	}

	static animateNumber = (el, callback) => {
		const text = el.innerHTML
		const finalNum = parseInt(text.replace(/\D+/g, ''), 10)
		const dataNum = {
			value: 0
		}

		const updateNum = () => {
			const numStr = Math.round(dataNum.value).toString()
			let fnalStr = ''

			let h = 0
			let lastChar = ''
			for (let i = 0; i < text.length; i++) {
				const j = text.length - 1 - i
				let char = text.charAt(j)
				if (!Number.isNaN(parseInt(char, 10))) {
					char = numStr.charAt(numStr.length - 1 - h)
					h++
					if ((lastChar === '.' || lastChar === ',') && Number.isNaN(parseInt(char, 10))) char = '0'
				}
				lastChar = char
				fnalStr = char + fnalStr
			}

			el.innerHTML = fnalStr
		}
		updateNum()
		gsap.to(dataNum, {
			value: finalNum,
			duration: 1.5,
			ease: 'Quart.easeOut',
			onUpdate: () => {
				updateNum()
				if (callback) callback()
			},
			delay: 0.15
		})
	}

	static showSplitText = (el, params) => {
		addClass(el, 'split-text')

		// Check for data-anim-adjust attribute before splitting
		const shouldAdjust = el.hasAttribute('data-anim-adjust')
		if (shouldAdjust) {
			AnimationTrigger.adjustTitleFontSize(el, el.textContent)
		}

		const split = splitText(el, params.type, true)

		if (!params.type) addClass(el, 'chars')

		const parts = split.getParts()

		if (!parts.length) return

		const timeline = gsap.timeline({
			delay: params.delay,
			onComplete: () => {
				if (params.onComplete) params.onComplete()

				if (!params.keep) {
					if (split) split.revert(true)
					requestAnimationFrame(() => removeClass(el, 'split-text'))
				}
			}
		})

		if (params.type === 2) {
			const lines = split.getLines()
			const speed = params.speed ? params.speed : 10

			each(lines, (line, i) => {
				timeline.from(
					line,
					{
						y: '101%',
						duration: params.duration,
						ease: 'Quart.easeOut'
						// clearProps: 'all'
					},
					i / speed
				)
			})
			return
		}

		timeline.from(
			parts,
			{
				y: '101%',
				duration: params.duration,
				ease: 'Quart.easeOut',
				stagger: params.stagger || (!params.type ? 0.015 : 0.05)
				// clearProps: 'all'
			},
			0
		)
	}

	static hideSplitText = (el, params, keep = false, forceReset = false) => {
		const parts = queryAll('.word', el)
		if (parts && parts.length) {
			gsap.to(parts, {
				y: '-100%',
				duration: params.duration,
				ease: Quad.easeOut,
				delay: params.delay,
				clearProps: !keep ? 'all' : '',
				onComplete: () => {
					if (forceReset) {
						gsap.set(parts, { y: '101%' })
					}
				}
			})
		}
	}

	static adjustTitleFontSize = (el, text) => {
		if (!el) return

		const fakeEl = document.createElement('div')
		setProps(fakeEl, {
			position: 'absolute',
			opacity: '0',
			'pointer-events': 'none',
			'white-space': 'nowrap',
			'word-break': 'keep-all'
		})

		document.body.appendChild(fakeEl)
		const container = el.parentElement
		const words = text.split(' ')
		const currentSize = parseInt(window.getComputedStyle(el).fontSize, 10)

		const checkFontSize = (size) => {
			fakeEl.style.fontSize = `${size}px`
			return words.some((word) => {
				fakeEl.textContent = word
				return fakeEl.scrollWidth > container.clientWidth
			})
		}

		// Start with current font size and only decrease if needed
		if (checkFontSize(currentSize)) {
			const sizes = Array.from({ length: currentSize - 1 }, (_, i) => currentSize - i - 1)
			const appropriateSize = sizes.find((size) => !checkFontSize(size)) || 1
			el.style.fontSize = `${appropriateSize}px`
		}

		document.body.removeChild(fakeEl)
	}
}
