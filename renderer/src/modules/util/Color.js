const tinycolor = require('tinycolor2');

import { error } from './Logger.js';
import { assertString } from './String.js';

const _labels = [ 'Util', 'Color' ];
const _error = (labels, ...message) => error({ labels, message });

export const _hex2hsl = color => {
  try {
    // Convert hex to RGB first
    let r, g, b;

    // 3 digits
    if (color.length === 4) {
      r = `0x${color[1]}${color[1]}`;
      g = `0x${color[2]}${color[2]}`;
      b = `0x${color[3]}${color[3]}`;

    // 6 digits
    } else if (color.length === 7) {
      r = `0x${color[1]}${color[2]}`;
      g = `0x${color[3]}${color[4]}`;
      b = `0x${color[5]}${color[6]}`;
    }

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h, s, l;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h} ${s}% ${l}%)`;
  } catch (err) {
    _error(_labels.concat('_hex2hsl'), err);
  }
};

export const _hex2int = color => {
  try {
    if (color.length === 4) {
      color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    return parseInt(color.slice(1), 16);
  } catch (err) {
    _error(_labels.concat('_hex2int'), err);
  }
};

export const _hex2rgb = color => {
  try {
    let r, g, b;

    // 3 digits
    if (color.length === 4) {
      r = `0x${color[1]}${color[1]}`;
      g = `0x${color[2]}${color[2]}`;
      b = `0x${color[3]}${color[3]}`;

    // 6 digits
    } else if (color.length === 7) {
      r = `0x${color[1]}${color[2]}`;
      g = `0x${color[3]}${color[4]}`;
      b = `0x${color[5]}${color[6]}`;
    }

    return `rgb(${+r} ${+g} ${+b})`;
  } catch (err) {
    _error(_labels.concat('_hex2rgb'), err);
  }
};

export const _hsl2hex = color => {
  try {
    const ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;

    if (ex.test(color)) {
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      color = color.substr(4).split(')')[0].split(sep);

      let h = color[0];
      let s = color[1].substr(0, color[1].length - 1) / 100;
      let l = color[2].substr(0, color[2].length - 1) / 100;

      // strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) {
        h = h.substr(0, h.length - 3);
      } else if (h.indexOf('rad') > -1) {
        h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
      } else if (h.indexOf('turn') > -1) {
        h = Math.round(h.substr(0, h.length - 4) * 360);
      }

      if (h >= 360) {
        h %= 360;
      }

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r, g, b;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      // Having obtained RGB, convert channels to hex
      r = Math.round((r + m) * 255).toString(16);
      g = Math.round((g + m) * 255).toString(16);
      b = Math.round((b + m) * 255).toString(16);

      // Prepend 0s if necessary
      if (r.length === 1) {
        r = `0${r}`;
      }
      if (g.length === 1) {
        g = `0${g}`;
      }
      if (b.length === 1) {
        b = `0${b}`;
      }

      return `#${r}${g}${b}`;
    }
  } catch (err) {
    _error(_labels.concat('_hsl2hex'), err);
  }
};

export const _hsl2int = color => {
  try {
    const ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;

    if (ex.test(color)) {
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      color = color.substr(4).split(')')[0].split(sep);

      let h = color[0];
      const s = color[1].substr(0, color[1].length - 1) / 100;
      const l = color[2].substr(0, color[2].length - 1) / 100;

      // Strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) {
        h = h.substr(0, h.length - 3);
      } else if (h.indexOf('rad') > -1) {
        h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
      } else if (h.indexOf('turn') > -1) {
        h = Math.round(h.substr(0, h.length - 4) * 360);
      }

      if (h >= 360) {
        h %= 360;
      }

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r, g, b;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return (r << 16) + (g << 16) + b;
    }
  } catch (err) {
    _error(_labels.concat('_hsl2int'), err);
  }
};

export const _hsl2rgb = color => {
  try {
    const ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;

    if (ex.test(color)) {
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      color = color.substr(4).split(')')[0].split(sep);

      let h = color[0];
      let s = color[1].substr(0, color[1].length - 1) / 100;
      let l = color[2].substr(0, color[2].length - 1) / 100;

      // Strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) {
        h = h.substr(0, h.length - 3);
      } else if (h.indexOf('rad') > -1) {
        h = Math.round(h.substr(0, h.length - 3) / (2 * Math.PI) * 360);
      } else if (h.indexOf('turn') > -1) {
        h = Math.round(h.substr(0, h.length - 4) * 360);
      }
      // Keep hue fraction of 360 if ending up over
      if (h >= 360) {
        h %= 360;
      }

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r, g, b;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return `rgb(${+r} ${+g} ${+b})`;
    }
  } catch (err) {
    _error(_labels.concat('_hsl2rgb'), err);
  }
};

