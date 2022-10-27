<template>
	<view class="zebra-alpha">
		<view class="zebra-alpha-checkboard-wrap">
			<checkboard></checkboard>
		</view>
		<view class="zebra-alpha-gradient" :style="{background: gradientColor}"></view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="zebra-alpha-container" @touchmove="alphaWxs.touchmove" @touchstart="alphaWxs.touchstart">
			<view class="zebra-alpha-pointer" :style="{left: colors.a * 100 + '%'}">
				<view class="zebra-alpha-picker"></view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="zebra-alpha-container" @touchmove.stop="handleChange" @touchstart.stop="handleChange"
			@mousedown="handleMouseDown">
			<view class="zebra-alpha-pointer" :style="{left: colors.a * 100 + '%'}">
				<view class="zebra-alpha-picker"></view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<!-- #ifdef MP-WEIXIN -->
<script module="alphaWxs" lang="wxs">
	var lastTime = null

	function touchstart(e, ins) {
		alphaMethod(e, ins)
		return false
	}

	function touchmove(e, ins) {
		alphaMethod(e, ins)
		return false
	}

	function alphaMethod(e, ins) {
		var containerWidth = ins.selectComponent('.zebra-alpha-container').getBoundingClientRect().width
		var xOffset = ins.selectComponent('.zebra-alpha-container').getBoundingClientRect().left
		var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
		var left = pageX - xOffset

		var a
		if (left < 0) {
			a = 0
		} else if (left > containerWidth) {
			a = 1
		} else {
			a = Math.round(left * 100 / containerWidth) / 100
		}
		ins.selectComponent('.zebra-alpha-pointer').setStyle({
			left: a * 100 + '%'
		})
		var currentTime = Date.now()
		if (currentTime - lastTime >= 50) {
			ins.callMethod("onChangeWxs", {
				a
			})
			lastTime = currentTime
		}
	}

	module.exports = {
		touchstart: touchstart,
		touchmove: touchmove
	}
</script>
<!-- #endif -->

<script>
	import checkboard from './Checkboard.vue'

	export default {
		name: 'Alpha',
		props: {
			value: Object,
			onChange: Function
		},
		components: {
			checkboard
		},
		computed: {
			colors() {
				return this.value
			},
			gradientColor() {
				var rgba = this.colors.rgba
				var rgbStr = [rgba.r, rgba.g, rgba.b].join(',')
				return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)'
			}
		},
		methods: {
			onChangeWxs(data) {
				this.$emit('change', {
					h: this.colors.hsl.h,
					s: this.colors.hsl.s,
					l: this.colors.hsl.l,
					a: data.a,
					source: 'rgba'
				})
			},
			handleChange(e, skip) {
				const query = uni.createSelectorQuery().in(this);
				query.select('.zebra-alpha-container').boundingClientRect(data => {
					if (!data) {
						return
					}
					var containerWidth = data.width

					var xOffset = data.left
					var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
					var left = pageX - xOffset

					var a
					if (left < 0) {
						a = 0
					} else if (left > containerWidth) {
						a = 1
					} else {
						a = Math.round(left * 100 / containerWidth) / 100
					}

					if (this.colors.a !== a) {
						this.$emit('change', {
							h: this.colors.hsl.h,
							s: this.colors.hsl.s,
							l: this.colors.hsl.l,
							a: a,
							source: 'rgba'
						})
					}
				}).exec();
			},
			handleMouseDown(e) {
				this.handleChange(e, true)
				window.addEventListener('mousemove', this.handleChange)
				window.addEventListener('mouseup', this.handleMouseUp)
			},
			handleMouseUp() {
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
	.zebra-alpha {
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
	}

	.zebra-alpha-checkboard-wrap {
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
		overflow: hidden;
	}

	.zebra-alpha-gradient {
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
	}

	.zebra-alpha-container {
		cursor: pointer;
		position: relative;
		z-index: 2;
		height: 100%;
		margin: 0 6rpx;
	}

	.zebra-alpha-pointer {
		z-index: 2;
		position: absolute;
	}

	.zebra-alpha-picker {
		cursor: pointer;
		width: 8rpx;
		border-radius: 2rpx;
		height: 16rpx;
		box-shadow: 0 0 4rpx rgba(0, 0, 0, .6);
		background: #fff;
		margin-top: 2rpx;
		transform: translateX(-4rpx);
	}
</style>
