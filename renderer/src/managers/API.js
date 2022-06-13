const { readdirSync, statSync } = require('fs');
const { join, parse } = require('path');

import { log, warn, error } from '../modules/util/Logger.js';
const { Directories } = require('@powerpala/constants');

export default class APIManager {
  constructor () {
    this.dir = Directories.API;
    this._apis = [];
    this._labels = [ 'Manager', 'API' ];
  }

  async mount (api) {
    try {
      api = parse(api).name;
      let apiModule = await import(`powerpala://api/${api}.js`);

      const APIClass = apiModule.default;
      powerpala.api[api.toLowerCase()] = new APIClass();
      this._apis.push(api.toLowerCase());
    } catch (err) {
      return this._error(`An error occurred while initializing "${api}"!`, err);
    }
  }

  async load () {
    for (const api of this._apis) {
      await powerpala.api[api]._load();
    }
  }

  async stop () {
    try {
      for (const api of this._apis) {
        await powerpala.api[api]._unload(false);
      }
    } catch (err) {
      return this._error(`There was a problem shutting down ${this.constructor.name} API!`, err);
    }
    return this._log(`All APIs have been unloaded!`);
  }

  async initialize () {
    this._apis = [];
    const apis =
      readdirSync(this.dir)
        .filter(file => statSync(join(this.dir, file)));

    for (const api of apis) {
      await this.mount(api);
    }

    await this.load();
  }

  _log (...message) { log({ labels: this._labels, message }); }
  _warn (...message) { warn({ labels: this._labels, message }); }
  _error (...message) { error({ labels: this._labels, message }); }
}
