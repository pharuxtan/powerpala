const Module = require('module');
const { join } = require("path");
const paladiumPath = join(__dirname, "..", "app.asar");

//Load node modules from paladium package
Module.Module.globalPaths.push(join(paladiumPath, 'node_modules'));

const electron = require('electron');
const fs = require('fs');
const mime = require('mime');
const path = require('path');
const ejs = require('ejs');
const url = require('url');

const electronPath = require.resolve('electron');

const config = (fs.existsSync(join(__dirname, "powerpala", "config.json"))) ? require(join(__dirname, "powerpala", "config.json")) : {};

let opt = {};

const plugins = fs.readdirSync(join(__dirname, "powerpala", "plugins"));

for(let plugin of plugins){
  try{
    const file = fs.readdirSync(join(__dirname, "powerpala", "plugins", plugin)).filter(f => f.startsWith("window.json"))[0];

    if(file){
      if(config.disabledPlugins && config.disabledPlugins.includes(plugin)) continue;

      let win = require(join(__dirname, "powerpala", "plugins", plugin, file));

      if(win.platform != "all" && win.platform != process.platform) continue;

      Object.entries(win.options).map(([key, value]) => {
        opt[key] = value;
      });
    }
  } catch(e){}
}

class PatchedBrowserWindow extends electron.BrowserWindow {
  constructor(options) {
    Object.entries(opt).map(([key, value]) => {
      options[key] = value;
    });

    options.webPreferences.preload = join(__dirname, "powerpala", "preload.js");
    options.webPreferences.nodeIntegration = true;
    if(config.transparent) options.transparent = true;
    super(options);
  }
}

if(config.multiinstance) process.mas = true;

const electronExports = new Proxy(electron, {
  get (target, prop) {
    switch(prop) {
      case 'BrowserWindow': return PatchedBrowserWindow;
      default: return target[prop];
    }
  }
});

delete require.cache[electronPath].exports;
require.cache[electronPath].exports = electronExports;

//Disable Content-Security-Policy
electron.app.on('ready', () => {
  electron.protocol.interceptBufferProtocol('file', (request, callback) => {
    let pathname = parsePathname(request.url);
    let fileContents = fs.readFileSync(pathname);
    let extension = path.extname(pathname);
    let mimeType = mime.getType(extension);

    if (extension === '.ejs') {
      fileContents = compileEjs(pathname, Buffer.from(fileContents.toString().replace(`content="script-src 'self'"`, `content`)));
      mimeType = 'text/html'
    }

    return callback({
      data: fileContents,
      mimeType: mimeType
    });
  });

  function compileEjs(pathname, contentBuffer) {
    let contentString = contentBuffer.toString();
    let temp = ejs.Template;
    ejs.compile = function(template, opts) {
      var templ;

      if (opts && opts.scope) {
        if (!opts.context) opts.context = opts.scope;
        delete opts.scope;
      }
      templ = new ejs.Template(template.split("<% include ").join("<%- include('./").split(".ejs %>").join(".ejs') %>"), opts);
      return templ.compile();
    };
    let compiledEjs = ejs.render(contentString, {}, {filename: pathname});

    return Buffer.from(compiledEjs)
  }

  function parsePathname(reqUrl) {
  	let parsedUrl = url.parse(reqUrl)
  	let pathname = decodeURIComponent(parsedUrl.pathname)

  	if (process.platform === 'win32' && !parsedUrl.host.trim()) {
  		pathname = pathname.substr(1)
  	}
  	return pathname
  }
});

const paladiumPackage = require(join(paladiumPath, "package.json"));
electron.app.setAppPath(paladiumPath);
electron.app.getVersion = () => paladiumPackage.version;

setImmediate(() => {
  const devToolsExtensions = join(electron.app.getPath('userData'), 'DevTools Extensions');

  if(fs.existsSync(devToolsExtensions)) fs.unlinkSync(devToolsExtensions);
});

console.log('Loading Paladium');
Module._load(join(paladiumPath, paladiumPackage.main), null, true);
