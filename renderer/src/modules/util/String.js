const { camelCase, lowerCase, startCase, upperFirst, snakeCase, kebabCase, isString: _isString } = require('lodash');
const _chunk = require('chunk-text');
const pluralize = require('pluralize');
const { error } = require('./Logger.js');

const _labels = [ 'Util', 'String' ];
const _error = (labels, ...message) => error({ labels, message });

const isSingular = text => {
  try {
    return pluralize.isSingular(text);
  } catch (err) {
    return _error(_labels.concat('isSingular'), err);
  }
};

exports.isSingular = isSingular;

const isPlural = text => {
  try {
    return pluralize.isPlural(text);
  } catch (err) {
    return _error(_labels.concat('isPlural'), err);
  }
};

exports.isPlural = isPlural;

const toSingular = text => {
  try {
    return pluralize.singular(text);
  } catch (err) {
    return _error(_labels.concat('toSingular'), err);
  }
};

exports.toSingular = toSingular;

const toPlural = text => {
  try {
    return pluralize(text);
  } catch (err) {
    return _error(_labels.concat('toPlural'), err);
  }
};

exports.toPlural = toPlural;

const toPluralOrSingular = (text, count) => {
  try {
    return pluralize(text, count);
  } catch (err) {
    return _error(_labels.concat('toPluralOrSingular'), err);
  }
};

exports.toPluralOrSingular = toPluralOrSingular;

const chunkText = (text, numberOfCharacters) => {
  try {
    return _chunk.default(text, numberOfCharacters);
  } catch (err) {
    return _error(_labels.concat('chunkText'), err);
  }
};

exports.chunkText = chunkText;

const toHash = text => {
  try {
    let h1 = 0xdeadbeef ^ 0;
    let h2 = 0x41c6ce57 ^ 0;
    for (let i = 0, ch; i < text.length; i++) {
      ch = text.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
  } catch (err) {
    return _error(_labels.concat('toHash'), err);
  }
};

exports.toHash = toHash;

const stripDiacritics = text => {
  try {
    const pattern = /[\u0300-\u036f]/g;
    return text.normalize('NFD').replace(pattern, '').normalize('NFC');
  } catch (err) {
    return _error(_labels.concat('stripDiacritics'), err);
  }
};

exports.stripDiacritics = stripDiacritics;

const isUrl = input => {
  try {
    new URL(input);
    return true;
  } catch (err) {
    return false;
  }
};

exports.isUrl = isUrl;

/**
 * Converts text to a camel case string.
 * @param {*} text Text to convert
 * @returns {string} Text in camel case
 * @example
 * // returns `iAmACamelCaseString`
 * toCamelCase('I am a CAMEL CASE string.')
 */
const toCamelCase = text => {
  try {
    return camelCase(text);
  } catch (err) {
    return _error(_labels.concat('toCamelCase'), err);
  }
};

exports.toCamelCase = toCamelCase;

/**
 * Converts text to a lowercase dot case string.
 * @param {*} text Text to convert
 * @returns {string} Text in dot case
 * @example
 * // returns `i.am.a.dot.case.string`
 * toDotCase('I am a DOT CASE string.')
 */
const toDotCase = text => {
  try {
    return lowerCase(text).replace(/ /g, '.');
  } catch (err) {
    return _error(_labels.concat('toDotCase'), err);
  }
};

exports.toDotCase = toDotCase;

/**
 * Converts text to a title case string.
 * @param {*} text Text to convert
 * @returns {string} Text in title case
 * @example
 * // returns `I Am A Title Case String`
 * toTitleCase('I am a TITLE CASE string.')
 */
const toTitleCase = text => {
  try {
    return startCase(camelCase(text));
  } catch (err) {
    return _error(_labels.concat('toTitleCase'), err);
  }
};

exports.toTitleCase = toTitleCase;

/**
 * Converts text to a sentence case string.
 * @param {*} text Text to convert
 * @returns {string} Text in sentence case
 * @example
 * // returns `I am a sentence case string`
 * toSentenceCase('i am a SENTENCE CASE string.')
 */
const toSentenceCase = text => {
  try {
    return upperFirst(lowerCase(text));
  } catch (err) {
    return _error(_labels.concat('toSentenceCase'), err);
  }
};

exports.toSentenceCase = toSentenceCase;

/**
 * Converts text to a pascal case string.
 * @param {*} text Text to convert
 * @returns {string} Text in pascal case
 * @example
 * // returns `IAmAPascalCaseString`
 * toPascalCase('I am a PASCAL CASE string.')
 */
const toPascalCase = text => {
  try {
    return startCase(camelCase(text)).replace(/ /g, '');
  } catch (err) {
    return _error(_labels.concat('toPascalCase'), err);
  }
};

exports.toPascalCase = toPascalCase;

/**
 * Converts text to a lower path case string.
 * @param {*} text Text to convert
 * @returns {string} String in path case
 * @example
 * // returns `i/am/a/path/case/string`
 * toPathCase('I am a PATH CASE string.')
 */
const toPathCase = text => {
  try {
    return lowerCase(text).replace(/ /g, '/');
  } catch (err) {
    return _error(_labels.concat('toPathCase'), err);
  }
};

exports.toPathCase = toPathCase;

/**
 * Converts text to a lower snake case string.
 * @param {*} text Text to convert
 * @returns {string} String in snake case
 * @example
 * // returns `i_am_a_snake_case_string`
 * toSnakeCase('I am a SNAKE CASE string.')
 */
const toSnakeCase = text => {
  try {
    return snakeCase(text);
  } catch (err) {
    return _error(_labels.concat('toSnakeCase'), err);
  }
};

exports.toSnakeCase = toSnakeCase;

/**
 * Converts text to a kebab case string.
 * @param {*} text Text to convert
 * @returns {string} String in kebab case
 * @example
 * // returns `i-am-a-kebab-case-string`
 * toKebabCase('i am a keBab CASE string.')
 */
const toKebabCase = text => {
  try {
    return kebabCase(text);
  } catch (err) {
    return _error(_labels.concat('toKebabCase'), err);
  }
};

exports.toKebabCase = toKebabCase;

/**
 * Checks if the input is a string.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is a string
 */
const isString = input => {
  try {
    return _isString(input);
  } catch (err) {
    return _error(_labels.concat('isString'), err);
  }
};

exports.isString = isString;

/**
 * Asserts that the input is a string.
 * If it isn't a string, it throws an error, otherwise it does nothing.
 * @param {*} input Argument input
 * @throws {TypeError} Throw an error if the input is not a string
 */
const assertString = input => {
  /**
   * We do not want to use a try...catch here purposefully in order to
   * get proper stack traces and labels.
   */
  if (!isString(input)) {
    throw new TypeError(`Expected a string but received ${typeof input}.`);
  }
};

exports.assertString = assertString;

const getRandomString = length => {
  try {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  } catch (err) {
    return _error(_labels.concat('getRandomString'), err);
  }
};

exports.getRandomString = getRandomString;
