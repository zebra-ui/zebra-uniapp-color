<template>
	<div role="application" aria-label="Sketch color picker"
		:class="['zebra-sketch', disableAlpha ? 'zebra-sketch__disable-alpha' : '']">
		<div class="zebra-sketch-saturation-wrap">
			<saturation v-model="colors" :navbarHeight="navbarHeight" @change="childChange"></saturation>
		</div>
		<div class="zebra-sketch-controls">
			<div class="zebra-sketch-sliders">
				<div class="zebra-sketch-hue-wrap">
					<hue v-model="colors" @change="childChange"></hue>
				</div>
				<div class="zebra-sketch-alpha-wrap" v-if="!disableAlpha">
					<alpha v-model="colors" @change="childChange"></alpha>
				</div>
			</div>
			<div class="zebra-sketch-color-wrap">
				<div :aria-label="`Current color is ${activeColor}`" class="zebra-sketch-active-color"
					:style="{background: activeColor}"></div>
				<checkboard></checkboard>
			</div>
		</div>
		<div class="zebra-sketch-field" v-if="!disableFields">
			<!-- rgba -->
			<div class="zebra-sketch-field--double">
				<ed-in label="hex" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
					:value="hex" @change="inputChange"></ed-in>
			</div>
			<div class="zebra-sketch-field--single">
				<ed-in label="r" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
					:value="colors.rgba.r" @change="inputChange"></ed-in>
			</div>
			<div class="zebra-sketch-field--single">
				<ed-in label="g" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
					:value="colors.rgba.g" @change="inputChange"></ed-in>
			</div>
			<div class="zebra-sketch-field--single">
				<ed-in label="b" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
					:value="colors.rgba.b" @change="inputChange"></ed-in>
			</div>
			<div class="zebra-sketch-field--single" v-if="!disableAlpha">
				<ed-in label="a" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
					:value="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
			</div>
		</div>
		<div class="zebra-sketch-presets" role="group" aria-label="A color preset, pick one to set as current color">
			<template v-for="c in presetColors">
				<div v-if="!isTransparent(c)" class="zebra-sketch-presets-color" :aria-label="'Color:' + c" :key="c"
					:style="{background: c}" @click="handlePreset(c)">
				</div>
				<div v-else :key="c" :aria-label="'Color:' + c" class="zebra-sketch-presets-color"
					@click="handlePreset(c)">
					<checkboard />
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import colorMixin from '../../mixin/color'
	import editableInput from '../../common/EditableInput.vue'
	import saturation from '../../common/Saturation.vue'
	import hue from '../../common/Hue.vue'
	import alpha from '../../common/Alpha.vue'
	import checkboard from '../../common/Checkboard.vue'

	const presetColors = [
		'#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
		'#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
		'#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
		'#425678'
	]

	export default {
		name: 'Sketch',
		mixins: [colorMixin],
		components: {
			saturation,
			hue,
			alpha,
			'ed-in': editableInput,
			checkboard
		},
		props: {
			presetColors: {
				type: Array,
				default () {
					return presetColors
				}
			},
			disableAlpha: {
				type: Boolean,
				default: false
			},
			disableFields: {
				type: Boolean,
				default: false
			},
			navbarHeight: {
				type: Number,
				default: 0
			}
		},
		computed: {
			inputContentStyle() {
				return {
					width: '90%',
					height: '42rpx',
					padding: '0 0 0 10%',
					border: 'none',
					boxShadow: 'inset 0 0 0 2rpx #ccc',
					fontSize: '20rpx'
				}
			},
			inputLabelStyle() {
				return {
					display: 'block',
					textAlign: 'center',
					fontSize: '22rpx',
					color: '#222',
					paddingTop: '6rpx',
					paddingBottom: '8rpx',
					textTransform: 'capitalize'
				}
			},
			hex() {
				let hex
				if (this.colors.a < 1) {
					hex = this.colors.hex8
				} else {
					hex = this.colors.hex
				}
				return hex.replace('#', '')
			},
			activeColor() {
				var rgba = this.colors.rgba
				return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')'
			}
		},
		methods: {
			handlePreset(c) {
				this.colorChange({
					hex: c,
					source: 'hex'
				})
			},
			childChange(data) {
				this.colorChange(data)
			},
			inputChange(data) {
				if (!data) {
					return
				}
				if (data.hex) {
					this.isValidHex(data.hex) && this.colorChange({
						hex: data.hex,
						source: 'hex'
					})
				} else if (data.r || data.g || data.b || data.a) {
					this.colorChange({
						r: data.r || this.colors.rgba.r,
						g: data.g || this.colors.rgba.g,
						b: data.b || this.colors.rgba.b,
						a: data.a || this.colors.rgba.a,
						source: 'rgba'
					})
				}
			}
		}
	}
