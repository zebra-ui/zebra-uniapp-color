<template>
	<!-- #ifdef MP-WEIXIN -->
	<view
		:class="['zebra-hue',direction === 'horizontal'?'zebra-hue--horizontal':'',direction === 'vertical'?'zebra-hue--vertical':'']">
		<view class="zebra-hue-container" @touchmove="hueWxs.touchmove" @touchstart="hueWxs.touchstart"
			:prop="direction" :change:prop="hueWxs.changeProp" :propPullDirection="pullDirection"
			:change:propPullDirection="hueWxs.changePropPullDirection">
			<view class="zebra-hue-pointer" :style="{top: pointerTop, left: pointerLeft}" role="presentation">
				<view class="zebra-hue-picker"></view>
			</view>
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifndef MP-WEIXIN -->
	<view
		:class="['zebra-hue',direction === 'horizontal'?'zebra-hue--horizontal':'',direction === 'vertical'?'zebra-hue--vertical':'']">
		<view class="zebra-hue-container" @touchmove.stop="handleChange" @touchstart.stop="handleChange"
			@mousedown="handleMouseDown">
			<view class="zebra-hue-pointer" :style="{top: pointerTop, left: pointerLeft}" role="presentation">
				<view class="zebra-hue-picker"></view>
			</view>
		</view>
	</view>
	<!-- #endif -->

</template>

<!-- #ifdef MP-WEIXIN -->
<script module="hueWxs" lang="wxs">
	var lastTime = null
	var direction = 'horizontal'
	var pullDirection = ''
	var lastTime = null

	function changeProp(newValue, oldValue, ownerInstance, instance) {
		direction = newValue
	}

	function changePropPullDirection(newValue, oldValue, ownerInstance, instance) {
		pullDirection = newValue
	}

	function touchstart(e, ins) {
		hueMethod(e, ins)
		return false
	}

	function touchmove(e, ins) {
		hueMethod(e, ins)
		return false
	}

	function hueMethod(e, ins) {
		var containerWidth = ins.selectComponent('.zebra-hue-container').getBoundingClientRect().width
		var containerHeight = ins.selectComponent('.zebra-hue-container').getBoundingClientRect().height

		var xOffset = ins.selectComponent('.zebra-hue-container').getBoundingClientRect().left
		var yOffset = ins.selectComponent('.zebra-hue-container').getBoundingClientRect().top
		var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
		var pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0)
		var left = pageX - xOffset
		var top = pageY - yOffset

		var h
		var percent

		if (direction === 'vertical') {
			if (top < 0) {
				h = 360
			} else if (top > containerHeight) {
				h = 0
			} else {
				percent = -(top * 100 / containerHeight) + 100
				h = (360 * percent / 100)
			}
			var top
			if (h === 0 && pullDirection === 'right') {
				top = 0
			} else {
				top = -((h * 100) / 360) + 100 + '%'
			}

			ins.selectComponent('.zebra-hue-pointer').setStyle({
				left: 0,
				top: top
			})
			var currentTime = Date.now()
			if (currentTime - lastTime >= 50) {
				ins.callMethod("onChangeWxs", {
					h
				})
				lastTime = currentTime
			}
		} else {
			if (left < 0) {
				h = 0
			} else if (left > containerWidth) {
				h = 360
			} else {
				percent = left * 100 / containerWidth
				h = (360 * percent / 100)
			}

			var left
			if (h === 0 && pullDirection === 'right') {
				left = '100%'
			} else {
				left = (h * 100) / 360 + '%'
			}

			ins.selectComponent('.zebra-hue-pointer').setStyle({
				left: left,
				top: 0
			})
			var currentTime = Date.now()
			if (currentTime - lastTime >= 50) {
				ins.callMethod("onChangeWxs", {
					h
				})
				lastTime = currentTime
			}
		}
	}

	module.exports = {
		touchstart: touchstart,
		touchmove: touchmove,
		changeProp: changeProp,
		changePropPullDirection: changePropPullDirection
	}
</script>
<!-- #endif -->

