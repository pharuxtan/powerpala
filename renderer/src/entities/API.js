const { log, warn, error } = require('../modules/util/Logger.js');
const { isArray } = require('../modules/util/Array.js');

module.exports = class API {
  constructor () {
    this._labels = [ 'API', this.constructor.name ];
    this._ready = false;
  }

  log (...message) {
    // In case the API wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      log({ labels: message[0], message: _message });
    } else {
      log({ labels: this._labels, message });
    }
  }

  warn (...message) {
    // In case the API wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      warn({ labels: message[0], message: _message });
    } else {
      warn({ labels: this._labels, message });
    }
  }

  error (...message) {
    // In case the API wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      error({ labels: message[0], message: _message });
    } else {
      error({ labels: this._labels, message });
    }
  }

  /**
   * Loads the API.
   * @param {boolean} [showLogs=true] Whether to show startup console logs
   * @private
   */
  async _load (showLogs = true) {
    try {
      if (typeof this.start === 'function') {
        await this.start();
      }
      if (showLogs) {
        this.log('API loaded.');
      }
      this._ready = true;
    } catch (err) {
      this.error('An error occurred during initialization!', err);
    }
  }

  /**
   * Unloads the API.
   * @param {boolean} [showLogs=true] Whether to show shutdown console logs
   * @private
   */
  async _unload (showLogs = true) {
    /*try {
      if (typeof this.stop === 'function') {
        await this.stop();
      }
      if (showLogs) {
        this.log('API unloaded.');
      }
    } catch (err) {
      this.error(`An error occurred while shutting down! It's heavily recommended that you reload Discord to ensure there are no conflicts.`, err);
    } finally {
      this._ready = false;
    }*/
  }

  #events = {}

  on(name, func){
    if(!this.#events[name]) this.#events[name] = [];
    this.#events[name].push(func);
  }

  off(name, func){
    if(!this.#events[name] || this.#events[name].indexOf(func) == -1) return;
    this.#events[name].splice(this.#events[name].indexOf(func), 1);
  }

  emit(name, ...args){
    if(!this.#events[name]) return;
    for(let func of this.#events[name]){
      func(...args);
    }
  }
}