</script>

<style>
	.zebra-sketch {
		position: relative;
		width: 400rpx;
		padding: 20rpx 20rpx 0;
		box-sizing: initial;
		background: #fff;
		border-radius: 8rpx;
		box-shadow: 0 0 0 2rpx rgba(0, 0, 0, .15), 0 16rpx 32rpx rgba(0, 0, 0, .15);
	}

	.zebra-sketch-saturation-wrap {
		width: 100%;
		padding-bottom: 75%;
		position: relative;
		overflow: hidden;
	}

	.zebra-sketch-controls {
		display: flex;
	}

	.zebra-sketch-sliders {
		padding: 8rpx 0;
		flex: 1;
	}

	.zebra-sketch-sliders .zebra-hue,
	.zebra-sketch-sliders .zebra-alpha-gradient {
		border-radius: 4rpx;
	}

	.zebra-sketch-hue-wrap {
		position: relative;
		height: 20rpx;
	}

	.zebra-sketch-alpha-wrap {
		position: relative;
		height: 20rpx;
		margin-top: 8rpx;
		overflow: hidden;
	}

	.zebra-sketch-color-wrap {
		width: 48rpx;
		height: 48rpx;
		position: relative;
		margin-top: 8rpx;
		margin-left: 8rpx;
		border-radius: 6rpx;
	}

	.zebra-sketch-active-color {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 4rpx;
		box-shadow: inset 0 0 0 2rpx rgba(0, 0, 0, .15), inset 0 0 8rpx rgba(0, 0, 0, .25);
		z-index: 2;
	}

	.zebra-sketch-color-wrap .zebra-checkerboard {
		background-size: auto;
	}

	.zebra-sketch-field {
		display: flex;
		padding-top: 8rpx;
	}

	.zebra-sketch-field ::v-deep .zebra-input__input {
		/* 		width: 90%;
		padding: 8rpx 0 6rpx 10%;
		border: none;
		box-shadow: inset 0 0 0 2rpx #ccc;
		font-size: 20rpx; */
	}

	.zebra-sketch-field ::v-deep .zebra-input__label {
		/* 		display: block;
		text-align: center;
		font-size: 22rpx;
		color: #222;
		padding-top: 6rpx;
		padding-bottom: 8rpx;
		text-transform: capitalize; */
	}

	.zebra-sketch-field--single {
		flex: 1;
		padding-left: 12rpx;
	}

	.zebra-sketch-field--double {
		flex: 2;
	}

	.zebra-sketch-presets {
		margin-right: -20rpx;
		margin-left: -20rpx;
		padding-left: 20rpx;
		padding-top: 20rpx;
		border-top: 2rpx solid #eee;
	}

	.zebra-sketch-presets-color {
		border-radius: 6rpx;
		overflow: hidden;
		position: relative;
		display: inline-block;
		margin: 0 20rpx 20rpx 0;
		vertical-align: top;
		cursor: pointer;
		width: 32rpx;
		height: 32rpx;
		box-shadow: inset 0 0 0 2rpx rgba(0, 0, 0, .15);
	}

	.zebra-sketch-presets-color .zebra-checkerboard {
		box-shadow: inset 0 0 0 2rpx rgba(0, 0, 0, .15);
		border-radius: 6rpx;
	}

	.zebra-sketch__disable-alpha .zebra-sketch-color-wrap {
		height: 20rpx;
	}
</style>