<script>
	export default {
		name: 'Hue',
		props: {
			value: Object,
			direction: {
				type: String,
				default: 'horizontal'
			}
		},
		data() {
			return {
				oldHue: 0,
				pullDirection: ''
			}
		},
		computed: {
			colors() {
				const h = this.value.hsl.h
				if (h !== 0 && h - this.oldHue > 0) this.pullDirection = 'right'
				if (h !== 0 && h - this.oldHue < 0) this.pullDirection = 'left'
				this.oldHue = h

				return this.value
			},
			directionClass() {
				return {
					'zebra-hue--horizontal': this.direction === 'horizontal',
					'zebra-hue--vertical': this.direction === 'vertical'
				}
			},
			pointerTop() {
				if (this.direction === 'vertical') {
					if (this.colors.hsl.h === 0 && this.pullDirection === 'right') return 0
					return -((this.colors.hsl.h * 100) / 360) + 100 + '%'
				} else {
					return 0
				}
			},
			pointerLeft() {
				if (this.direction === 'vertical') {
					return 0
				} else {
					if (this.colors.hsl.h === 0 && this.pullDirection === 'right') return '100%'
					return (this.colors.hsl.h * 100) / 360 + '%'
				}
			}
		},
		methods: {
			onChangeWxs(data) {
				this.$emit('change', {
					h: data.h,
					s: this.colors.hsl.s,
					l: this.colors.hsl.l,
					a: this.colors.hsl.a,
					source: 'hsl'
				})
			},
			handleChange(e, skip) {
				const query = uni.createSelectorQuery().in(this);
				query.select('.zebra-hue-container').boundingClientRect(data => {
					if (!data) {
						return
					}
					var containerWidth = data.width
					var containerHeight = data.height

					var xOffset = data.left
					var yOffset = data.top
					var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
					var pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0)
					var left = pageX - xOffset
					var top = pageY - yOffset

					var h
					var percent

					if (this.direction === 'vertical') {
						if (top < 0) {
							h = 360
						} else if (top > containerHeight) {
							h = 0
						} else {
							percent = -(top * 100 / containerHeight) + 100
							h = (360 * percent / 100)
						}

						if (this.colors.hsl.h !== h) {
							this.$emit('change', {
								h: h,
								s: this.colors.hsl.s,
								l: this.colors.hsl.l,
								a: this.colors.hsl.a,
								source: 'hsl'
							})
						}
					} else {
						if (left < 0) {
							h = 0
						} else if (left > containerWidth) {
							h = 360
						} else {
							percent = left * 100 / containerWidth
							h = (360 * percent / 100)
						}

						if (this.colors.hsl.h !== h) {
							this.$emit('change', {
								h: h,
								s: this.colors.hsl.s,
								l: this.colors.hsl.l,
								a: this.colors.hsl.a,
								source: 'hsl'
							})
						}
					}
				}).exec();
			},
			handleMouseDown(e) {
				this.handleChange(e, true)
				window.addEventListener('mousemove', this.handleChange)
				window.addEventListener('mouseup', this.handleMouseUp)
			},
			handleMouseUp(e) {
				this.unbindEventListeners()
			},
			unbindEventListeners() {
				window.removeEventListener('mousemove', this.handleChange)
				window.removeEventListener('mouseup', this.handleMouseUp)
			}
		}
	}
</script>

<style>
	.zebra-hue {
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
		border-radius: 4rpx;
	}

	.zebra-hue--horizontal {
		background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
	}

	.zebra-hue--vertical {
		background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
	}

	.zebra-hue-container {
		cursor: pointer;
		margin: 0 4rpx;
		position: relative;
		height: 100%;
	}

	.zebra-hue-pointer {
		z-index: 2;
		position: absolute;
	}

	.zebra-hue-picker {
		cursor: pointer;
		margin-top: 2rpx;
		width: 8rpx;
		border-radius: 2rpx;
		height: 16rpx;
		box-shadow: 0 0 4rpx rgba(0, 0, 0, .6);
		background: #fff;
		transform: translateX(-4rpx);
	}
</style>
