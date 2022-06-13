import { getRandomColor, getContrastColor, blendColors, shadeColor } from './Color.js';
import { isArray, isEmptyArray, assertArray } from './Array.js';
import { isString, assertString } from './String.js';
import { assertObject } from './Object.js';

const _labels = [ 'Util', 'Logger' ];

export const PRESET_LABELS = {
  watcher: [ '#f0f0f0' ],
  powerpala: [ '#ff9600', '#12131b' ],
  compiler: [ '#2d8d9c', '#1bc084' ],
  api: [ '#e02828', '#414875' ],
  util: [ '#000000', '#444444' ],
  manager: [ '#27b320', '#50917e' ],
  plugin: [ '#42ffa7', '#b4da4b' ],
  theme: [ '#523df3', '#916bd1' ],
  constants: [ '#1d2ade', '#1dc4de' ]
};

export function log (options) {
  try {
    assertObject(options);
    options.type = 'log';
    return _handler(options);
  } catch (err) {
    return _error(_labels.concat('log'), err);
  }
}

export function warn (options) {
  try {
    assertObject(options);
    options.type = 'warn';
    return _handler(options);
  } catch (err) {
    return _error(_labels.concat('warn'), err);
  }
}

export function error (options) {
  try {
    assertObject(options);
    options.type = 'error';
    return _handler(options);
  } catch (err) {
    return _error(_labels.concat('error'), err);
  }
}

export function deprecate (options) {
  try {
    assertObject(options);
    const { message } = options;
    options.type = 'warn';
    options.message = `Deprecation Notice: ${message}`;
    return _handler(options);
  } catch (err) {
    return _error(_labels.concat('deprecate'), err);
  }
}

function _error (labels, ...message) {
  return error({ labels, message });
}

function _parseType (type) {
  return [ 'log', 'warn', 'error' ].find(t => t === type) || 'log';
}

function _handler (options) {
  try {
    assertObject(options);
    let { type, labels, message } = options;

    labels = labels || [];
    type = _parseType(type);

    assertArray(labels);
    assertString(type);

    if (!isArray(message)) message = [ message ];

    const baseBadgeStyles = `
      display: inline-block;
      text-align: center;
      border-radius: 2px;
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 600;
      line-height: 14px;
      margin-right: 3px;
      padding: 1px 4px;`;

    if (!labels || isEmptyArray(labels)) {
      return console[type](
        ...message
      );
    }

    const processedLabels = [];
    for (const [ index, label ] of labels.entries()) {
      if (isString(label)) {
        let color;
        if ((index === 0 || index === 1) && PRESET_LABELS[labels[0].toLowerCase()]) {
          color = PRESET_LABELS[labels[0].toLowerCase()][index];
        } else if (index === 2 && PRESET_LABELS[labels[0].toLowerCase()]) {
          color = shadeColor(blendColors(PRESET_LABELS[labels[0].toLowerCase()][0], processedLabels[index - 1]?.color, 0.5), -0.5);
        } else if (index > 2 && PRESET_LABELS[labels[0].toLowerCase()]) {
          color = shadeColor(processedLabels[index - 1]?.color, 0.2);
        } else {
          color = getRandomColor();
        }
        processedLabels.push({
          text: label,
          color
        });
      } else {
        processedLabels.push({
          text: label.text,
          color: label.color || getRandomColor()
        });
      }
    }

    const texts = [];
    const styles = [];

    for (const label of processedLabels.slice(0, 10)) {
      if (!label?.text || !label?.color) {
        throw new Error('Each label must contain a valid text and color property.');
      }
      texts.push(`%c${label.text}`);
      styles.push(
        `${baseBadgeStyles};
        color: ${getContrastColor(label.color)};
        background: ${label.color};`
      );
    }

    return console[type](
      `${texts.join('')}`,
      ...styles,
      ...message
    );
  } catch (err) {
    console.error("Logger Handler", err);
  }
}