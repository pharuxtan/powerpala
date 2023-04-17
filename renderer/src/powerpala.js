const { log: _log, warn: _warn, error: _error, deprecate: _deprecate } = require('../renderer/src/modules/util/Logger.js');
const { isArray } = require('../renderer/src/modules/util/Array.js');
const { toPlural } = require('../renderer/src/modules/util/String.js');
const Settings = require('../renderer/src/modules/Settings.js');

class Powerpala {
  constructor () {
    this._labels = [ 'Powerpala', 'Core' ];
    this.electron = paladiumApi;
  }

  async initialize () {
    try {
      console.log('%c ', `background: url('powerpala://assets/images/console-banner.png') no-repeat center / contain; padding: 110px 350px; font-size: 1px; margin: 10px 0;`);
      this.log("Initializing core...");
      this.manager = {};
      const managers = [ 'API', 'Plugin', 'Theme'];
      for (const manager of managers) {
        const formatted = toPlural(manager);
        this.manager[formatted.toLowerCase()] = new (require(`../renderer/src/managers/${manager}.js`));
      }

      this.emit("initiated");
    } catch (err) {
      return this.error(err);
    }
  }

  async start () {
    this.log("Starting modules...");
    this.modules = {};
    const modules = require('../renderer/src/modules/index.js');
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

  executeInIsolation = () => {};

  setExecuteInIsolation(func){
    this.executeInIsolation = func;
  }

  vue = {};

  setVue(vue){
    this.vue = vue;
  }

  events = {}

  on(name, func){
    if(!this.events[name]) this.events[name] = [];
    this.events[name].push(func);
  }

  off(name, func){
    if(!this.events[name] || this.events[name].indexOf(func) == -1) return;
    this.events[name].splice(this.events[name].indexOf(func), 1);
  }

  emit(name, ...args){
    if(!this.events[name]) return;
    for(let func of this.events[name]){
      func(...args);
    }
  }
}

window.powerpala = new Powerpala();

(function(id){
  let keys = id.split(".");
  let obj = window;
  for(let key of keys){
    let newObj = obj[key];
    if(typeof newObj === "function") newObj = newObj.bind(obj);
    obj = newObj;
  }
  return obj;
});
