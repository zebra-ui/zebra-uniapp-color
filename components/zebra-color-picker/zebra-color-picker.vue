<template>
	<view role="application" aria-label="Chrome color picker"
		:class="['zebra-chrome', disableAlpha ? 'zebra-chrome__disable-alpha' : '']">
		<view class="zebra-chrome-saturation-wrap">
			<saturation v-model="colors" :navbarHeight="navbarHeight" @change="childChange"></saturation>
		</view>
		<view class="zebra-chrome-body">
			<view class="zebra-chrome-controls">
				<view class="zebra-chrome-color-wrap">
					<view :aria-label="`current color is ${colors.hex}`" class="zebra-chrome-active-color"
						:style="{background: activeColor}"></view>
					<checkboard v-if="!disableAlpha"
						:custom-style="{width: '60rpx',height: '60rpx',borderRadius: '30rpx',backgroundSize: 'auto'}">
					</checkboard>
				</view>

				<view class="zebra-chrome-sliders">
					<view class="zebra-chrome-hue-wrap">
						<hue v-model="colors" @change="childChange"></hue>
					</view>
					<view class="zebra-chrome-alpha-wrap" v-if="!disableAlpha">
						<alpha v-model="colors" @change="childChange"></alpha>
					</view>
				</view>
			</view>

			<view class="zebra-chrome-fields-wrap" v-if="!disableFields">
				<view class="zebra-chrome-fields" v-show="fieldsIndex === 0">
					<!-- hex -->
					<view class="zebra-chrome-field">
						<ed-in v-if="!hasAlpha" :input-content-style="inputContentStyle"
							:input-label-style="inputLabelStyle" label="hex" :value="colors.hex" @change="inputChange">
						</ed-in>
						<ed-in v-if="hasAlpha" :input-content-style="inputContentStyle"
							:input-label-style="inputLabelStyle" label="hex" :value="colors.hex8" @change="inputChange">
						</ed-in>
					</view>
				</view>
				<view class="zebra-chrome-fields" v-show="fieldsIndex === 1">
					<!-- rgba -->
					<view class="zebra-chrome-field">
						<ed-in label="r" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
							:value="colors.rgba.r" @change="inputChange"></ed-in>
					</view>
					<view class="zebra-chrome-field">
						<ed-in label="g" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
							:value="colors.rgba.g" @change="inputChange"></ed-in>
					</view>
					<view class="zebra-chrome-field">
						<ed-in label="b" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
							:value="colors.rgba.b" @change="inputChange"></ed-in>
					</view>
					<view class="zebra-chrome-field" v-if="!disableAlpha">
						<ed-in label="a" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
							:value="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
					</view>
				</view>
				<view class="zebra-chrome-fields" v-show="fieldsIndex === 2">
					<!-- hsla -->
					<view class="zebra-chrome-field">
						<ed-in label="h" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
							:value="hsl.h" @change="inputChange">
						</ed-in>
					</view>
					<view class="zebra-chrome-field">
						<ed-in label="s" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
							:value="hsl.s" @change="inputChange">
						</ed-in>
					</view>
					<view class="zebra-chrome-field">
						<ed-in label="l" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
							:value="hsl.l" @change="inputChange">
						</ed-in>
					</view>
					<view class="zebra-chrome-field" v-if="!disableAlpha">
						<ed-in label="a" :input-content-style="inputContentStyle" :input-label-style="inputLabelStyle"
							:value="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
					</view>
				</view>
				<view class="zebra-chrome-toggle-btn" role="button" aria-label="Change another color definition"
					@click="toggleViews">
					<view class="zebra-chrome-toggle-icon">
						<view class="zebra-chrome-arrow zebra-chrome-arrow-up"></view>
						<view class="zebra-chrome-arrow zebra-chrome-arrow-down"></view>
					</view>
					<view class="zebra-chrome-toggle-icon-highlight" v-show="highlight"></view>
				</view>
			</view>
		</view>
		<slot name="bottom"></slot>
		<view class="zebra-chrome-button" v-if="showButton">
			<button class="button-left" @click="cancel">
				取消
			</button>
			<button class="button-right" type="primary" @click="confirm">
				确定
			</button>
		</view>
	</view>
</template>

