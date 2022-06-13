const { existsSync, mkdirSync } = require('fs');
const { BrowserWindow } = require('electron');
const { join } = require('path');

const PluginsDir = join(__dirname, '..', 'addons', 'plugins');
const ThemesDir = join(__dirname, '..', 'addons', 'themes');
const SettingsDir = join(__dirname, '..', 'settings');

let transparent = false;
let settings = {};

if (!existsSync(PluginsDir)) mkdirSync(PluginsDir, { recursive: true });
if (!existsSync(ThemesDir)) mkdirSync(ThemesDir, { recursive: true });
if (!existsSync(SettingsDir)) mkdirSync(SettingsDir, { recursive: true });

try {
  settings = require(join(SettingsDir, 'settings.json'));
  ({ transparent } = settings);
} catch (e) {}

module.exports = class PatchedBrowserWindow extends BrowserWindow {
  constructor (opts) {
    let originalPreload = opts.webPreferences.preload;
    opts.webPreferences.preload = join(__dirname, 'preload.js');

    if(transparent){
      opts.transparent = true;
      opts.frame = process.platform === 'win32' ? false : opts.frame;
      delete opts.backgroundColor;
    }

    const win = new BrowserWindow(opts);

    win.webContents._preload = originalPreload;
    return win;
  }
}
