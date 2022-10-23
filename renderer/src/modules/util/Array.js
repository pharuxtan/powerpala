const { isArray: _isArray, isEmpty: _isEmpty, sample: _sample } = require('lodash');

const { error } = require('./Logger.js');
const { isString } = require('./String.js');

const _labels = [ 'Util', 'Array' ];
const _error = (labels, ...message) => error({ labels, message });

/**
 * Checks if the input is an array.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is an array
 */
const isArray = input => {
  try {
    return _isArray(input);
  } catch (err) {
    _error(_labels.concat('isArray'), err);
  }
};

exports.isArray = isArray;

/**
 * Flattens an array.
 * @param {Array} array Array input
 * @returns {string|null}
 */
const flattenArray = array => {
  return array.reduce((flat, toFlatten) => (
    flat.concat(isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten)
  ), []);
};

exports.flattenArray = flattenArray;

/**
 * Asserts that the input is an array.
 * If it isn't an array, it throws an error, otherwise it does nothing.
 * @param {*} input Argument input
 * @throws {TypeError} Throw an error if the input is not an array
 */
const assertArray = input => {
  /**
   * We do not want to use a try...catch here purposefully in order to
   * get proper stack traces and labels.
   */
  if (!isArray(input)) {
    throw new TypeError(`Expected an array but received ${typeof input}.`);
  }
};

exports.assertArray = assertArray;

/**
 * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
 * @param {Array} array Array to process
 * @param {('and'|'or')} [lastItemConnector='and'] Word that is used to connect the last array item
 * @returns {Promise<string>} Array returned as a string list, joined by commas and "and" or "or" for the final item
 */
const toSentence = async (array, lastItemConnector = 'and') => {
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

exports.toSentence = toSentence;

/**
 * Checks if the input is an empty array.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is an empty array
 */
const isEmptyArray = input => {
  try {
    return _isEmpty(input);
  } catch (err) {
    _error(_labels.concat('isEmptyArray'), err);
  }
};

exports.isEmptyArray = isEmptyArray;

/**
 * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
 * @param {Array} array Array to process
 * @returns {*} Random item require(the array
 */
const getRandomItem = array => {
  try {
    return _sample(array);
  } catch (err) {
    _error(_labels.concat('getRandomItem'), err);
  }
};

exports.getRandomItem = getRandomItem;
