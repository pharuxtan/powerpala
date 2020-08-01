const { Plugin } = require('powerpala');
const { join } = require('path');
const { remote: { getCurrentWindow } } = require('electron');

const win = getCurrentWindow();

module.exports = class DarwinFrame extends Plugin {
  constructor () {
    super();
  }

  async startPlugin(){
    if(process.platform === "darwin"){
      let frame = document.querySelector(".frame-content");
      frame.removeChild(document.querySelector(".content-darwin-button"));
      this.loadStylesheet(join(__dirname, "extend.css"));
      let extend = document.createElement("div");
      extend.classList.add("extend");
      frame.appendChild(extend);

      extend.addEventListener("click", doubleClickExtend(), false);
    }
  }

  async stopPlugin(){
    this.log("Se plugin necessite un redémarrage pour être stoppé")
  }
};

function doubleClickExtend(){
    var clicks = 0, timeout;
    return function() {
        clicks++;
        if (clicks == 1) timeout = setTimeout(function() { clicks = 0; }, 400);
        else {
            timeout && clearTimeout(timeout);
            win.maximize();
            clicks = 0;
        }
    };
}
