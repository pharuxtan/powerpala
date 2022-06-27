const { ipcRenderer, contextBridge, clipboard, shell, nativeImage } = require('electron');
const { isArray, isEmpty, sample, debounce, escapeRegExp, isString, camelCase, lowerCase, startCase, upperFirst, snakeCase, kebabCase, isObject } = require('lodash');
const { createHash } = require("crypto");

require('module-alias/register');

const whitelist = [
  // Node
  'path',
  'util',
  'fs',

  // Paladium imports
  'electron-log',
];

window.require = module => {
  try {
    if(module == "electron") return { clipboard, shell, nativeImage, ipcRenderer };
    if(module == "lodash") return { isArray, isEmpty, sample, debounce, escapeRegExp, isString, camelCase, lowerCase, startCase, upperFirst, snakeCase, kebabCase, isObject };
    if(module == "crypto") return {
      createHash: (hash) => {
        let h = createHash(hash);
        function Obj(){
          return {
            update: (...args) =>{
              h.update(...args);
              return Obj();
            },
            digest: (...args) => h.digest(...args)
          }
        }
        return Obj();
      }
    };
    if (whitelist.includes(module) || module.startsWith('@powerpala') || require.resolve(module).indexOf("powerpala") != -1) {
      return require(module);
    }

    throw new Error(`Node module "${module.toString()}" is not whitelisted and cannot be used in this scope.`);
  } catch (err) {
    return console.error(err);
  }
};

require("@powerpala/constants");

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
  return originalExposeInMainWorld(apiKey, {
    ...apiObject,
    _modifier(name, callback){
      if(!apis[name]) return;
      apis[name].callbacks.push(callback);
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
  })
}

if (process.platform === 'darwin' && !process.env.PATH.includes('/usr/local/bin')) {
  process.env.PATH += ':/usr/local/bin';
}

const preload = ipcRenderer.sendSync('POWERPALA_GET_PRELOAD');
if (preload){
  process._linkedBinding('electron_common_command_line').appendSwitch('preload', preload);
  require(preload);
}
