const { API } = require('powerpala');
const { remote: { globalShortcut } } = require('electron');

module.exports = class KeybindsAPI extends API {
  constructor(){
    super();

    this.keybinds = {};
  }

  registerKeybind(id, keybind){
    if(this.keybinds[id]) throw new Error(`Keybind ${id} is already registered!`);
    this.keybinds[id] = keybind;
    this._register(keybind);
  }

  changeBind(id, newBind){
    if(!this.keybinds[id]) throw new Error(`Keybind ${id} is not registered!`);

    this._unregister(this.keybinds[id]);
    this.keybinds[id].keybind = newBind;
    this._register(this.keybinds[id]);
  }

  unregisterKeybind(id){
    if(this.keybinds[id]){
      this._unregister(this.keybinds[id]);
      delete this.keybinds[id];
    }
  }

  _register(keybind){
    try {
      globalShortcut.register(keybind.keybind, keybind.executor);
    } catch (e) {
      this.error('Failed to register keybind!', e);
    }
  }

  _unregister (keybind) {
    try {
      globalShortcut.unregister(keybind.keybind);
    } catch (e) {}
  }
}
