import { log, warn, error } from '../modules/util/Logger.js';
const { existsSync, mkdirSync, readdirSync, readFileSync } = require('fs');
const { Directories } = require('@powerpala/constants');
const { join } = require('path');

let manifestKeys = [ 'name', 'version', 'description', 'author' ];

export default class PluginManager {
  constructor () {
    this.dir = Directories.PLUGINS;
    this._plugins = new Map();

    this._labels = [ 'Manager', 'Plugin' ];
  }

  get(pluginID){
    return this._plugins.get(pluginID);
  }

  getPlugins(){
    return [ ...this._plugins.keys() ];
  }

  isInstalled(plugin){
    return this._plugins.has(plugin);
  }

  isEnabled(plugin){
    return !powerpala.settings.get('disabledPlugins', []).includes(plugin);
  }

  openPluginsFolder(){
    shell.openItem(join(__dirname, "..", "plugins"));
  }

  async mount(pluginID){
    let manifest;
    try {
      manifest = Object.assign({ dependencies: [], optionalDependencies: [] }, JSON.parse(readFileSync(join(this.dir, pluginID, 'manifest.json'), "utf8")));
    } catch (e) {
      return this._error(`Plugin ${pluginID} doesn't have a valid manifest - Skipping`);
    }

    if (!manifestKeys.every(key => manifest.hasOwnProperty(key))) return this._error(`Plugin "${pluginID}" doesn't have a valid manifest - Skipping`);

    if(!manifest.platform) manifest.platform = "all";

    if(manifest.platform != "all" && manifest.platform != process.platform) return;

    try {
      const PluginClass = (await import(join("powerpala://", "plugins", pluginID, "index.js"))).default;
      Object.defineProperties(PluginClass.prototype, {
        entityID: {
          get: () => pluginID,
          set: () => {
            throw new Error('Plugins cannot update their ID at runtime!');
          }
        },
        manifest: {
          get: () => manifest,
          set: () => {
            throw new Error('Plugins cannot update manifest at runtime!');
          }
        }
      });
      this._plugins.set(pluginID, new PluginClass());
    } catch (e) {
      this._error(`An error occurred while initializing "${pluginID}"!`, e);
    }
  }

  async remount(pluginID){
    try {
      await this.unmount(pluginID);
    } catch(e) {}
    this.mount(pluginID);
    this._plugins.get(pluginID)._load();
  }

  async unmount(pluginID){
    const plugin = this.get(pluginID);
    if(!plugin) throw new Error(`Tried to unmount a non installed plugin (${plugin})`);
    if(plugin._ready) await plugin._unload();

    this._plugins.delete(pluginID);
  }

  load(pluginID){
    const plugin = this.get(pluginID);
    if(!plugin) throw new Error(`Tried to load a non installed plugin (${plugin})`);
    if(plugin._ready) return this._error(`Tried to load an already loaded plugin (${pluginID})`);
    plugin._load();
  }

  unload(pluginID){
    const plugin = this.get(pluginID);
    if (!plugin) throw new Error(`Tried to unload a non installed plugin (${plugin})`);
    if (!plugin._ready) return this._error(`Tried to unload a non loaded plugin (${plugin})`);
    plugin._unload();
  }

  enable(pluginID){
    if (!this.get(pluginID)) throw new Error(`Tried to enable a non installed plugin (${pluginID})`);

    powerpala.settings.set('disabledPlugins', powerpala.settings.get('disabledPlugins', []).filter(p => p !== pluginID));
    this.load(pluginID);
  }

  disable(pluginID){
    if (!this.get(pluginID)) throw new Error(`Tried to disable a non installed plugin (${pluginID})`);

    powerpala.settings.set('disabledPlugins', [ ...powerpala.settings.get('disabledPlugins', []), pluginID ]);
    this.unload(pluginID);
  }

  async initialize(sync=false){
    const missingPlugins = [];
    if(!existsSync(this.dir)) mkdirSync(this.dir);
    for(let filename of readdirSync(this.dir)){
      !this.isInstalled(filename) && await this.mount(filename)
    }
    for(let plugin of [ ...this._plugins.values() ]){
      if(powerpala.settings.get('disabledPlugins', []).includes(plugin.entityID)) continue;
      if(sync && !this.get(plugin.entityID)._ready){
        this.load(plugin.entityID);
        missingPlugins.push(plugin.entityID);
      } else if(!sync) this.load(plugin.entityID);
    }

    if(sync) return missingPlugins;
  }

  stop(){
    return this._bulkUnload([ ...powerpala.manager.plugins._plugins.keys() ]);
  }

  async _bulkUnload(plugins){
    const nextPlugins = [];
    for(let plugin of plugins){
      const deps = this.get(plugin).allDependencies;
      if(deps.filter(dep => this.get(dep) && this.get(dep)._ready).length !== 0) nextPlugins.push(plugin);
      else await this.unmount(plugin);
    }
    if(nextPlugins.length !== 0) await this._bulkUnload(nextPlugins);
  }

  _log (...message) { log({ labels: this._labels, message }); }
  _warn (...message) { warn({ labels: this._labels, message }); }
  _error (...message) { error({ labels: this._labels, message }); }
};
