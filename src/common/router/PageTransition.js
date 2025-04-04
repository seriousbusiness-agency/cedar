import { Component } from '@common/components'
import { queryAll, setProps, removeClass, each, setAttributes, getRect, getProp } from '@common/util/function'
import gsap from 'gsap'

export default class Transition extends Component {
	hiding
	showing

	onHide
	onShow
	tl

	hideDone

	constructor() {
		super('.page-transition')

		this.elements = queryAll({
			items: ['.page-transition__item-wrapper'],
			list: '.page-transition__items'
		})

		this.initialPath = 'path("M 1443 26 C1233 0, 1433 6.5, 0 6.5")'
		this.finalPath = 'path("M 1443 26 C0 26, 721.5 26, 0 26")'

		each(this.elements.items, (item, i) => {
			setAttributes(item, { index: i })
		})

		this.elements.list.innerHTML = ''
		this.#updateList()
	}

	hide = () => {
		if (this.hiding) return this

		this.hideDone = false
		this.hiding = true

		if (!this.element.parentNode) {
			document.body.appendChild(this.element)
		}

		gsap.fromTo(this.element, { '--opacity': 0 }, { '--opacity': 1, duration: 0.45, ease: 'Quart.easeOut' })

		gsap.fromTo(
			this.elements.itemsCopied,
			{ y: '-101%' },
			{
				y: '0%',
				duration: 0.45,
				'pointer-events': 'none',
				ease: 'Quart.easeOut',
				stagger: 0.02,
				onStart: () => {
					removeClass(this.element, 'hidden')
				},
				onComplete: () => {}
			}
		)

		setTimeout(() => {
			this.showing = false
			this.hideDone = true
			if (this.onHide) this.onHide()
		}, 550)

		return this
	}

	show = () => {
		if (this.showing) return this

		this.hideDone = false
		this.hiding = false
		this.showing = true

		gsap.to(this.elements.itemsCopied, {
			y: '101%',
			duration: 0.3,
			ease: 'Quart.easeOut',
			'pointer-events': 'none',
			stagger: 0.02,
			onStart: () => {
				if (!this.element.parentNode) document.body.appendChild(this.element)
				gsap.fromTo(
					this.element,
					{ '--opacity': 1 },
					{ '--opacity': 0, duration: 0.75, delay: 0.3, ease: 'Quart.easeOut' }
				)
			},
			onComplete: () => {
				this.isAnimating = false
				this.isOpen = true
			}
		})

		return this
	}

	#interpolatePaths = (initial, final, steps) => {
		// Extract control points from the paths using regex
		const getControlPoints = (path) => {
			const matches = path.match(
				/M\s*(\d*\.?\d+)\s+(\d*\.?\d+)\s+C\s*(\d*\.?\d+)\s+(\d*\.?\d+),\s*(\d*\.?\d+)\s+(\d*\.?\d+),\s*(\d*\.?\d+)\s+(\d*\.?\d+)/
			)
			return matches ? matches.slice(1).map(Number) : null
		}

		const initialPoints = getControlPoints(initial)
		const finalPoints = getControlPoints(final)

		const interpolatedPaths = []

		for (let i = 0; i <= steps; i++) {
			const t = i / steps
			const interpolatedPoints = []

			// Interpolate each coordinate
			for (let j = 0; j < 8; j++) {
				const value = initialPoints[j] + (finalPoints[j] - initialPoints[j]) * t
				// Remove Math.round to keep decimal precision
				interpolatedPoints.push(value.toFixed(1))
			}

			const path = `path("M ${interpolatedPoints[0]} ${interpolatedPoints[1]} C${interpolatedPoints[2]} ${interpolatedPoints[3]}, ${interpolatedPoints[4]} ${interpolatedPoints[5]}, ${interpolatedPoints[6]} ${interpolatedPoints[7]}")`
			interpolatedPaths.push(path)
		}

		return interpolatedPaths
	}

	#updateList = () => {
		const { children } = this.elements.list

		each(children, (child) => {
			const rect = getRect(child)
			if (rect.maxY < 0 || rect.y > window.innerHeight) {
				child.remove()
			}
		})

		let firstChild = children[0]
		let lastChild = children[children.length - 1]

		if (!firstChild) {
			firstChild = this.elements.items[0].cloneNode(true)
			lastChild = firstChild
			setProps(firstChild, { '--i': 0 })
			this.elements.list.appendChild(firstChild)
		}

		this.#fixLoop(firstChild, -1)
		this.#fixLoop(lastChild, 1)
	}

	#fixLoop = (element, direction = 1) => {
		const isDown = direction > 0

		const y = isDown ? getRect(element).maxY : getRect(element).y
		if ((isDown && y < window.innerHeight) || (!isDown && y > 0)) {
			const maxIndex = this.elements.items.length - 1

			let nextIndex = parseInt(element.attributes.index.value, 10) + direction
			const nextI = parseInt(getProp(element, '--i'), 10) + direction
			if (nextIndex < 0) nextIndex = maxIndex
			if (nextIndex > maxIndex) nextIndex = 0

			const nextElement = this.elements.items[nextIndex].cloneNode(true)

			if (nextElement) {
				setProps(nextElement, { '--i': nextI })

				if (direction > 0) this.elements.list.appendChild(nextElement)
				else this.elements.list.insertBefore(nextElement, element)
				this.#fixLoop(nextElement, direction)
			}
		} else {
			this.#setupItems()
		}
	}
	#setupItems = () => {
		this.elements.itemsCopied = queryAll('.page-transition__item-container')

		this.interpolatedPaths = this.#interpolatePaths(
			this.initialPath,
			this.finalPath,
			this.elements.itemsCopied.length * 1.4
		)
		this.elements.itemsCopied.forEach((item, i) => {
			const path = item.parentElement.querySelector('path')
			setProps(path, { d: this.interpolatedPaths[i] })
		})
	}

	didResize = () => {
		// this.#updateList()
	}
}