export const _int2hex = color => {
  try {
    return `#${((color) >>> 0).toString(16).padStart(6, '0')}`;
  } catch (err) {
    _error(_labels.concat('_int2hex'), err);
  }
};

export const _int2hsl = color => {
  try {
    // Convert int to hex first
    const hex = `#${((color) >>> 0).toString(16)}`;

    // Convert hex to RGB next
    let r = `0x${hex[1]}${hex[2]}`;
    let g = `0x${hex[3]}${hex[4]}`;
    let b = `0x${hex[5]}${hex[6]}`;

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h, s, l;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h} ${s}% ${l}%)`;
  } catch (err) {
    _error(_labels.concat('_int2hsl'), err);
  }
};

export const _int2rgb = color => {
  try {
    return `rgb(${(color >> 16 & 255)} ${(color >> 8 & 255)} ${(255 & color)})`;
  } catch (err) {
    _error(_labels.concat('_int2rgb'), err);
  }
};

export const _rgb2hex = color => {
  try {
    const ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;

    if (ex.test(color)) {
      // Choose correct separator
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      // Turn 'rgb(r,g,b)', 'rgb(r, g, b)', and 'rgb(r g b)' formats into [r,g,b]
      color = color.substr(4).split(')')[0].split(sep);

      // Convert %s to 0–255
      for (const R in color) {
        const r = color[R];
        if (r.indexOf('%') > -1) {
          color[R] = Math.round(r.substr(0, r.length - 1) / 100 * 255);
        }
        /*
         * Example:
         * 75% -> 191
         * 75/100 = 0.75, * 255 = 191.25 -> 191
         */
      }

      let r = (+color[0]).toString(16);
      let g = (+color[1]).toString(16);
      let b = (+color[2]).toString(16);

      if (r.length === 1) r = `0${r}`;
      if (g.length === 1) g = `0${g}`;
      if (b.length === 1) b = `0${b}`;

      return `#${r}${g}${b}`;
    }
  } catch (err) {
    _error(_labels.concat('_rgb2hex'), err);
  }
};

export const _rgb2hsl = color => {
  try {
    const ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;

    if (ex.test(color)) {
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      color = color.substr(4).split(')')[0].split(sep);

      // Convert %s to 0–255
      for (const R in color) {
        const r = color[R];
        if (r.indexOf('%') > -1) {
          color[R] = Math.round(r.substr(0, r.length - 1) / 100 * 255);
        }
      }

      // Make r, g, and b fractions of 1
      const r = color[0] / 255;
      const g = color[1] / 255;
      const b = color[2] / 255;

      // Find greatest and smallest channel values
      const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      const delta = cmax - cmin;

      let h, s, l;

      // Calculate hue

      // No difference
      if (delta === 0) h = 0;
      // Red is max
      else if (cmax === r) h = ((g - b) / delta) % 6;
      // Green is max
      else if (cmax === g) h = (b - r) / delta + 2;
      // Blue is max
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      // Make negative hues positive behind 360°
      if (h < 0) {
        h += 360;
      }

      // Calculate lightness
      l = (cmax + cmin) / 2;

      // Calculate saturation
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      // Multiply l and s by 100
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      return `hsl(${h} ${s}% ${l}%)`;
    }
  } catch (err) {
    _error(_labels.concat('_rgb2hsl'), err);
  }
};

export const _rgb2int = color => {
  try {
    const ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;

    if (ex.test(color)) {
      // Choose correct separator
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      // Turn 'rgb(r,g,b)', 'rgb(r, g, b)', and 'rgb(r g b)' format into [r,g,b]
      color = color.substr(4).split(')')[0].split(sep);

      // Convert %s to 0–255
      for (const R in color) {
        const r = color[R];
        if (r.indexOf('%') > -1) {
          color[R] = Math.round(r.substr(0, r.length - 1) / 100 * 255);
        }
        /*
         * Example:
         * 75% -> 191
         * 75/100 = 0.75, * 255 = 191.25 -> 191
         */
      }

      const r = (+color[0]).toString(16);
      const g = (+color[1]).toString(16);
      const b = (+color[2]).toString(16);

      return (r << 16) + (g << 16) + b;
    }
  } catch (err) {
    _error(_labels.concat('_rgb2int'), err);
  }
};

