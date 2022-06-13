const { join } = require('path');

exports.Protocols = Object.freeze({
  BASE: 'powerpala://',
  get ASSETS () { return `${this.BASE}assets`; },
  get PLUGINS () { return `${this.BASE}plugins`; },
  get PLUGINS () { return `${this.BASE}themes`; }
});

exports.Directories = Object.freeze({
  ROOT: join(__dirname, '..', '..', '..', '..'),
  get SRC () { return join(this.ROOT, 'renderer', 'src'); },
  get SETTINGS () { return join(this.ROOT, 'settings'); },
  get ASSETS () { return join(this.ROOT, 'assets'); },
  get CACHE () { return join(this.ROOT, '.cache'); },
  get ADDONS () { return join(this.ROOT, 'addons'); },
  get THEMES () { return join(this.ADDONS, 'themes'); },
  get PLUGINS () { return join(this.ADDONS, 'plugins'); },
  get API () { return join(this.SRC, 'api'); },
  get MANAGERS () { return join(this.SRC, 'managers'); },
  get MODULES () { return join(__dirname, '..'); }
});

exports.Events = Object.freeze({
  /**
   * Vizality Settings
   */
  POWERPALA_READY: 'POWERPALA_READY',
  POWERPALA_SETTINGS_READY: 'POWERPALA_SETTINGS_READY',
  POWERPALA_SETTING_UPDATE: 'POWERPALA_SETTING_UPDATE',
  POWERPALA_SETTING_TOGGLE: 'POWERPALA_SETTING_TOGGLE',

  /**
   * Addons
   */
  POWERPALA_ADDON_SETTINGS_REGISTER: 'POWERPALA_ADDON_SETTINGS_REGISTER',
  POWERPALA_ADDON_SETTINGS_UNREGISTER: 'POWERPALA_ADDON_SETTINGS_UNREGISTER',
  POWERPALA_ADDON_SETTING_UPDATE: 'POWERPALA_ADDON_SETTING_UPDATE',
  POWERPALA_ADDON_SETTING_TOGGLE: 'POWERPALA_ADDON_SETTING_TOGGLE',
  POWERPALA_ADDON_UNINSTALL_CONFIRM: 'POWERPALA_ADDON_UNINSTALL_CONFIRM',
  POWERPALA_ADDON_UNINSTALL: 'POWERPALA_ADDON_UNINSTALL',
  POWERPALA_ADDON_INSTALL_CONFIRM: 'POWERPALA_ADDON_INSTALL_CONFIRM',
  POWERPALA_ADDON_INSTALL: 'POWERPALA_ADDON_INSTALL',
  POWERPALA_ADDON_ENABLE: 'POWERPALA_ADDON_ENABLE',
  POWERPALA_ADDON_DISABLE: 'POWERPALA_ADDON_DISABLE',
  POWERPALA_ADDON_TOGGLE: 'POWERPALA_ADDON_TOGGLE',
  POWERPALA_ADDONS_READY: 'POWERPALA_ADDONS_READY',

  /**
   * Vizality APIs
   */
  POWERPALA_ACTION_ADD: 'POWERPALA_ACTION_ADD',
  POWERPALA_ACTION_REMOVE: 'POWERPALA_ACTION_REMOVE',
  POWERPALA_ACTION_REMOVE_ALL: 'POWERPALA_ACTION_REMOVE_ALL',
  POWERPALA_ACTION_REMOVE_ALL_BY_CALLER: 'POWERPALA_ACTION_REMOVE_ALL_BY_CALLER',
  POWERPALA_COMMAND_ADD: 'POWERPALA_COMMAND_ADD',
  POWERPALA_COMMAND_REMOVE: 'POWERPALA_COMMAND_REMOVE',
  POWERPALA_COMMAND_REMOVE_ALL: 'POWERPALA_COMMAND_REMOVE_ALL',
  POWERPALA_COMMAND_REMOVE_ALL_BY_CALLER: 'POWERPALA_COMMAND_REMOVE_ALL_BY_CALLER',
  POWERPALA_ROUTE_ADD: 'POWERPALA_ROUTE_ADD',
  POWERPALA_ROUTE_REMOVE: 'POWERPALA_ROUTE_REMOVE',
  POWERPALA_ROUTE_REMOVE_ALL: 'POWERPALA_ROUTE_REMOVE_ALL',
  POWERPALA_ROUTE_REMOVE_ALL_BY_CALLER: 'POWERPALA_ROUTE_REMOVE_ALL_BY_CALLER',
  POWERPALA_KEYBIND_ADD: 'POWERPALA_KEYBIND_ADD',
  POWERPALA_KEYBIND_REMOVE: 'POWERPALA_KEYBIND_REMOVE',
  POWERPALA_KEYBIND_REMOVE_ALL: 'POWERPALA_KEYBIND_REMOVE_ALL',
  POWERPALA_KEYBIND_REMOVE_ALL_BY_CALLER: 'POWERPALA_KEYBIND_REMOVE_ALL_BY_CALLER',
  POWERPALA_NOTICE_SEND: 'POWERPALA_NOTICE_SEND',
  POWERPALA_NOTICE_CLOSE: 'POWERPALA_NOTICE_CLOSE',
  POWERPALA_NOTICE_CLOSE_ALL: 'POWERPALA_NOTICE_CLOSE_ALL',
  POWERPALA_NOTICE_CLOSE_ALL_BY_CALLER: 'POWERPALA_NOTICE_CLOSE_ALL_BY_CALLER',
  POWERPALA_TOAST_SEND: 'POWERPALA_TOAST_SEND',
  POWERPALA_TOAST_CLOSE: 'POWERPALA_TOAST_CLOSE',
  POWERPALA_TOAST_CLOSE_ALL: 'POWERPALA_TOAST_CLOSE_ALL',
  POWERPALA_TOAST_CLOSE_ALL_QUEUED: 'POWERPALA_TOAST_CLOSE_ALL_QUEUED',
  POWERPALA_TOAST_CLOSE_ALL_ACTIVE: 'POWERPALA_TOAST_CLOSE_ALL_ACTIVE',
  POWERPALA_TOAST_CLOSE_ALL_BY_CALLER: 'POWERPALA_TOAST_CLOSE_ALL_BY_CALLER',
  POWERPALA_POPUP_WINDOW_OPEN: 'POWERPALA_POPUP_WINDOW_OPEN',
  POWERPALA_POPUP_WINDOW_CLOSE: 'POWERPALA_POPUP_WINDOW_CLOSE'
});