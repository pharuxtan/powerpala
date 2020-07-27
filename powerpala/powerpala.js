const fs = require('fs');
const { join } = require("path");
const APIManager = require('./managers/apis');
const PluginManager = require('./managers/plugins');
const StyleManager = require('./managers/styles');
const { execSync } = require('child_process');

module.exports = class Powerpala {
  constructor(){
    window.powerpala = this;

    this.api = {};
    this.initialized = false;
    this.styleManager = new StyleManager();
    this.pluginManager = new PluginManager();
    this.apiManager = new APIManager();
    this.settings = new Settings();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  async init(){
    // Start
    await this._startup();

    await this._settings();

    if(process.platform === "darwin") await this._fixMacOSErrors();
  }

  async _startup(){
    //Edit the launcher title
    if(process.platform != "darwin") document.querySelector(".frame-content p[class=title]").innerHTML = "<b>Paladium Launcher - Powerpala</b>";

    // APIs
    await this.apiManager.startAPIs();

    await this.loadCustomSplashes();

    // Themes
    this.styleManager.loadThemes();

    // Plugins
    await this.pluginManager.startPlugins();

    this.initialized = true;
  }

  async loadCustomSplashes(){
    powerpala.api.loader.addSplash("powerpala", "pharuxtan", [
      ["ff731637", "ff4411c9", "ff571cc9", "ffb644c9", "ffb644c9", "ffb644c9", "ffb644c9", "ffb644c9", "ffb644c9", "ffb644c9", "ffb644c9", "ffb74594", "ffb74339", "none", "none", "none"],
      ["none", "none", "ff4411b9", "ff330ffd", "ff6224ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644fe", "ffb744a5", "none", "none"],
      ["none", "none", "none", "ff350d2c", "ff220d99", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "none", "none"],
      ["none", "none", "none", "none", "none", "ffb643ab", "ffb644ff", "ffb644ff", "ffb74363", "none", "none", "ffb644b4", "ffb644ff", "ffb644ff", "ffb644aa", "none"],
      ["none", "none", "none", "none", "none", "ffb643ab", "ffb644ff", "ffb644ff", "ffb74363", "none", "none", "none", "ffb644fc", "ffb643b2", "ffb644fc", "none"],
      ["none", "none", "none", "none", "none", "ffb643ab", "ffb644ff", "ffb644ff", "ffb74363", "none", "none", "none", "ffb544a0", "ffb74458", "ffb644fb", "none"],
      ["none", "none", "none", "none", "none", "ffb643ab", "ffb644ff", "ffb644ff", "ffb544a7", "ffb64470", "ffb44471", "ffb544ef", "ffb644ff", "ffb644ff", "ffb6447e", "none"],
      ["none", "none", "none", "none", "none", "ffb643ab", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "none", "none"],
      ["none", "none", "none", "none", "none", "ffb643ab", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb644ff", "ffb645c4", "none", "none"],
      ["none", "none", "none", "none", "none", "ffb643ab", "ffb644ea", "ffb6454d", "ffb62403", "ffb62403", "ffb62403", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "ffb643ab", "ffb64362", "ffa43ecd", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "ffb54490", "ffb64362", "ff7c2eff", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "ffb24b14", "ffae40e1", "ff310fff", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "ffb64111", "ff9032fc", "ff2e0efd", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "ffab3c40", "ff6117d0", "ff3f0909", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "ff7e1c41", "ff69182c", "none", "none", "none", "none", "none", "none", "none", "none", "none"]
    ]);

    powerpala.api.loader.addSplash("inversé :)", "pharuxtan", [
      ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "59defd", "59defd", "59defd"],
      ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "59defd", "0569f7", "0a2bb0", "59defd"],
      ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "59defd", "0569f7", "0a2bb0", "0569f7", "59defd"],
      ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "59defd", "0569f7", "0a2bb0", "0569f7", "59defd", "none"],
      ["none", "none", "none", "none", "f7f7f7", "none", "none", "none", "none", "59defd", "0569f7", "0a2bb0", "0569f7", "59defd", "none", "none"],
      ["none", "none", "none", "f7f7f7", "f7f7f7", "none", "none", "59defd", "59defd", "0569f7", "0a2bb0", "0569f7", "59defd", "none", "none", "none"],
      ["none", "none", "f7f7f7", "f7f7f7", "f7f7f7", "none", "59defd", "0569f7", "0569f7", "0a2bb0", "0569f7", "59defd", "none", "none", "none", "none"],
      ["none", "none", "f7f7f7", "c4c7c8", "f7f7f7", "none", "59defd", "0569f7", "0a2bb0", "0569f7", "59defd", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "f7f7f7", "c4c7c8", "59defd", "0569f7", "0a2bb0", "0569f7", "0569f7", "59defd", "none", "none", "none", "none", "none"],
      ["none", "none", "f7f7f7", "c4c7c8", "f7f7f7", "f7f7f7", "f7f7f7", "0569f7", "59defd", "59defd", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "f7f7f7", "c4c7c8", "f7f7f7", "949898", "f7f7f7", "59defd", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "f7f7f7", "949898", "f7f7f7", "f7f7f7", "c4c7c8", "f7f7f7", "f7f7f7", "f7f7f7", "f7f7f7", "none", "none", "none", "none"],
      ["none", "none", "c4c7c8", "949898", "f7f7f7", "c4c7c8", "c4c7c8", "f7f7f7", "c4c7c8", "f7f7f7", "f7f7f7", "none", "none", "none", "none", "none"],
      ["f7f7f7", "f7f7f7", "949898", "c4c7c8", "none", "f7f7f7", "f7f7f7", "none", "f7f7f7", "f7f7f7", "none", "none", "none", "none", "none", "none"],
      ["f7f7f7", "00f9ff", "f7f7f7", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["f7f7f7", "f7f7f7", "f7f7f7", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"]
    ]);

    powerpala.api.loader.addSplash("paladium sword", "paladium");
  }

  async _settings(){
    powerpala.api.settings.addButton("powercord-general", "Général", async (button) => {
      let panel = document.createElement("div");

      let title = document.createElement('h1');
      title.id = "title";
      title.innerHTML = "Paramètre général";
      panel.appendChild(title);

      let settingsFlexContainer = document.createElement("div");
      settingsFlexContainer.classList.add("settings-flex-container");

      panel.appendChild(settingsFlexContainer);

      powerpala.api.settings.createCheckbox(settingsFlexContainer, "powerpala-transparent", "Activer la transparence", "Permet de rendre la fenêtre transparente (peut être utile pour les thèmes, nécessite un redémarrage du launcher)", powerpala.settings.get("transparent", false), () => powerpala.settings.set("transparent", true), () => powerpala.settings.set("transparent", false));
      powerpala.api.settings.createCheckbox(settingsFlexContainer, "powerpala-isdev", "Activer le mode développeur","Permet de:<br> - Désactiver les mises à jour automatique<br> - Avoir les arguments java dans les logs lors du démarrage du jeu<br> - Redémarrer le Paladium Launcher avec " + (process.platform == "darwin" ? "⌘+Shift+R" : "Ctrl+Shift+R"), powerpala.settings.get("isdev", false), () => powerpala.settings.set("isdev", true), () => powerpala.settings.set("isdev", false));
      if(process.platform != "darwin") powerpala.api.settings.createCheckbox(settingsFlexContainer, "powerpala-multiinstance", "Activer le multi-instance", "Permet de lancer plusieurs instances du Paladium Launcher", powerpala.settings.get("multiinstance", false), () => powerpala.settings.set("multiinstance", true), () => powerpala.settings.set("multiinstance", false));

      powerpala.api.settings.updatePanel(button, panel);
    });

    powerpala.api.settings.addButton("powercord-plugins", "Plugins", async (button) => {
      let panel = document.createElement("div");

      let title = document.createElement('h1');
      title.id = "title";
      title.innerHTML = "Plugins";
      panel.appendChild(title);

      let input = document.createElement('input');
      input.type = "button";
      input.value = "Ouvrir le dossier";
      input.id = "openFolder"
      input.classList.add("button");
      input.setAttribute("onclick", "powerpala.pluginManager.openPluginsFolder()");
      panel.appendChild(input);

      let settingsFlexContainer = document.createElement("div");
      settingsFlexContainer.classList.add("settings-flex-container");

      panel.appendChild(settingsFlexContainer);

      for(let pluginID of powerpala.pluginManager.getPlugins()){
        let plugin = powerpala.pluginManager.plugins.get(pluginID);

        powerpala.api.settings.createCheckbox(settingsFlexContainer, "powerpala-"+pluginID, plugin.manifest.name, `${plugin.manifest.description}<br><br>Autheur: ${plugin.manifest.author}<br>Version: ${plugin.manifest.version}<br>Licence: ${plugin.manifest.license}`, powerpala.pluginManager.isEnabled(pluginID), () => powerpala.pluginManager.enable(pluginID), () => powerpala.pluginManager.disable(pluginID));
      }

      powerpala.api.settings.updatePanel(button, panel);
    });
  }

  async _fixMacOSErrors(){
    //Fix "loggerAutoUpdater is not defined" error
    window.loggerAutoUpdater = {
      log: () => {}
    };

    //Fix "Mémoire insuffisante" problem (i experienced that, so just for sure)
    let bakFreemem = os.freemem;
    os.freemem = () => {
      try {
        let out = execSync("sysctl -n hw.physmem").toString().split("\n");
        if(out[0] == void 0 || out[0] === "" || (out = parseInt(out[0])) == NaN) return bakFreemem();
        return out;
      } catch(e) {
        return bakFreemem();
      }
    }

    //Remove Twitch packages
    let getSelectedAccountBak = ConfigManager.getSelectedAccount;
    ConfigManager.getSelectedAccount = () => {
      try {
        if(versionData.libraries && versionData.libraries instanceof Array){
          versionData.libraries = versionData.libraries.filter(lib => !lib.name.startsWith("tv.twitch"));
        }
      } catch(e) {}
      return getSelectedAccountBak();
    }
  }
}

class Settings {
  config = {};

  constructor(){
    if(!fs.existsSync(join(__dirname, "config.json"))) fs.writeFileSync(join(__dirname, "config.json"), "{}", "utf8");
    this.config = require(join(__dirname, "config.json"));
  }

  get (key, defval) {
    if(this.config[key]) return this.config[key];
    return defval;
  }

  set (key, value) {
    this.config[key] = value;
    fs.writeFileSync(join(__dirname, "config.json"), JSON.stringify(this.config, null, 2), "utf8");
  }
}
