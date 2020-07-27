const { API } = require('powerpala');
const { EventEmitter } = require('events');

module.exports = class EventsAPI extends API {
  constructor(){
    super();

    let emitter = new EventEmitter();

    Object.entries(emitter).map(({key, value}) => {
      this[key] = value;
    });

    initLauncher = this._callFunc("initLauncher", initLauncher);

    closeLauncher = this._callFunc("closeLauncher", closeLauncher);

    onDistroLoad = this._callFunc("distroLoad", onDistroLoad);

    onAutoUpdateFinish = this._callFunc("autoUpdateFinish", onAutoUpdateFinish);

    downloadJava = this._callFunc("downloadJava", downloadJava);

    onValidateJava = this._callFunc("validateJava", onValidateJava);

    setLoadingStatut = this._callFunc("setLoadingStatut", setLoadingStatut);

    onLogin = this._callFunc("login", onLogin);

    refreshServer = this._callFunc("refreshServer", refreshServer);

    refreshLauncherUserCompte = this._callFunc("refreshLauncherUserCompte", refreshLauncherUserCompte);

    gameUpdate = this._callFunc("launching", gameUpdate);

    initSettings = this._callFunc("initSettings", initSettings);

    initSettingsJavaExecutableTab = this._callFunc("initSettingsJavaExecutableTab", initSettingsJavaExecutableTab);

    initSettingsJavaMemoryTab = this._callFunc("initSettingsJavaMemoryTab", initSettingsJavaMemoryTab);

    initSettingsUserCompteTab = this._callFunc("initSettingsUserCompteTab", initSettingsUserCompteTab);

    initLauncherHomePanel = this._callFunc("initLauncherHomePanel", () => {
      refreshServer();
      refreshLauncherUserCompte();
    });

    let playButton = document.querySelector("#launcher-home-play-button");

    let events = playButton[Object.keys(playButton).filter(k => k.startsWith("jQuery"))[0]].events;

    events.click[0].handler = () => {
      gameUpdate();
    }
    
    //Overlay
    
    setOverlayContent = this._callFunc("setOverlayContent", setOverlayContent);

    toggleOverlay = this._callFunc("toggleOverlay", toggleOverlay);

    setActionHandler = this._callFunc("setActionHandler", setActionHandler);

    setCloseHandler = this._callFunc("setCloseHandler", setCloseHandler);

    setGameUpdateOverlayContent = this._callFunc("setGameUpdateOverlayContent", setGameUpdateOverlayContent);

    toggleGameUpdateOverlay = this._callFunc("toggleGameUpdateOverlay", toggleGameUpdateOverlay);

    setGameUpdateOverlayTitle = this._callFunc("setGameUpdateOverlayTitle", setGameUpdateOverlayTitle);

    setGameUpdateOverlayDownload = this._callFunc("setGameUpdateOverlayDownload", setGameUpdateOverlayDownload);

    setGameUpdateOverlayDownloadProgress = this._callFunc("setGameUpdateOverlayDownloadProgress", setGameUpdateOverlayDownloadProgress);
  }

  _callFunc(emit, callback){
    return (...data) => {
      let preventDefault = false;
      this.emit(emit, ...data, () => preventDefault = true);
      if(!preventDefault) callback(...data);
    }
  }
}
