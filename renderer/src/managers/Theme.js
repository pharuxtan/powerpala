const { log, warn, error } = require('../modules/util/Logger.js');
const { join } = require('path');
const { Directories } = require('@powerpala/constants');
const { readdirSync, existsSync, mkdirSync, readFileSync, promises: { lstat } } = require('fs');

const Theme = require('../entities/Theme.js');

const fileRegex = /\.((s?c)ss)$/;

const ErrorTypes = Object.freeze({
  NOT_A_DIRECTORY: 'NOT_A_DIRECTORY',
  MANIFEST_LOAD_FAILED: 'MANIFEST_LOAD_FAILED',
  INVALID_MANIFEST: 'INVALID_MANIFEST'
});

module.exports = class ThemeManager {
  constructor(){
    this.dir = Directories.THEMES;
    this._themes = new Map();

    this._labels = [ 'Manager', 'Theme' ];
  }

  get disabledThemes(){
    return powerpala.settings.get('disabledThemes', []);
  }

  get(themeID){
    return this._themes.get(themeID);
  }

  getThemes(){
    return [ ...this._themes.keys() ];
  }

  isInstalled(theme){
    return this._themes.has(theme);
  }

  isEnabled(theme){
    return !this.disabledThemes.includes(theme);
  }

  enable(themeID){
    if(!this.get(themeID)) throw new Error(`Tried to enable a non installed theme (${themeID})`);

    powerpala.settings.set('disabledThemes', this.disabledThemes.filter(p => p !== themeID));
    this._themes.get(themeID).apply();
  }

  disable(themeID){
    if(!this.get(themeID)) throw new Error(`Tried to disable a non installed theme (${themeID})`);

    powerpala.settings.set('disabledThemes', [ ...this.disabledThemes, themeID ]);
    this._themes.get(themeID).remove();
  }

  async mount(themeID, filename){
    let manifest;
    try {
      const manifestFile = join(this.dir, filename, 'manifest.json');
      if (!existsSync(manifestFile)) {
        this._logError(ErrorTypes.MANIFEST_LOAD_FAILED, [ themeID ]);
        this._error('Failed to load manifest', e);
        return;
      }

      manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
    } catch (e) {
      this._logError(ErrorTypes.MANIFEST_LOAD_FAILED, [ themeID ]);
      this._error('Failed to load manifest', e);
      return;
    }

    const errors = this._validateManifest(manifest);
    if(errors.length > 0) {
      this._logError(ErrorTypes.INVALID_MANIFEST, [ themeID ]);
      this._error(`Invalid manifest; Detected the following errors:\n\t${errors.join('\n\t')}`);
      return;
    }

    if(manifest.theme) manifest.effectiveTheme = manifest.theme;
    else return this._warn(`Theme "${themeID}" is not meant to run on that environment - Skipping`);

    manifest.effectiveTheme = join(this.dir, filename, manifest.effectiveTheme);
    this._themes.set(themeID, new Theme(themeID, manifest));
  }

  unmount(themeID){
    const theme = this._themes.get(themeID);
    if (!theme) throw new Error(`Tried to unmount a non installed theme (${themeID})`);

    theme.remove();
    this._themes.delete(themeID);
  }

  async initialize(sync=false){
    const missingThemes = [];
    if(!existsSync(this.dir)) mkdirSync(this.dir);
    const files = readdirSync(this.dir);
    for (let filename of files) {
      if(filename.startsWith('.')) continue;

      const themeID = filename.split('.').shift();
      if(!sync){
        await this.mount(themeID, filename);
        if (!this._themes.get(themeID)) continue;
      }

      if(!this.disabledThemes.includes(themeID)){
        if(sync && !this.isInstalled(themeID)){
          await this.mount(themeID, filename);
          missingThemes.push(themeID);
        }
        this._themes.get(themeID).apply();
      }
    }

    if(sync) return missingThemes;
  }

  stop(){
    [ ...this._themes.values() ].forEach(t => t.remove());
  }

  _logError(errorType, args){
    switch(errorType){
      case ErrorTypes.NOT_A_DIRECTORY:
        this._error(`Invalid theme: "${args[0]}" is a file`, "This is most likely a mistake. Make sure all your theme files are in a subfolder.");
        break;
      case ErrorTypes.MANIFEST_LOAD_FAILED:
        this._error(`Failed to load manifest for "${args[0]}"`, "This is probably due to a syntax error in the file. Check console for more details.");
        break;
      case ErrorTypes.INVALID_MANIFEST:
        this._error(`Invalid manifest for "${args[0]}"`);
        break;
    }
  }

  _validateManifest(manifest){
    const errors = [];
    if(typeof manifest.name !== 'string') errors.push(`Invalid name: expected a string got ${typeof manifest.name}`);
    if(typeof manifest.description !== 'string') errors.push(`Invalid description: expected a string got ${typeof manifest.description}`);
    if(typeof manifest.version !== 'string') errors.push(`Invalid version: expected a string got ${typeof manifest.version}`);
    if(typeof manifest.author !== 'string') errors.push(`Invalid author: expected a string got ${typeof manifest.author}`);
    if(typeof manifest.theme !== 'string') errors.push(`Invalid theme: expected a string got ${typeof manifest.theme}`);
    else if(!fileRegex.test(manifest.theme)) errors.push('Invalid theme: unsupported file extension');
    if(manifest.plugins !== void 0) {
      if(!Array.isArray(manifest.plugins)) errors.push(`Invalid plugins: expected an array got ${typeof manifest.plugins}`);
      else manifest.plugins.forEach(p => errors.push(...this._validatePlugin(p)));
    }
    if(manifest.settings !== void 0) errors.push(...this._validateSettings(manifest.settings));
    return errors;
  }

  _validatePlugin(plugin){
    const errors = [];
    if(!plugin instanceof Object) {
      errors.push(`Invalid plugin: expected an object got ${typeof plugin}`);
      return errors;
    }
    if(plugin instanceof Array) {
      errors.push('Invalid plugin: expected an object got an array');
      return errors;
    }
    if(typeof plugin.name !== 'string') errors.push(`Invalid plugin name: expected a string got ${typeof plugin.name}`);
    if(typeof plugin.description !== 'string') errors.push(`Invalid plugin description: expected a string got ${typeof plugin.description}`);
    if(![ 'undefined', 'string' ].includes(typeof plugin.author)) errors.push(`Invalid plugin author: expected a string got ${typeof plugin.author}`);
    if(typeof plugin.file !== 'string') errors.push(`Invalid plugin file: expected a string got ${typeof plugin.file}`);
    else if(!fileRegex.test(plugin.file)) errors.push('Invalid plugin file: unsupported file extension');
    if(plugin.settings !== void 0) errors.push(...this._validateSettings(plugin.settings));

    return errors;
  }

  _validateSettings(settings){
    const errors = [];
    if(settings instanceof Object) {
      errors.push(`Invalid settings: expected an object got ${typeof settings}`);
      return errors;
    }
    if(settings instanceof Array) {
      errors.push('Invalid settings: expected an object got an array');
      return errors;
    }
    if(typeof settings.format !== 'string') errors.push(`Invalid settings format: expected a string got ${typeof settings.format}`);
    else if(![ 'css', 'scss' ].includes(settings.format)) errors.push(`Invalid settings format: "${settings.format}" is not a valid format. Please refer to the documentation.`);
    if(!settings.options instanceof Array) errors.push(`Invalid options: expected an array got ${typeof settings.options}`);
    else settings.options.forEach(o => errors.push(...this._validateOption(o)));
    return errors;
  }

  _validateOption(option){
    const errors = [];
    if(option instanceof Object) {
      errors.push(`Invalid option: expected an object got ${option}`);
      return errors;
    }
    if(option instanceof Array) {
      errors.push('Invalid option: expected an object got an array');
      return errors;
    }
    if(typeof option.name !== 'string') errors.push(`Invalid option name: expected a string got ${typeof option.name}`);
    if(typeof option.variable !== 'string') errors.push(`Invalid option variable: expected a string got ${typeof option.name}`);
    if(option.variable.length === '') errors.push('Invalid option variable: got an empty string');
    if(![ 'undefined', 'string' ].includes(typeof option.description)) errors.push(`Invalid option description: expected a string got ${typeof option.description}`);
    if(typeof option.type !== 'string') errors.push(`Invalid option type: expected a string got ${typeof option.type}`);
    else if(![ 'string', 'select', 'number', 'color', 'color_alpha', 'url', 'background', 'font' ].includes(option.type)) errors.push(`Invalid option type: "${option.type}" is not a valid option type. Please refer to the documentation.`);
    if(option.type === 'string' && typeof option.limit !== 'undefined') errors.push(...this._validateLimits(option.limit));
    if(option.type === 'select') errors.push(...this._validateSettingsSelect(option));
    if(option.type === 'number') errors.push(...this._validateSettingsNumber(option));
    return errors;
  }

  _validateSettingsSelect(option){
    const errors = [];
    if(!option.options instanceof Array) errors.push(`Invalid select options: expected an array got ${typeof option.options}`);
    else {
      option.options.forEach(opt => {
        if(!opt instanceof Object) errors.push(`Invalid select option: expected an object got ${typeof opt}`);
        else {
          if(typeof opt.label !== 'string') errors.push(`Invalid select option label: expected a string got ${typeof option.label}`);
          if(typeof opt.value !== 'string') errors.push(`Invalid select option value: expected a string got ${typeof option.name}`);
        }
      });
    }
    return errors;
  }

  _validateSettingsNumber(option){
    const errors = [];
    if(typeof option.limit !== 'undefined') errors.push(...this._validateLimits(option.limit));
    if(typeof option.markers !== 'undefined') {
      if (!Array.isArray(option.markers)) errors.push(`Invalid option markers: expected an array got ${typeof option.markers}`);
      else if (option.markers.some(m => typeof m !== 'number')) errors.push('Invalid option markers: some entries aren\'t numbers!');
    }
    if(![ 'undefined', 'boolean' ].includes(typeof option.sticky)) errors.push(`Invalid option stickyness: expected a boolean got ${typeof option.sticky}`);
    return errors;
  }

  _validateLimits(limits){
    const errors = [];
    if(!limits instanceof Array) errors.push(`Invalid limit value: expected an array got ${typeof limits}`);
    else if(limits.length !== 2) errors.push(`Invalid limit value: expected two values, got ${limits.length}`);
    else if(typeof limits[0] !== 'number' || typeof limits[1] !== 'number') errors.push(`Invalid limit value: expected the values to be numbers, got [${typeof limits[0]}, ${typeof limits[1]}]`);
    else if(limits[0] > limits[1]) errors.push('Invalid limit value: minimum is greater than maximum');
    return errors;
  }

  _log (...message) { log({ labels: this._labels, message }); }
  _warn (...message) { warn({ labels: this._labels, message }); }
  _error (...message) { error({ labels: this._labels, message }); }
};
