import { log as _log, warn as _warn, error as _error, deprecate as _deprecate } from './modules/util/Logger.js';
import { isArray } from './modules/util/Array.js';
import { toPlural } from './modules/util/String.js';
import Settings from './modules/Settings.js';

import API from './entities/API.js';
import Plugin from './entities/Plugin.js';
import Theme from './entities/Theme.js';

export default class Powerpala {
  constructor () {
    this.native = window.PowerpalaNatives;
    delete window.PowerpalaNatives;

    this._labels = [ 'Powerpala', 'Core' ];
    this.entities = { API, Plugin, Theme };
  }

  async initialize () {
    try {
      console.log('%c ', `background: url('powerpala://assets/images/console-banner.png') no-repeat center / contain; padding: 110px 350px; font-size: 1px; margin: 10px 0;`);
     this.log("Initializing core...");
     this.manager = {};
     const managers = [ 'API', 'Plugin', 'Theme'];
     for (const manager of managers) {
      const formatted = toPlural(manager);
      this.manager[formatted.toLowerCase()] = new (await import(`./managers/${manager}.js`)).default();
     }

     this.emit("initiated");
    } catch (err) {
      return this.error(err);
    }
  }

  async start () {
    this.log("Starting modules...");
    this.modules = {};
    const modules = await import('./modules/index.js');
    Object.assign(this.modules, modules);

    this.api = {};
    await this.manager.apis.initialize();

    this.settings = await new Settings().init();

    this.loadEdits();

    await this.manager.themes.initialize();
    await this.manager.plugins.initialize();

    this.emit("ready");
  }

  loadEdits() {
    if(this.settings.get("removemc")){
      document.body.classList.add("removemc");
    }
  }

  async stop () {
    this.manager.themes.stop();
    this.manager.plugins.stop();
    await this.manager.apis.stop();
  }

  log (...message) {
    if (isArray(message[0])) {
      const _message = message.slice(1);
      return _log({ labels: message[0], message: _message });
    }
    return _log({ labels: this._labels, message });
  }

  warn (...message) {
    if (isArray(message[0])) {
      const _message = message.slice(1);
      return _warn({ labels: message[0], message: _message });
    }
    return _warn({ labels: this._labels, message });
  }

  error (...message) {
    if (isArray(message[0])) {
      const _message = message.slice(1);
      return _error({ labels: message[0], message: _message });
    }
    return _error({ labels: this._labels, message });
  }

  deprecate (...message) {
    if (isArray(message[0])) {
      const _message = message.slice(1);
      return _deprecate({ labels: message[0], message: _message });
    }
    return _deprecate({ labels: this._labels, message });
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
