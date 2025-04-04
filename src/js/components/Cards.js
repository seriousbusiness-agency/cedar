import { Component } from '@common/components'
import { breakpoint, delayedCall, each, getProp, getRelativeRect, setProps } from '@common/util/function'
import gsap from 'gsap/all'

export default class Cards extends Component {
	bp
	currentItem
	pin
	request

	doStart = () => {
		this.queryChildren({
			wrapper: '.cards__wrapper',
			list: '.cards__list',
			items: ['.cards__item']
		})

		this.bp = breakpoint('desktop', () => {
			const firstItem = this.elements.items[0].element
			const secondItem = this.elements.items.length > 1 ? this.elements.items[1].element : firstItem
			let y = 0

			const values = {}
			const tl = gsap.timeline({
				paused: true,
				onUpdate: () => {
					let totalValue = 0
					let currentIndex = 0

					each(this.elements.items, (item, i) => {
						if (i) {
							const { value } = values[i]
							totalValue += value
							gsap.set(item.element, { y: totalValue * y })

							if (value > 0.25) currentIndex = i
						}
					})

					gsap.set(this.elements.wrapper, { y: totalValue * -(firstItem.clientHeight + y) })

					const nextItem = this.elements.items[currentIndex]
					if (nextItem !== this.currentItem && this.currentItem) {
						this.currentItem.pause()
						this.currentItem = nextItem
						this.currentItem.play()
					}
				}
			})
			each(this.elements.items, (item, i) => {
				if (i) {
					const obj = { value: 0 }
					tl.to(obj, { value: 1, ease: 'none' })
					values[i] = obj
				}
			})

			const resetMargin = (value) => {
				if (!this.element) return

				tl.progress(0)
				gsap.set(this.elements.wrapper, { clearProps: 'all' })

				if (value)
					each(this.elements.items, (item) => {
						if (item.element) {
							gsap.set(item.element, { clearProps: 'all' })
							setProps(item.element, { 'margin-top': 'unset' })
						}
					})
				else each(this.elements.items, (item) => setProps(item.element, { 'margin-top': '' }))
			}
			resetMargin(true)

			this.pin = gsap.timeline({
				scrollTrigger: {
					trigger: this.element,
					pin: true,
					pinSpacing: false,
					onRefreshInit: () => {
						resetMargin(false)
						y = parseFloat(getProp(secondItem, 'margin-top'))
						resetMargin(true)
					},
					onRefresh: () => {
						// fix, after pin lazyVideo trigger didOutView
						if (this.isInView && this.currentItem.play) requestAnimationFrame(() => this.currentItem.play())
					},
					start: () => {
						const listRect = getRelativeRect(this.elements.wrapper, this.elements.list)
						return `${firstItem.clientHeight * 0.5 + listRect.y} center`
					},
					end: () => `+=${this.elements.list.clientHeight - firstItem.clientHeight} center`,
					markers: false,
					invalidateOnRefresh: true,
					scrub: true,
					onUpdate: (self) => {
						tl.progress(self.progress)
					}
				}
			})

			const currentItem = this.elements.items[0]
			this.currentItem = currentItem
			this.currentItem.play()

			this.didResize()

			return () => {
				if (this.request) this.request.cancel()
				this.pin.scrollTrigger.kill()
				this.pin.kill()
				this.pin = null
				resetMargin(true)
				tl.kill()
			}
		})
	}

	didDispose = () => {
		if (this.bp) this.bp.revert()
	}

	didResize = () => {
		if (this.pin) {
			if (this.request) this.request.cancel()
			this.request = delayedCall(() => {
				this.pin.scrollTrigger.refresh()
			}, 1000)
		}
	}
}
