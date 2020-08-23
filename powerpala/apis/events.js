const { API } = require('powerpala');
const { EventEmitter } = require('events');

module.exports = class EventsAPI extends API {
  constructor(){
    super();

    let emitter = new EventEmitter();

    Object.entries(emitter).map(({key, value}) => {
      this[key] = value;
    });

    /* events not in the file:
     *
     * on("showLoading") // (preventDefault)
     * on("logout") // (event, preventDefault)
     **/

    initLauncher = this._callFunc("initLauncher", initLauncher); // (preventDefault)

    closeLauncher = this._callFunc("closeLauncher", closeLauncher); // (preventDefault)

    onDistroLoad = this._callFunc("distroLoad", onDistroLoad); // (data, preventDefault)

    onAutoUpdateFinish = this._callFunc("autoUpdateFinish", onAutoUpdateFinish); // (preventDefault)

    downloadJava = this._callFunc("downloadJava", downloadJava); // (preventDefault)

    onValidateJava = this._callFunc("validateJava", onValidateJava); // (preventDefault)

    setLoadingStatut = this._callFunc("setLoadingStatut", setLoadingStatut); // (text, preventDefault)

    onLogin = this._callFunc("login", onLogin); // (preventDefault)

    refreshServer = this._callFunc("refreshServer", refreshServer); // (preventDefault)

    refreshLauncherUserCompte = this._callFunc("refreshLauncherUserCompte", refreshLauncherUserCompte); // (preventDefault)

    gameUpdate = this._callFunc("gameUpdate", gameUpdate); // (preventDefault)

    gameBuilder = this._callFunc("gameBuild", gameBuilder); // (preventDefault)

    initSettings = this._callFunc("initSettings", initSettings); // (preventDefault)

    initSettingsJavaExecutableTab = this._callFunc("initSettingsJavaExecutableTab", initSettingsJavaExecutableTab); // (preventDefault)

    initSettingsJavaMemoryTab = this._callFunc("initSettingsJavaMemoryTab", initSettingsJavaMemoryTab); // (preventDefault)

    initSettingsUserCompteTab = this._callFunc("initSettingsUserCompteTab", initSettingsUserCompteTab); // (preventDefault)

    initLauncherHomePanel = this._callFunc("initLauncherHomePanel", () => { // (preventDefault)
      refreshServer();
      refreshLauncherUserCompte();
    });

    //Overlay

    setOverlayContent = this._callFunc("setOverlayContent", setOverlayContent); // (title, description, buttonClose = 'Fermer', buttonAction = null, timeLeft = null, timeLeftMessage = null, preventDefault)

    toggleOverlay = this._callFunc("toggleOverlay", toggleOverlay); // (toggleState, preventDefault)

    setActionHandler = this._callFunc("setActionHandler", setActionHandler); // (handler, preventDefault)

    setCloseHandler = this._callFunc("setCloseHandler", setCloseHandler); // (handler, preventDefault)

    setGameUpdateOverlayContent = this._callFunc("setGameUpdateOverlayContent", setGameUpdateOverlayContent); // (preventDefault)

    toggleGameUpdateOverlay = this._callFunc("toggleGameUpdateOverlay", toggleGameUpdateOverlay); // (toggleState, preventDefault)

    setGameUpdateOverlayTitle = this._callFunc("setGameUpdateOverlayTitle", setGameUpdateOverlayTitle); // (title, preventDefault)

    setGameUpdateOverlayDownload = this._callFunc("setGameUpdateOverlayDownload", setGameUpdateOverlayDownload); // (text, preventDefault)

    setGameUpdateOverlayDownloadProgress = this._callFunc("setGameUpdateOverlayDownloadProgress", setGameUpdateOverlayDownloadProgress); // (percent, color = 'blue', preventDefault)
  }

  _callFunc(emit, callback){
    return (...data) => {
      let preventDefault = false;
      this.emit(emit, ...data, () => preventDefault = true);
      if(!preventDefault) callback(...data);
    }
  }
}
