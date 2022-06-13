const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { createHash } = require('crypto');
const watch = require('node-watch');
const { join } = require('path');
const { Directories } = require('@powerpala/constants');

export default class Compiler {
  constructor (file) {
    this.file = file;
    this.dir = Directories.CACHE;
    this.watcherEnabled = false;
    this._watchers = {};
    this._compiledOnce = {};
    this._labels = [ 'Compiler', this.constructor.name ];
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir, { recursive: true });
    }
  }

  enableWatcher () {
    this.watcherEnabled = true;
  }

  disableWatcher () {
    this.watcherEnabled = false;
    Object.values(this._watchers).forEach(w => w.close());
    this._watchers = {};
  }

  compile () {
    try {
      const cacheKey = this.computeCacheKey();
      if (cacheKey instanceof Promise) {
        return cacheKey.then(key => this._doCompilation(key));
      }
      return this._doCompilation(cacheKey);
    } catch (err) {
      return console.log(err);
    }
  }

  _doCompilation (cacheKey) {
    try {
      let cacheFile;
      if (cacheKey) {
        cacheFile = join(this.dir, cacheKey);
        if (existsSync(cacheFile)) {
          const compiled = readFileSync(cacheFile, 'utf8');
          this._finishCompilation(null, compiled);
          return compiled;
        }
      }

      const compiled = this._compile();
      if (compiled instanceof Promise) {
        return compiled.then(finalCompiled => {
          this._finishCompilation(cacheFile, finalCompiled);
          return finalCompiled;
        });
      }
      this._finishCompilation(cacheFile, compiled);
      return compiled;
    } catch (err) {
      return this._error(err);
    }
  }

  /**
   * @private
   */
  _finishCompilation (cacheFile, compiled) {
    try {
      if (cacheFile) {
        writeFileSync(cacheFile, compiled, () => void 0);
      }
      if (this.watcherEnabled) {
        this._watchFiles();
      }
    } catch (err) {
      return console.log(err);
    }
  }

  async _watchFiles () {
    const files = await this.listFiles();
    // Filter no longer used watchers
    Object.keys(this._watchers).forEach(k => {
      if (!files.includes(k)) {
        this._watchers[k].close();
        delete this._watchers[k];
      }
    });

    // Add new watchers
    files.forEach(f => {
      if (!this._watchers[f]) {
        this._watchers[f] = watch(f, () => this.emit('src-update'));
      }
    });
  }

  listFiles () {
    try {
      return [ this.file ];
    } catch (err) {
      return console.log(err);
    }
  }

  computeCacheKey () {
    try {
      const files = this.listFiles();
      if (files instanceof Promise) {
        return files.then(this._computeCacheKey.bind(this));
      }
      return this._computeCacheKey(files);
    } catch (err) {
      return console.log(err);
    }
  }

  _computeCacheKey (files) {
    try {
      const hashes = files.map(this.computeFileHash.bind(this));
      if (hashes.length === 1) {
        return hashes[0];
      }
      const hash = createHash('sha1');
      hashes.forEach(h => hash.update(h));
      return hash.digest('hex');
    } catch (err) {
      return console.log(err);
    }
  }

  computeFileHash (file) {
    try {
      if (!existsSync(file)) {
        throw new Error('File doesn\'t exist!');
      }
      const fileBuffer = readFileSync(file);
      return createHash('sha1')
        .update(this._metadata)
        .update(fileBuffer)
        .digest('hex');
    } catch (err) {
      return console.log(err);
    }
  }

  _compile () {
    throw new Error('Not implemented');
  }

  get _metadata () {
    return '';
  }

    // Event Emitter

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
};