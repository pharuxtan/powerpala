const { isArray: _isArray, isEmpty: _isEmpty, sample: _sample } = require('lodash');

import { error } from './Logger.js';
import { isString } from './String.js';

const _labels = [ 'Util', 'Array' ];
const _error = (labels, ...message) => error({ labels, message });

/**
 * Checks if the input is an array.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is an array
 */
export const isArray = input => {
  try {
    return _isArray(input);
  } catch (err) {
    _error(_labels.concat('isArray'), err);
  }
};

/**
 * Flattens an array.
 * @param {Array} array Array input
 * @returns {string|null}
 */
export const flattenArray = array => {
  return array.reduce((flat, toFlatten) => (
    flat.concat(isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten)
  ), []);
};

/**
 * Asserts that the input is an array.
 * If it isn't an array, it throws an error, otherwise it does nothing.
 * @param {*} input Argument input
 * @throws {TypeError} Throw an error if the input is not an array
 */
export const assertArray = input => {
  /**
   * We do not want to use a try...catch here purposefully in order to
   * get proper stack traces and labels.
   */
  if (!isArray(input)) {
    throw new TypeError(`Expected an array but received ${typeof input}.`);
  }
};

/**
 * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
 * @param {Array} array Array to process
 * @param {('and'|'or')} [lastItemConnector='and'] Word that is used to connect the last array item
 * @returns {Promise<string>} Array returned as a string list, joined by commas and "and" or "or" for the final item
 */
export const toSentence = async (array, lastItemConnector = 'and') => {
  try {
    // Assert argument types
    assertArray(array);
    if (!isString(lastItemConnector) || (lastItemConnector.toLowerCase() !== 'and' && lastItemConnector.toLowerCase() !== 'or')) {
      throw new Error('Second argument must be a string value of "and" or "or".');
    }
    let type;
    switch (lastItemConnector.toLowerCase()) {
      case 'and': type = 'conjunction'; break;
      case 'or': type = 'disjunction'; break;
    }
    const locale = (await import('../i18n'))?.chosenLocale;
    const formatter = new Intl.ListFormat(locale, { style: 'long', type });
    return formatter.format(array);
  } catch (err) {
    _error(_labels.concat('toSentence'), err);
  }
};

/**
 * Checks if the input is an empty array.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is an empty array
 */
export const isEmptyArray = input => {
  try {
    return _isEmpty(input);
  } catch (err) {
    _error(_labels.concat('isEmptyArray'), err);
  }
};

/**
 * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
 * @param {Array} array Array to process
 * @returns {*} Random item from the array
 */
export const getRandomItem = array => {
  try {
    return _sample(array);
  } catch (err) {
    _error(_labels.concat('getRandomItem'), err);
  }
};
