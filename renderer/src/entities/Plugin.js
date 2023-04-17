const { log, warn, error } = require('../modules/util/Logger.js');
const { isArray } = require('../modules/util/Array.js');
const { existsSync } = require('fs');
const { join } = require("path");
const { createElement } = require('../modules/util/DOM.js');
const { resolveCompiler } = require('../compilers/index.js');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = class Plugin {
  constructor(){
    this._labels = [ 'Plugin', this.constructor.name ];
    this._ready = false;
    this.styles = {};
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

  getURL(path){
    return `powerpala://plugins/${this.isolationInfo.pluginID}/${path}`;
  }

  get dependencies(){
    return this.manifest.dependencies;
  }

  get optionalDependencies(){
    return this.manifest.optionalDependencies;
  }

  get effectiveOptionalDependencies(){
    const deps = this.manifest.optionalDependencies;
    const disabled = powerpala.settings.get('disabledPlugins', []);
    return deps.filter(d => powerpala.manager.plugins.get(d) !== void 0 && !disabled.includes(d));
  }

  get allDependencies(){
    return this.dependencies.concat(this.optionalDependencies);
  }

  get allEffectiveDependencies(){
    return this.dependencies.concat(this.effectiveOptionalDependencies);
  }

  get dependents(){
    const dependents = [ ...powerpala.manager.plugins._plugins.values() ].filter(p => p.manifest.dependencies.includes(this.entityID));
    return [ ...new Set(dependents.map(d => d.entityID).concat(...dependents.map(d => d.dependents))) ];
  }

  get color(){
    return '#ff9600';
  }

  loadStylesheet(path){
    let resolvedPath = path;
    if(!existsSync(resolvedPath)){
      resolvedPath = join(powerpala.manager.plugins.dir, this.entityID, path);

      if (!existsSync(resolvedPath)) throw new Error(`Cannot find "${path}"! Make sure the file exists and try again.`);
    }

    const id = Math.random().toString(36).slice(2);
    const compiler = resolveCompiler(resolvedPath);
    const style = createElement('style', { id: `style-${this.entityID}-${id}`, 'data-powerpala': true, 'data-plugin': true });
    document.head.appendChild(style);

    this.styles[id] = compiler;
    const compile = async () => {
      style.innerHTML = await compiler.compile();
    };

    compiler.enableWatcher();
    compiler.on('src-update', compile);
    this[`__compileStylesheet_${id}`] = compile;
    this[`__compiler_${id}`] = compiler;
    return compile();
  }

  async _update(force=false){
    const success = await super._update(force);
    if (success && this._ready) await powerpala.manager.plugins.remount(this.entityID);
    return success;
  }

  async _load(){
    try {
      while(!this.allEffectiveDependencies.every(pluginName => powerpala.manager.plugins.get(pluginName)._ready)) await sleep(1);
      if(this.start instanceof Function) await this.start();

      this.log('Plugin loaded.');
      this._ready = true;
    } catch (e) {
      this.error('An error occurred during initialization!', e);
    }
  }

  async _unload(){
    try {
      for(const id in this.styles){
        this[`__compiler_${id}`].on('src-update', this[`__compileStylesheet_${id}`]);
        document.getElementById(`style-${this.entityID}-${id}`).remove();
        this.styles[id].disableWatcher();
      }
      if(this.stop instanceof Function) await this.stop();

      this.log('Plugin unloaded');
      this._ready = false;
    } catch (e) {
      this.error('An error occurred during shutting down! It\'s heavily recommended reloading the launcher to ensure there are no conflicts.', e);
    }
  }
}
