<template>
	<view class="zebra-checkerboard" :style="[bgStyle]"></view>
</template>

<script>
	let _checkboardCache = {}

	export default {
		name: 'Checkboard',
		props: {
			size: {
				type: [Number, String],
				default: 8
			},
			white: {
				type: String,
				default: '#fff'
			},
			grey: {
				type: String,
				default: '#e6e6e6'
			},
			customStyle: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		computed: {
			bgStyle() {
				return {
					'background-image': 'url(' + getCheckboard(this.white, this.grey, this.size) + ')',
					...this.customStyle
				}
			}
		}
	}

	function renderCheckboard(c1, c2, size) {
		return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADBJREFUOE9jfPbs2X8GPEBSUhKfNAPjqAHDIgz+//+PNx08f/4cfzoYNYCBceiHAQC5flV5JzgrxQAAAABJRU5ErkJggg=='
	}

	function getCheckboard(c1, c2, size) {
		var key = c1 + ',' + c2 + ',' + size

		if (_checkboardCache[key]) {
			return _checkboardCache[key]
		} else {
			var checkboard = renderCheckboard(c1, c2, size)
			_checkboardCache[key] = checkboard
			return checkboard
		}
	}
</script>

<style>
	.zebra-checkerboard {
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
		background-size: contain;
	}
</style>
