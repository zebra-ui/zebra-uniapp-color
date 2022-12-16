<template>
	<!-- #ifdef MP-WEIXIN -->
	<view class="zebra-saturation" :style="{background: bgColor}" @touchmove="saturationWxs.touchmove"
		@touchstart="saturationWxs.touchstart">
		<view class="zebra-saturation--white"></view>
		<view class="zebra-saturation--black"></view>
		<view class="zebra-saturation-pointer" :style="{top: pointerTop, left: pointerLeft}">
			<view class="zebra-saturation-circle"></view>
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifdef MP-ALIPAY -->
	<view class="zebra-saturation" :style="{background: bgColor}" @touchmove="saturationSjs.touchmove"
		@touchstart="saturationSjs.touchstart">
		<view class="zebra-saturation--white"></view>
		<view class="zebra-saturation--black"></view>
		<view class="zebra-saturation-pointer" :style="{top: pointerTop, left: pointerLeft}">
			<view class="zebra-saturation-circle"></view>
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifdef MP-TOUTIAO || MP-BAIDU || APP-VUE || MP-QQ || MP-KUAISHOU || MP-LARK || MP-JD || MP-360 || QUICKAPP-WEBVIEW || QUICKAPP-WEBVIEW-UNION || QUICKAPP-WEBVIEW-HUAWEI -->
	<view class="zebra-saturation" :style="{background: bgColor}" @touchmove.stop.prevent="handleChange"
		@touchstart="handleChange">
		<view class="zebra-saturation--white"></view>
		<view class="zebra-saturation--black"></view>
		<view class="zebra-saturation-pointer" :style="{top: pointerTop, left: pointerLeft}">
			<view class="zebra-saturation-circle"></view>
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifdef H5 -->
	<view class="zebra-saturation" :style="{background: bgColor}" @touchmove.stop.prevent="handleChange"
		@touchstart="handleChange" @mousedown="handleMouseDown">
		<view class="zebra-saturation--white"></view>
		<view class="zebra-saturation--black"></view>
		<view class="zebra-saturation-pointer" :style="{top: pointerTop, left: pointerLeft}">
			<view class="zebra-saturation-circle"></view>
		</view>
	</view>
	<!-- #endif -->
</template>

<!-- #ifdef MP-WEIXIN  -->
<script module="saturationWxs" lang="wxs" src="./SaturationWxs.wxs"></script>
<!-- #endif -->
<!-- #ifdef MP-ALIPAY -->
<script module="saturationSjs" lang="sjs" src="./SaturationSjs.sjs"></script>
<!-- #endif -->

<script>
	import clamp from '../utils/clamp.js'

	export default {
		name: 'Saturation',
		props: {
			value: Object,
			navbarHeight: {
				type: Number,
				default: 0
			}
		},
		computed: {
			colors() {
				return this.value
			},
			bgColor() {
				return `hsl(${this.colors.hsv.h}, 100%, 50%)`
			},
			pointerTop() {
				return (-(this.colors.hsv.v * 100) + 1) + 100 + '%'
			},
			pointerLeft() {
				return this.colors.hsv.s * 100 + '%'
			}
		},
		methods: {
			handleChange(e, skip) {
				const query = uni.createSelectorQuery().in(this);
				query.select('.zebra-saturation').boundingClientRect(data => {
					if (!data) {
						return
					}
					var containerWidth = data.width
					var containerHeight = data.height

					var xOffset = data.left
					var yOffset = data.top
					var pageX = e.clientX || (e.touches ? e.touches[0].clientX : 0)
					var pageY = e.clientY || (e.touches ? e.touches[0].clientY : 0)
					var left = clamp(pageX - xOffset, 0, containerWidth)
					var top = clamp(pageY - yOffset, 0, containerHeight)
					var saturation = left / containerWidth
					var bright = clamp(-(top / containerHeight) + 1, 0, 1)
					this.onChange({
						h: this.colors.hsv.h,
						s: saturation,
						v: bright,
						a: this.colors.hsv.a,
						source: 'hsva'
					})
				}).exec();
			},
			handleChangeMouse(e, skip) {
				const query = uni.createSelectorQuery().in(this);
				query.select('.zebra-saturation').boundingClientRect(data => {
					if (!data) {
						return
					}
					var containerWidth = data.width
					var containerHeight = data.height
					var xOffset = data.left + window.pageXOffset
					var yOffset = data.top + this.navbarHeight + window.pageYOffset
					var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
					var pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0)
					var left = clamp(pageX - xOffset, 0, containerWidth)
					var top = clamp(pageY - yOffset, 0, containerHeight)
					var saturation = left / containerWidth
					var bright = clamp(-(top / containerHeight) + 1, 0, 1)
					this.onChange({
						h: this.colors.hsv.h,
						s: saturation,
						v: bright,
						a: this.colors.hsv.a,
						source: 'hsva'
					})
				}).exec();
			},
			onChangeWxs(data) {
				this.onChange({
					h: this.colors.hsv.h,
					s: data.saturation,
					v: data.bright,
					a: this.colors.hsv.a,
					source: 'hsva'
				})
			},
			onChange(param) {
				this.$emit('change', param)
			},
			handleMouseDown(e) {
				if (navigator.userAgent.indexOf('Mobile') === -1) {
					window.addEventListener('mousemove', this.handleChangeMouse)
					window.addEventListener('mouseup', this.handleChangeMouse)
					window.addEventListener('mouseup', this.handleMouseUp)
				}
			},
			handleMouseUp(e) {
				this.unbindEventListeners()
			},
			unbindEventListeners() {
				if (navigator.userAgent.indexOf('Mobile') === -1) {
					window.removeEventListener('mousemove', this.handleChangeMouse)
					window.removeEventListener('mouseup', this.handleChangeMouse)
					window.removeEventListener('mouseup', this.handleMouseUp)
				}
			}
		}
	}
</script>


<style>
	.zebra-saturation,
	.zebra-saturation--white,
	.zebra-saturation--black {
		cursor: pointer;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
	}

	.zebra-saturation--white {
		background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
	}

	.zebra-saturation--black {
		background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
	}

	.zebra-saturation-pointer {
		cursor: pointer;
		position: absolute;
	}

	.zebra-saturation-circle {
		cursor: head;
		width: 8rpx;
		height: 8rpx;
		box-shadow: 0 0 0 3rpx #fff, inset 0 0 2rpx 2rpx rgba(0, 0, 0, .3), 0 0 2rpx 4rpx rgba(0, 0, 0, .4);
		border-radius: 50%;
		transform: translate(-4rpx, -4rpx);
	}
</style>
