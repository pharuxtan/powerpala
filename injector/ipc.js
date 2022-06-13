const { ipcMain } = require('electron');
const { renderSync } = require('sass');
const { join, dirname, posix, sep } = require('path');
const { existsSync, promises: { readFile } } = require('fs');

function openDevTools(evt, opts){
  evt.sender.openDevTools(opts);
}

function closeDevTools(evt){
  evt.sender.closeDevTools();
}

function compileSass(_, file){
  return new Promise((res, reject) => {
    readFile(file, 'utf8').then((scss) => {
      try {
        const result = renderSync({
          data: scss,
          importer: (url, prev) => {
            url = url.replace('file:///', '');
            if (existsSync(url)) {
              return {
                file: url
              };
            }
            const prevFile = prev === 'stdin' ? file : prev;
            return {
              file: join(dirname(decodeURI(prevFile)), url).split(sep).join(posix.sep)
            };
          }
        });
        if (result) {
          return res(result.css.toString());
        }
      } catch (err) {
        return reject(err);
      }
    });
  });
}

ipcMain.on('POWERPALA_GET_PRELOAD', evt => evt.returnValue = evt.sender._preload);
ipcMain.handle('POWERPALA_OPEN_DEVTOOLS', openDevTools);
ipcMain.handle('POWERPALA_CLOSE_DEVTOOLS', closeDevTools);
ipcMain.handle('POWERPALA_COMPILE_SASS', compileSass);
ipcMain.handle('POWERPALA_FOLDER', () => join(__dirname, ".."));

// Powerpala Splash
const paladiumPath = join(dirname(require.main.filename), '..', 'pala.asar');
function startLauncher(){
  require(join(paladiumPath, "build", "main", "services", "AuthService.js")).default();
}
ipcMain.handle('POWERPALA_START_LAUNCHER', startLauncher);

let electronUpdaterPath = join(paladiumPath, "node_modules", "electron-updater", "out", "main.js");
let electron_updater = require("electron-updater");
let autoUpdaterOn = electron_updater.autoUpdater.on;
require.cache[electronUpdaterPath] = require.cache[require.resolve("electron-updater")];
require.cache[electronUpdaterPath].exports.autoUpdater.on = function on(event, callback){
  if(event == "update-not-available"){
    return autoUpdaterOn.call(this, event, () => {
      let UpdateWindow = require(join(paladiumPath, "build", "main", "windows", "UpdateWindow.js"));
      const updateWindow = UpdateWindow.default.getWindow();
      if(updateWindow) updateWindow.webContents.send('launcherStart');
      callback();
    });
  }
  return autoUpdaterOn.call(this, event, callback);
};