export const getContrastColor = color => {
  try {
    let r, g, b;
    const _hex = arg => {
      if (arg.length === 4) {
        r = `0x${arg[1]}${arg[1]}`;
        g = `0x${arg[2]}${arg[2]}`;
        b = `0x${arg[3]}${arg[3]}`;
      // 6 digits
      } else if (arg.length === 7) {
        r = `0x${arg[1]}${arg[2]}`;
        g = `0x${arg[3]}${arg[4]}`;
        b = `0x${arg[5]}${arg[6]}`;
      }
    };
    _hex(toHex(color));
    if ((r * 0.299) + (g * 0.587) + (b * 0.114) > 160) return '#000';
    return '#fff';
  } catch (err) {
    _error(_labels.concat('getContrastColor'), err);
  }
};

export const getRandomColor = (type = 'hex') => {
  try {
    assertString(type);
    if ([ 'int', 'hex', 'rgb', 'hsl' ].indexOf(type?.toLowerCase()) < 0) {
      throw new TypeError('Invalid color type provided. Valid types are "hex", "int", "rgb", and "hsl".');
    }

    const base = '000000';
    const number = Math.floor(Math.random() * 16777215).toString(16);
    const color = `#${(base + number).substr(-6)}`;

    if (type === 'hex') return color;
    if (type === 'int') return _hex2int(color);
    if (type === 'rgb') return _hex2rgb(color);
    if (type === 'hsl') return _hex2hsl(color);
  } catch (err) {
    _error(_labels.concat('getRandomColor'), err);
  }
};

export const saturateColor = (color, amount) => {
  try {

  } catch (err) {
    _error(_labels.concat('saturateColor'), err);
  }
};

export const rotateHue = (color, amount) => {
  try {
    return tinycolor(color).spin(amount).toString();
  } catch (err) {
    _error(_labels.concat('rotateHue'), err);
  }
};

export const getComplement = color => {
  try {
    // Make sure the color is an identifiable type
    const type = getColorType(color);
    if (!type) {
      throw new Error(`Could not determine a color type for "${color}".`);
    }

    const complement = tinycolor(color).complement().toHexString();

    if (type === 'hex') return complement;
    if (type === 'int') return _hex2int(complement);
    if (type === 'rgb') return _hex2rgb(complement);
    if (type === 'hsl') return _hex2hsl(complement);
  } catch (err) {
    _error(_labels.concat('getComplement'), err);
  }
};

export const getColorType = color => {
  try {
    const ex = {
      hex: /^#([\da-f]{3}){1,2}$/i,
      rgb: /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i,
      hsl: /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i
    };

    if (ex.rgb.test(color)) return 'rgb';
    if (ex.hex.test(color)) return 'hex';
    if (ex.hsl.test(color)) return 'hsl';
    if (Number.isInteger(parseInt(color))) return 'int';
    throw new Error(`Could not determine a color type for "${color}". Please make sure it is a valid color.`);
  } catch (err) {
    _error(_labels.concat('getColorType'), err);
  }
};

export const toHex = color => {
  try {
    // Make sure the color is an identifiable type
    const type = getColorType(color);
    if (!type) return;
    if (type === 'int') return _int2hex(color);
    if (type === 'hex') return color;
    if (type === 'rgb') return _rgb2hex(color);
    if (type === 'hsl') return _hsl2hex(color);
  } catch (err) {
    _error(_labels.concat('toHex'), err);
  }
};

export const toHsl = color => {
  try {
    // Make sure the color is an identifiable type
    const type = getColorType(color);
    if (!type) {
      throw new Error(`Could not determine a color type for "${color}". Please make sure it is a valid color.`);
    }
    if (type === 'int') return _int2hsl(color);
    if (type === 'hex') return _hex2hsl(color);
    if (type === 'rgb') return _rgb2hsl(color);
    if (type === 'hsl') return color;
  } catch (err) {
    _error(_labels.concat('toHsl'), err);
  }
};

export const toInt = color => {
  try {
    // Make sure the color is an identifiable type
    const type = getColorType(color);
    if (!type) {
      throw new Error(`Could not determine a color type for "${color}". Please make sure it is a valid color.`);
    }
    if (type === 'int') return color;
    if (type === 'hex') return _hex2int(color);
    if (type === 'rgb') return _rgb2int(color);
    if (type === 'hsl') return _hsl2int(color);
  } catch (err) {
    _error(_labels.concat('toInt'), err);
  }
};

