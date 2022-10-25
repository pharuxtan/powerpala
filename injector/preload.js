const { ipcRenderer, contextBridge } = require('electron');
const { isArray, isEmpty, sample, debounce, escapeRegExp, isString, camelCase, lowerCase, startCase, upperFirst, snakeCase, kebabCase, isObject } = require('lodash');
const { createHash } = require("crypto");

require('module-alias/register');

window.require = require;

require("@powerpala/constants");

window.paladiumApi = {};

let originalExposeInMainWorld = contextBridge.exposeInMainWorld;
contextBridge.exposeInMainWorld = (apiKey, apiObject) => {
  let apis = {};
  function modifier(name){
    apis[name] = {
      callback: (f, ...args) => f(...args),
      function: apiObject[name]
    }
    apiObject[name] = async function(...args){
      let api = apis[name];
      return await api.callback(api.function, ...args);
    }
  }
  for(let name of Object.keys(apiObject)) modifier(name);
  window.paladiumApi = {
    ...apiObject,
    _modifier(name, callback){
      if(!apis[name]) return;
      apis[name].callback = callback;
    },
    _require(module){
      return window.require(module);
    },
    _openDevTools(){
      return ipcRenderer.invoke('POWERPALA_OPEN_DEVTOOLS');
    },
    _closeDevTools(){
      return ipcRenderer.invoke('POWERPALA_CLOSE_DEVTOOLS');
    },
    _compileSass(file){
      return ipcRenderer.invoke('POWERPALA_COMPILE_SASS', file);
    },
    _getPowerpalaFolder(){
      return ipcRenderer.invoke('POWERPALA_FOLDER');
    },
    // Powerpala Splash
    _startLauncher(){
      return ipcRenderer.invoke('POWERPALA_START_LAUNCHER');
    },
    _onLauncherStart(fn){
      ipcRenderer.on('launcherStart', (event, ...args) => fn(...args));
    }
  };
  return originalExposeInMainWorld(apiKey, window.paladiumApi);
}

if (process.platform === 'darwin' && !process.env.PATH.includes('/usr/local/bin')) {
  process.env.PATH += ':/usr/local/bin';
}

const preload = ipcRenderer.sendSync('POWERPALA_GET_PRELOAD');
if (preload){
  process._linkedBinding('electron_common_command_line').appendSwitch('preload', preload);
  require(preload);
}
