const { promises: { readFile } } = require('fs');

import Compiler from './compiler.js';

export default class CSS extends Compiler {
  async compile () {
    const css = await readFile(this.file, 'utf8');
    if (this.watcherEnabled) {
      this._watchFiles();
    }
    return css;
  }

  computeCacheKey () {
    return null;
  }
};