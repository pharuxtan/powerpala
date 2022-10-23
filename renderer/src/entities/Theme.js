const { resolveCompiler } = require('../compilers/index.js');
const { createElement } = require('../modules/util/DOM.js');
const { log, warn, error } = require('../modules/util/Logger.js');

module.exports = class Theme {
  constructor (themeID, manifest) {
    this.entityID = themeID;
    this.compiler = resolveCompiler(manifest.effectiveTheme);
    this.manifest = manifest;
    this.applied = false;
    this._labels = [ 'Theme', manifest .name];
  }

  _log (...message) { log({ labels: this._labels, message }); }
  _warn (...message) { warn({ labels: this._labels, message }); }
  _error (...message) { error({ labels: this._labels, message }); }

  apply(){
    if(!this.applied){
      this.applied = true;
      const style = createElement('style', { id: `theme-${this.entityID}`, 'data-powerpala': true, 'data-theme': true });
      document.head.appendChild(style);
      this._doCompile = async () => {
        style.innerHTML = await this.compiler.compile();
      };

      this.compiler.enableWatcher();
      this.compiler.on('src-update', this._doCompile);
      this._log("Theme loaded.")
      return this._doCompile();
    }
  }

  remove () {
    if(this.applied){
      this.applied = false;
      this.compiler.off('src-update', this._doCompile);
      document.getElementById(`theme-${this.entityID}`).remove();
      this.compiler.disableWatcher();
      this._log("Theme unloaded.")
    }
  }
}
