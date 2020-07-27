const { API } = require('powerpala');
const { EventEmitter } = require('events');

module.exports = class EventsAPI extends API {
  constructor(){
    super();

    let emitter = new EventEmitter();

    Object.entries(emitter).map(({key, value}) => {
      this[key] = value;
    });

    initLauncher = this._callFunc("onInitLauncher", initLauncher);

    closeLauncher = this._callFunc("onCloseLauncher", closeLauncher);

    onDistroLoad = this._callFunc("onDistroLoad", onDistroLoad);

    onAutoUpdateFinish = this._callFunc("onAutoUpdateFinish", onAutoUpdateFinish);

    downloadJava = this._callFunc("onDownloadJava", downloadJava);

    onValidateJava = this._callFunc("onValidateJava", onValidateJava);

    setLoadingStatut = this._callFunc("onSetLoadingStatut", setLoadingStatut);

    onLogin = this._callFunc("onLogin", onLogin);

    refreshServer = this._callFunc("onRefreshServer", refreshServer);

    refreshLauncherUserCompte = this._callFunc("onRefreshLauncherUserCompte", refreshLauncherUserCompte);

    gameUpdate = this._callFunc("onLaunching", gameUpdate);

    initSettings = this._callFunc("onInitSettings", initSettings);

    initSettingsJavaExecutableTab = this._callFunc("onInitSettingsJavaExecutableTab", initSettingsJavaExecutableTab);

    initSettingsJavaMemoryTab = this._callFunc("onInitSettingsJavaMemoryTab", initSettingsJavaMemoryTab);

    initSettingsUserCompteTab = this._callFunc("onInitSettingsUserCompteTab", initSettingsUserCompteTab);

    initLauncherHomePanel = () => {
      refreshServer();
      refreshLauncherUserCompte();
    }

    let playButton = document.querySelector("#launcher-home-play-button");

    let events = playButton[Object.keys(playButton).filter(k => k.startsWith("jQuery"))[0]].events;

    events.click[0].handler = () => {
      gameUpdate();
    }
  }

  _callFunc(emit, callback){
    return (...data) => {
      let preventDefault = false;
      this.emit(emit, ...data, () => preventDefault = true);
      if(!preventDefault) callback(...data);
    }
  }
}
