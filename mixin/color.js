import tinycolor from '../utils/tinycolor2.js'

function _colorChange(data, oldHue) {
	var alpha = data && data.a
	var color

	if (data && data.hsl) {
		color = tinycolor(data.hsl)
	} else if (data && data.hex && data.hex.length > 0) {
		color = tinycolor(data.hex)
	} else if (data && data.hsv) {
		color = tinycolor(data.hsv)
	} else if (data && data.rgba) {
		color = tinycolor(data.rgba)
	} else if (data && data.rgb) {
		color = tinycolor(data.rgb)
	} else {
		color = tinycolor(data)
	}

	if (color && (color._a === undefined || color._a === null)) {
		color.setAlpha(alpha || 1)
	}

	var hsl = color.toHsl()
	var hsv = color.toHsv()

	if (hsl.s === 0) {
		hsv.h = hsl.h = data.h || (data.hsl && data.hsl.h) || oldHue || 0
	}

	return {
		hsl: hsl,
		hex: color.toHexString().toUpperCase(),
		hex8: color.toHex8String().toUpperCase(),
		rgba: color.toRgb(),
		hsv: hsv,
		oldHue: data.h || oldHue || hsl.h,
		source: data.source,
		a: data.a || color.getAlpha()
	}
}

export default {
	props: ['value'],
	data() {
		return {
			val: _colorChange(this.value)
		}
	},
	computed: {
		colors: {
			get() {
				return this.val
			},
			set(newVal) {
				this.val = newVal
				this.$emit('input', newVal)
			}
		},
		widthNumber() {
			return this.toPx(this.width)
		},
		heightNumber() {
			return this.toPx(this.height)
		}
	},
	watch: {
		value(newVal) {
			this.val = _colorChange(newVal)
		}
	},
	methods: {
		toPx(num) {
			if (typeof num === 'string') {
				if (num.indexOf('px') !== -1) {
					if (num.indexOf('rpx') !== -1) {
						// "10rpx"
						num = num.replace('rpx', '');
					} else if (num.indexOf('upx') !== -1) {
						// "10upx"
						num = num.replace('upx', '');
					} else {
						// "10px"
						return Number(num.replace('px', ''));
					}
				} else if (num.indexOf('%') !== -1) {
					let rate = Number(num.replace('%', '')) / 100;
					return uni.getSystemInfoSync().windowHeight * rate;
				}
			}
			return num ? uni.upx2px(Number(num)) : 0;
		},
		colorChange(data, oldHue) {
			this.oldHue = this.colors.hsl.h
			this.colors = _colorChange(data, oldHue || this.oldHue)
		},
		isValidHex(hex) {
			return tinycolor(hex).isValid()
		},
		simpleCheckForValidColor(data) {
			var keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v']
			var checked = 0
			var passed = 0

			for (var i = 0; i < keysToCheck.length; i++) {
				var letter = keysToCheck[i]
				if (data[letter]) {
					checked++
					if (!isNaN(data[letter])) {
						passed++
					}
				}
			}

			if (checked === passed) {
				return data
			}
		},
		paletteUpperCase(palette) {
			return palette.map(c => c.toUpperCase())
		},
		isTransparent(color) {
			return tinycolor(color).getAlpha() === 0
		}
	}
}
