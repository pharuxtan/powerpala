const { API } = require("@powerpala/entities");

module.exports = class Isolation extends API {
  constructor(){
    super();
  }

  GET_LAUNCHER_MAXIMIZED_AT_STARTUP = "getLauncherMaximizedAtStartup";
  SET_LAUNCHER_MAXIMIZED_AT_STARTUP = "setLauncherMaximizedAtStartup";
  MINIMIZE_WINDOW = "minimizeWindow";
  MAXIMIZE_WINDOW = "maximizeWindow";
  UNMAXIMIZE_WINDOW = "unmaximizeWindow";
  CLOSE_WINDOW = "closeWindow";
  CHECK_FOR_UPDATES = "checkForUpdates";
  QUIT_AND_INSTALL_UPDATE = "quitAndInstallUpdate";
  LOG_ERROR = "logError";
  LOG_WARN = "logWarn";
  LOG_INFO = "logInfo";
  LOG_VERBOSE = "logVerbose";
  LOG_DEBUG = "logDebug";
  LOG_SILLY = "logSilly";
  GET_AUTO_LAUNCH_IS_ENABLED = "getAutoLaunchIsEnabled";
  SET_AUTO_LAUNCH = "setAutoLaunch";
  GET_ACCOUNTS = "getAccounts";
  CHANGE_ACCOUNT = "changeAccount";
  DELETE_ACCOUNT = "deleteAccount";
  LOGOUT = "logout";
  GET_ACCESS_TOKEN = "getAccessToken";
  GET_ALL_VANILLA_VERSIONS = "getAllVanillaVersions";
  CHECK_IF_VANILLA_INSTALLED = "checkIfVanillaInstalled";
  CHECK_IF_CUSTOM_INSTALLED = "checkIfCustomInstalled";
  LAUNCH_CUSTOM = "launchCustom";
  LAUNCH_MINECRAFT_VANILLA = "launchMinecraftVanilla";
  GET_LAST_VANILLA_VERSION = "getLastVanillaVersion";
  GET_BLOG_POSTS = "getBlogPosts";
  GET_GAME_JAVA_PATH = "getGameJavaPath";
  GET_GAME_MEM = "getGameMem";
  GET_GAME_RESOLUTION = "getGameResolution";
  GET_GAME_START_IN_FULLSCREEN = "getGameStartInFullscreen";
  GET_LAUNCHER_STAY_OPEN = "getLauncherStayOpen";
  SET_LAST_VANILLA_VERSION = "setLastVanillaVersion";
  SET_GAME_JAVA_PATH = "setGameJavaPath";
  SET_GAME_MEM = "setGameMem";
  SET_GAME_RESOLUTION = "setGameResolution";
  SET_GAME_START_IN_FULLSCREEN = "setGameStartInFullscreen";
  SET_LAUNCHER_STAY_OPEN = "setLauncherStayOpen";
  GET_NOTIFICATIONS = "getNotifications";
  SET_NOTIFICATION_READ = "setNotificationRead";
  SET_NOTIFICATION_ARCHIVE = "setNotificationArchive";
  GET_VERSION = "getVersion";
  GET_TOTAL_MEM = "getTotalMem";
  GET_FREE_MEM = "getFreeMem";
  GET_IS_UNDER_MAINTENANCE = "getIsUnderMaintenance";
  IS_WINDOWS = "isWindows";
  IS_MACOS = "isMacos";
  IS_LINUX = "isLinux";
  LOAD_URL = "loadURL";
  ON_GOTO = "onGoTo";
  ON_USER_DATA_FETCH = "onUserDataFetch";
  ON_UPDATE_AVAILABLE = "onUpdateAvailable";
  ON_GAME_DOWNLOAD_PROGRESS = "onGameDownloadProgress";
  ON_GAME_STARTUP = "onGameStartup";
  ON_GAME_DOWNLOAD_FINISH = "onGameDownloadFinish";
  ON_NOTIFICATIONS = "onNotifications";
  ON_SET_LOGIN_BTN = "onSetLoginBtn";
  ON_UPDATE_ACCOUNTS = "onUpdateAccounts";

  /*
    Exemple:
    powerpala.api.isolation.modify("loadURL", async (cb, ...args) => {
      if(args[X] == "") return;
      return cb();
    })
  */

  modify(name, callback){
    paladiumApi._modifier(name, callback);
  }
}