export const toRgb = color => {
  try {
    // Make sure the color is an identifiable type
    const type = getColorType(color);
    if (!type) {
      throw new Error(`Could not determine a color type for "${color}". Please make sure it is a valid color.`);
    }

    if (type === 'int') return _int2rgb(color);
    if (type === 'hex') return _hex2rgb(color);
    if (type === 'rgb') return color;
    if (type === 'hsl') return _hsl2rgb(color);
  } catch (err) {
    _error(_labels.concat('toRgb'), err);
  }
};

export const blendColors = (firstColor, secondColor, percent = 0.5) => {
  try {
    const firstColorType = getColorType(firstColor);
    const secondColorType = getColorType(secondColor);
    if (!firstColorType) {
      throw new Error(`Could not determine a color type for "${firstColor}".`);
    }
    if (!secondColorType) {
      throw new Error(`Could not determine a color type for "${secondColor}".`);
    }

    /**
     * @see {@link https://stackoverflow.com/a/13542669 || https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)#stackoverflow-archive-begin}
     */
    const rgbLinearBlend = (firstColor, secondColor, percent) => {
      /*
       * Do a quick conversion to hex and back to make sure it's in a
       * cleaned up RGB format.
       */
      firstColor = toHex(firstColor);
      firstColor = toRgb(firstColor);
      secondColor = toHex(secondColor);
      secondColor = toRgb(secondColor);

      const i = parseInt;
      const r = Math.round;
      const P = 1 - percent;
      const [ a, b, c, d ] = firstColor.split(' ');
      const [ e, f, g, h ] = secondColor.split(' ');
      const x = d || h;
      const j = x ? `/ ${!d ? h : !h ? d : `${r((parseFloat(d) * P + parseFloat(h) * p) * 1000) / 1000})`}` : ')';
      let result = `rgb${x ? 'a(' : '('}${r(i(a[3] === 'a' ? a.slice(5) : a.slice(4)) * P + i(e[3] === 'a' ? e.slice(5) : e.slice(4)) * percent)} ${r(i(b) * P + i(f) * percent)} ${r(i(c) * P + i(g) * percent)}${j}`;
      /*
       * Do a quick conversion to hex and back to make sure it's in a
       * cleaned up RGB format.
       */
      result = toHex(result);
      result = toRgb(result);

      return result;
    };

    // Get the new colors, in RGB format
    let newColor = rgbLinearBlend(firstColor, secondColor, percent);

    // Convert the new color back to the original provided color's type
    if (firstColorType === 'int') newColor = toInt(newColor);
    if (firstColorType === 'hex') newColor = toHex(newColor);
    if (firstColorType === 'hsl') newColor = toHsl(newColor);

    return newColor;
  } catch (err) {
    _error(_labels.concat('blendColors'), err);
  }
};

export const shadeColor = (color, percent) => {
  try {
    // Make sure the color is an identifiable type
    const type = getColorType(color);
    if (!type) return _error(_labels.concat('shadeColor'), `Could not determine a color type for "${color}".`);

    /**
     * @see {@link https://stackoverflow.com/a/13542669 || https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)#stackoverflow-archive-begin}
     */
    const rgbLinearShade = (color, percent) => {
      /*
       * Do a quick conversion to hex and back to make sure it's in a
       * cleaned up RGB format.
       */
      color = toHex(color);
      color = toRgb(color);

      const i = parseInt;
      const r = Math.round;
      const [ a, b, c, d ] = color.split(' ');
      let P = percent < 0;
      const t = P ? 0 : 255 * percent;
      P = P ? 1 + percent : 1 - percent;
      let result = `rgb${d ? 'a(' : '('}${r(i(a[3] === 'a' ? a.slice(5) : a.slice(4)) * P + t)} ${r(i(b) * P + t)} ${r(i(c) * P + t)}${d ? ` ${d}` : ')'}`;
      /*
       * Do a quick conversion to hex and back to make sure it's in a
       * cleaned up RGB format.
       */
      result = toHex(result);
      result = toRgb(result);

      return result;
    };

    // Get the new color, in RGB format
    let newColor = rgbLinearShade(color, percent);

    // Convert the new color back to the original provided color's type
    if (type === 'int') newColor = toInt(newColor);
    if (type === 'hex') newColor = toHex(newColor);
    if (type === 'hsl') newColor = toHsl(newColor);

    return newColor;
  } catch (err) {
    _error(_labels.concat('shadeColor'), err);
  }
};