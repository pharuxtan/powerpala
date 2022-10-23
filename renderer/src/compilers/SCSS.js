const { promises: { readFile }, existsSync, statSync } = require('fs');
const { join, dirname, posix, sep } = require('path');

const Compiler = require('./compiler.js');

module.exports = class SCSS extends Compiler {
  async listFiles () {
    return [
      this.file,
      ...(await this._resolveDeps(this.file))
    ];
  }

  _compile () {
    return paladiumApi._compileSass(this.file);
  }

  async _resolveDeps (file, resolvedFiles = []) {
    const scss = await readFile(file, 'utf8');
    const basePath = dirname(file);
    for (const match of scss.matchAll(/@(?:import|use|forward) ['"]([^'"]+)/ig)) {
      const filePath = this._resolveFile(join(basePath, match[1]).split(sep).join(posix.sep));
      if (filePath) {
        if (!resolvedFiles.includes(filePath)) {
          resolvedFiles.push(filePath);
          await this._resolveDeps(filePath, resolvedFiles);
        }
      }
    }
    return resolvedFiles;
  }

  _resolveFile (partialFile) {
    if (existsSync(partialFile) && statSync(partialFile).isDirectory()) {
      partialFile = join(partialFile, '_index.scss');
      if (existsSync(partialFile)) {
        return partialFile;
      }
      return null;
    }
    const extensions = [ 'scss', 'css' ];
    if (!extensions.some(ext => partialFile.endsWith(`.${ext}`))) {
      for (const ext of extensions) {
        const resolved = this._resolveFile0(`${partialFile}.${ext}`);
        if (resolved) {
          return resolved;
        }
      }
    }
    return this._resolveFile0(partialFile);
  }

  _resolveFile0 (partialFile) {
    if (!existsSync(partialFile)) {
      const f = partialFile.split('/');
      f[f.length - 1] = `_${f[f.length - 1]}`;
      partialFile = f.join('/');
      if (!existsSync(partialFile)) {
        return null;
      }
    }
    if (statSync(partialFile).isDirectory()) {
      return null;
    }
    return partialFile;
  }
};
