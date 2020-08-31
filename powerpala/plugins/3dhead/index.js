const { Plugin } = require('powerpala');
const path = require('path');

module.exports = class Head3D extends Plugin {
  constructor () {
    super();
  }

  async startPlugin(){
    let script = this.script = document.createElement('script');
    script.src = path.join(__dirname, "skinview3d.bundle.js");
    document.body.appendChild(this.script);
    await new Promise(function(resolve, reject) {
      script.onload = resolve;
    });
    let self = this;
    this.CustomInitSettingsUserCompteTab = async function(preventDefault){
      preventDefault();
      if(self.skinViewer) return;
      const selectedAcc = ConfigManager.getSelectedAccount();
      document.querySelector("#settings-user-compte-displayname-label").innerHTML = selectedAcc.displayName;
      document.querySelector("#settings-user-compte-username-label").innerHTML = selectedAcc.username;
      document.querySelector("#settings-user-compte-profile").style.backgroundImage = "url('https://mc-heads.net/head/" + selectedAcc.displayName + "')";
      let skin_url = (await new Promise(function(resolve, reject) {
        request({url: `https://sessionserver.mojang.com/session/minecraft/profile/${selectedAcc.uuid}`, json: true}, function(e, r, d){resolve(JSON.parse(atob(d.properties[0].value)))});
      })).textures.SKIN.url;
      let skinViewer = new skinview3d.FXAASkinViewer(document.querySelector("#settings-user-compte-profile"), {
    		width: 100,
    		height: 100,
    		skin: skin_url,
        alpha: true
    	});
      document.querySelector("#settings-user-compte-profile").style.backgroundImage = "";
      let hides = ["leftArm", "leftLeg", "rightArm", "rightLeg", "body"];
      for(let hide of hides){
        skinViewer.playerObject.skin[hide].innerLayer.visible = false;
        skinViewer.playerObject.skin[hide].outerLayer.visible = false;
      }
      skinViewer.playerObject.position.y = -12.2;
      skinViewer.playerObject.position.z = 40;
      let rotate = skinViewer.animations.add(skinview3d.RotatingAnimation);
      rotate.speed = 0.75;
      self.skinViewer = skinViewer;
    }
    powerpala.api.events.on("initSettingsUserCompteTab", this.CustomInitSettingsUserCompteTab);
  }

  async stopPlugin(){
    const selectedAcc = ConfigManager.getSelectedAccount();
    document.querySelector("#settings-user-compte-profile").style.backgroundImage = "url('https://mc-heads.net/head/" + selectedAcc.displayName + "')";
    if(this.skinViewer) this.skinViewer.dispose();
    this.skinViewer = undefined;
    powerpala.api.events.off("initSettingsUserCompteTab", this.CustomInitSettingsUserCompteTab);
    document.body.removeChild(this.script);
  }
};
