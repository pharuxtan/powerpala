const { Plugin } = require('powerpala');

module.exports = class MaintenanceBypass extends Plugin {
  constructor () {
    super();
  }

  async startPlugin(){
    powerpala.api.events.on("initLauncher", (preventDefault) => {
      preventDefault();
      console.log("dfsfdsfsd");
    });

    this.func = (title, description, buttonClose = 'Fermer', buttonAction = null, timeLeft = null, timeLeftMessage = null, preventDefault) => {
      if(title != "Maintenance du launcher !" || buttonAction != null) return;
      preventDefault();
      let timeout = (setTimeout(() => {}, 1))+3;
      setActionHandler(() => {
        DistroManager.getDistribution().maintenance.enabled = false;
        clearTimeout(timeout);
        toggleOverlay(false);
        onDistroLoad(DistroManager.getDistribution());
      });
      setOverlayContent(title, description, buttonClose, 'Continuer', timeLeft, timeLeftMessage);
      document.querySelector("#overlay-button-action").setAttribute("style", "");
    }

    powerpala.api.events.on("setOverlayContent", this.func);
  }

  async stopPlugin(){
    powerpala.api.events.off("setOverlayContent", this.func);
  }
};
