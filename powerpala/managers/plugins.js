const fs = require('fs');
const { join } = require("path");
const { shell } = require('electron');
const { rmdirRf } = require('powerpala/util');

module.exports = class PluginManager {
  constructor () {
    this.pluginDir = join(__dirname, '..', 'plugins');
    this.plugins = new Map();

    this.manifestKeys = [ 'name', 'version', 'description', 'author', 'license' ];
  }

  get(pluginID){
    return this.plugins.get(pluginID);
  }

  getPlugins(){
    return [ ...this.plugins.keys() ];
  }

  isInstalled(plugin){
    return this.plugins.has(plugin);
  }

  isEnabled(plugin){
    return !powerpala.settings.get('disabledPlugins', []).includes(plugin);
  }

  openPluginsFolder(){
    shell.openItem(join(__dirname, "..", "plugins"));
  }

  mount(pluginID){
    let manifest;
    try {
      manifest = Object.assign({ dependencies: [], optionalDependencies: [] }, require(join(this.pluginDir, pluginID, 'manifest.json')));
    } catch (e) {
      return console.error('%c[Powerpala]', 'color: #ff9600', `Plugin ${pluginID} doesn't have a valid manifest - Skipping`);
    }

    if (!this.manifestKeys.every(key => manifest.hasOwnProperty(key))) return console.error('%c[Powerpala]', 'color: #ff9600', `Plugin "${pluginID}" doesn't have a valid manifest - Skipping`);

    if(!manifest.platform) manifest.platform = "all";

    if(manifest.platform != "all" && manifest.platform != process.platform) return;

    try {
      const PluginClass = require(join(this.pluginDir, pluginID));
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
      this.plugins.set(pluginID, new PluginClass());
    } catch (e) {
      console.error('%c[Powerpala:Plugin]', 'color: #ff9600', `An error occurred while initializing "${pluginID}"!`, e);
    }
  }

  async remount(pluginID){
    try {
      await this.unmount(pluginID);
    } catch(e) {}
    this.mount(pluginID);
    this.plugins.get(pluginID)._load();
  }

  async unmount(pluginID){
    const plugin = this.get(pluginID);
    if(!plugin) throw new Error(`Tried to unmount a non installed plugin (${plugin})`);
    if(plugin.ready) await plugin._unload();

    Object.keys(require.cache).forEach(key => {
      if (key.includes(pluginID)) delete require.cache[key];
    });
    this.plugins.delete(pluginID);
  }

  load(pluginID){
    const plugin = this.get(pluginID);
    if(!plugin) throw new Error(`Tried to load a non installed plugin (${plugin})`);
    if(plugin.ready) return console.error('%c[Powerpala]', 'color: #ff9600', `Tried to load an already loaded plugin (${pluginID})`);
    plugin._load();
  }

  unload(pluginID){
    const plugin = this.get(pluginID);
    if (!plugin) throw new Error(`Tried to unload a non installed plugin (${plugin})`);
    if (!plugin.ready) return console.error('%c[Powerpala]', 'color: #ff9600', `Tried to unload a non loaded plugin (${plugin})`);
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

  startPlugins(sync=false){
    const missingPlugins = [];
    if(!fs.existsSync(this.pluginDir)) fs.mkdirSync(this.pluginDir);
    fs.readdirSync(this.pluginDir).forEach(filename => !this.isInstalled(filename) && this.mount(filename));
    for(let plugin of [ ...this.plugins.values() ]){
      if(powerpala.settings.get('disabledPlugins', []).includes(plugin.entityID)) continue;
      if(sync && !this.get(plugin.entityID).ready){
        this.load(plugin.entityID);
        missingPlugins.push(plugin.entityID);
      } else if(!sync) this.load(plugin.entityID);
    }

    if(sync) return missingPlugins;
  }

  shutdownPlugins(){
    return this._bulkUnload([ ...powerpala.pluginManager.plugins.keys() ]);
  }

  async _bulkUnload(plugins){
    const nextPlugins = [];
    for(let plugin of plugins){
      const deps = this.get(plugin).allDependencies;
      if(deps.filter(dep => this.get(dep) && this.get(dep).ready).length !== 0) nextPlugins.push(plugin);
      else await this.unmount(plugin);
    }
    if(nextPlugins.length !== 0) await this._bulkUnload(nextPlugins);
  }
};
