const { join, dirname, normalize, sep, extname } = require('path');
const electron = require('electron');
const { getType } = require('mime');
const { parse } = require('url');
const { readdirSync, readFileSync } = require('fs');
const Module = require('module');

const paladiumPath = join(dirname(require.main.filename), '..', 'pala.asar');
const PatchedBrowserWindow = require('./browserwindow');
const electronPath = require.resolve('electron');

const paladiumPackage = require(join(paladiumPath, 'package.json'));
electron.app.setAppPath(paladiumPath);
electron.app.getVersion = () => paladiumPackage.version;
electron.app.name = paladiumPackage.name;

require("./ipc");
let settings = {};
try {
  settings = require("../settings/settings.json");
} catch(e){}
let electronExport = { ...electron, BrowserWindow: PatchedBrowserWindow };
if(settings.multi) electronExport.app.requestSingleInstanceLock = () => true;

delete require.cache[electronPath].exports;
require.cache[electronPath].exports = { ...electron, BrowserWindow: PatchedBrowserWindow };

electron.protocol.registerSchemesAsPrivileged([
  {
    scheme: 'powerpala',
    privileges: {
      supportFetchAPI: true,
      corsEnabled: true,
      standard: true,
      secure: true
    }
  }
]);

electron.app.once('ready', () => {
  // Powerpala protocol
  electron.protocol.registerFileProtocol('powerpala', (request, callback) => {
    const [ url ] = normalize(request.url.replace('powerpala://', '')).replace(/^(\.\.(\/|\\|$))+/, '').split('?');
    const type = url.split(sep)[0];
    const path = url.replace(`${type}${sep}`, '');

    if (type === "api"){
      return callback({ path: join(__dirname, '..', 'renderer', 'src', type, path) });
    } else if (type === "plugins" || type == "themes"){
      return callback({ path: join(__dirname, '..', 'addons', type, path) });
    } else if (type === 'util') {
      return callback({ path: join(__dirname, '..', 'renderer', 'src', 'modules', 'util', path) });
    } else {
      return callback({ path: join(__dirname, '..', type, path) });
    }
  });

  // index.html modifier
  electron.protocol.interceptBufferProtocol('file', (request, callback) => {
    let pathname = parsePathname(request.url);
    let fileContents = readFileSync(pathname);
    let extension = extname(pathname);
    let mimeType = getType(extension);

    if(extension == ".html"){
      let assetsDir = join(paladiumPath, 'renderer', 'assets');
      let powerpalaAssetsDir = join(__dirname, "..", "renderer", "app", "assets");
      let paladiumAssets = readdirSync(assetsDir);
      let powerpalaAssets = readdirSync(powerpalaAssetsDir)

      let module = readFileSync(join(__dirname, "module.template.js"), "utf8").replace(/\r/g, "").split("//\n");
      module[1] = readFileSync(join(assetsDir, paladiumAssets.find(a => a.endsWith(".js"))), "utf8");

      let index = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Paladium</title>
          <script type="module">
            ${module.join("")}
          </script>
          <script type="module">
            ${readFileSync(join(powerpalaAssetsDir, powerpalaAssets.find(a => a.endsWith(".js"))), "utf8")}
          </script>
          <style>
            @font-face {
              font-family: "Inter";
              src: url("powerpala://assets/fonts/Inter.ttf") format("truetype");
            }
          </style>
          <link rel="stylesheet" href="${join(powerpalaAssetsDir, powerpalaAssets.find(a => a.endsWith(".css")))}">
          <link rel="stylesheet" href="./assets/${paladiumAssets.find(a => a.endsWith(".css"))}">
        </head>
        <body>
          <div id="powerpala"></div>
          <div id="app"></div>
        </body>
      </html>
      `

      fileContents = Buffer.from(index);
    }

    return callback({
      data: fileContents,
      mimeType: mimeType
    });
  });
});

Module._load(join(paladiumPath, paladiumPackage.main), null, true);

function parsePathname(reqUrl) {
  let parsedUrl = parse(reqUrl)
  let pathname = decodeURIComponent(parsedUrl.pathname)

  if (process.platform === 'win32' && !parsedUrl.host.trim()) {
    pathname = pathname.substr(1)
  }
  return pathname
}