<script>
	import colorMixin from '../../mixin/color'
	import editableInput from '../../common/EditableInput.vue'
	import saturation from '../../common/Saturation.vue'
	import hue from '../../common/Hue.vue'
	import alpha from '../../common/Alpha.vue'
	import checkboard from '../../common/Checkboard.vue'

	export default {
		name: 'Chrome',
		mixins: [colorMixin],
		props: {
			disableAlpha: {
				type: Boolean,
				default: false
			},
			disableFields: {
				type: Boolean,
				default: false
			},
			width: {
				type: [String, Number],
				default: ''
			},
			navbarHeight: {
				type: Number,
				default: 0
			},
			showButton: {
				type: Boolean,
				default: false
			}
		},
		components: {
			saturation,
			hue,
			alpha,
			'ed-in': editableInput,
			checkboard
		},
		data() {
			return {
				fieldsIndex: 0,
				highlight: false
			}
		},
		computed: {
			inputContentStyle() {
				return {
					fontSize: '22rpx',
					color: '#333',
					width: '100%',
					borderRadius: '4rpx',
					border: 'none',
					boxShadow: 'inset 0 0 0 2rpx #dadada',
					height: '42rpx',
					textAlign: 'center'
				}
			},
			inputLabelStyle() {
				return {
					textTransform: 'uppercase',
					fontSize: '22rpx',
					lineHeight: '22rpx',
					color: '#969696',
					textAlign: 'center',
					display: 'block',
					marginTop: '24rpx'
				}
			},
			hsl() {
				const {
					h,
					s,
					l
				} = this.colors.hsl
				return {
					h: h.toFixed(),
					s: `${(s * 100).toFixed()}%`,
					l: `${(l * 100).toFixed()}%`
				}
			},
			activeColor() {
				const rgba = this.colors.rgba
				return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')'
			},
			hasAlpha() {
				return this.colors.a < 1
			}
		},
		methods: {
			confirm() {
				this.$emit("confirm", this.colors)
			},
			cancel() {
				this.$emit("cancel", this.colors)
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
				} else if (data.h || data.s || data.l) {
					const s = data.s ? (data.s.replace('%', '') / 100) : this.colors.hsl.s
					const l = data.l ? (data.l.replace('%', '') / 100) : this.colors.hsl.l

					this.colorChange({
						h: data.h || this.colors.hsl.h,
						s,
						l,
						source: 'hsl'
					})
				}
			},
			toggleViews() {
				if (this.fieldsIndex >= 2) {
					this.fieldsIndex = 0
					return
				}
				this.fieldsIndex++
			},
			showHighlight() {
				this.highlight = true
			},
			hideHighlight() {
				this.highlight = false
			}
		}
	}
</script>

<style>
	.zebra-chrome {
		background: #fff;
		border-radius: 4rpx;
		box-sizing: initial;
		width: 450rpx;
		font-family: Menlo;
		background-color: #fff;
	}

	.zebra-chrome-controls {
		display: flex;
	}

	.zebra-chrome-color-wrap {
		position: relative;
		width: 72rpx;
	}

	.zebra-chrome-active-color {
		position: relative;
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		overflow: hidden;
		z-index: 1;
	}

	.zebra-chrome-sliders {
		flex: 1;
	}

	.zebra-chrome-fields-wrap {
		display: flex;
		padding-top: 32rpx;
	}

	.zebra-chrome-fields {
		display: flex;
		margin-left: -12rpx;
		flex: 1;
	}

	.zebra-chrome-field {
		padding-left: 12rpx;
		width: 100%;
	}

	.zebra-chrome-toggle-btn {
		width: 64rpx;
		text-align: right;
		position: relative;
	}

	.zebra-chrome-toggle-icon {
		margin-left: 28rpx;
		margin-top: 24rpx;
		position: relative;
		z-index: 2;
	}

	.zebra-chrome-toggle-icon-highlight {
		position: absolute;
		width: 48rpx;
		height: 56rpx;
		background: #eee;
		border-radius: 8rpx;
		top: 20rpx;
		left: 24rpx;
	}

	.zebra-chrome-arrow {
		border: 2rpx solid black;
		border-width: 0rpx 2rpx 2rpx 0rpx;
		height: 12rpx;
		width: 12rpx;
	}

	.zebra-chrome-arrow-down {
		transform: rotate(45deg);
	}

	.zebra-chrome-arrow-up {
		transform: rotate(-135deg);
	}

	.zebra-chrome-hue-wrap {
		position: relative;
		height: 20rpx;
		margin-bottom: 16rpx;
	}

	.zebra-chrome-alpha-wrap {
		position: relative;
		height: 20rpx;
	}

	.zebra-chrome-hue-wrap .zebra-hue {
		border-radius: 4rpx;
	}

	.zebra-chrome-alpha-wrap .zebra-alpha-gradient {
		border-radius: 4rpx;
	}

	.zebra-chrome-hue-wrap .zebra-hue-picker,
	.zebra-chrome-alpha-wrap .zebra-alpha-picker {
		width: 24rpx;
		height: 24rpx;
		border-radius: 12rpx;
		transform: translate(-12rpx, -4rpx);
		background-color: rgb(248, 248, 248);
		box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.37);
	}

	.zebra-chrome-body {
		padding: 32rpx 32rpx 24rpx;
		background-color: #fff;
	}

	.zebra-chrome-saturation-wrap {
		width: 100%;
		padding-bottom: 55%;
		position: relative;
		border-radius: 4rpx 4rpx 0 0;
		overflow: hidden;
	}

	.zebra-chrome-saturation-wrap .zebra-saturation-circle {
		width: 24rpx;
		height: 24rpx;
	}

	.zebra-chrome__disable-alpha .zebra-chrome-active-color {
		width: 36rpx;
		height: 36rpx;
	}

	.zebra-chrome__disable-alpha .zebra-chrome-color-wrap {
		width: 60rpx;
	}

	.zebra-chrome__disable-alpha .zebra-chrome-hue-wrap {
		margin-top: 8rpx;
		margin-bottom: 8rpx;
	}

	.zebra-chrome-button {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 30rpx;
	}

	.button-left {
		margin: 0;
		font-size: 24rpx;
		padding: 0 20rpx;
		line-height: 44rpx;
	}

	.button-right {
		margin: 0;
		margin-left: 20rpx;
		font-size: 24rpx;
		padding: 0 20rpx;
		line-height: 44rpx;
	}
</style>