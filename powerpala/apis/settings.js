const { API } = require('powerpala');

module.exports = class SettingsAPI extends API {
  #buttons;
  #checkboxs = [];

  constructor(){
    super();

    let powerpalasettings = document.createElement("div");
    powerpalasettings.className = "group";

    let title = document.createElement("p");
    title.className = "title";
    title.innerHTML = "Paramètres Powerpala";
    powerpalasettings.appendChild(title);

    this.#buttons = document.createElement("div");
    powerpalasettings.appendChild(this.#buttons);

    powerpalasettings.appendChild(document.createElement("hr"));

    let settingsTab = document.getElementsByClassName("nav-items-container")[0]
    settingsTab.insertBefore(powerpalasettings, settingsTab.children[2]);

    let powerpalapanel = document.createElement("div");
    powerpalapanel.className = "settings-container";
    powerpalapanel.id = "powerpala-panel";
    powerpalapanel.style.display = "none";

    document.getElementsByClassName("settings-panel-right")[0].appendChild(powerpalapanel);
  }

  async addButton(id, value, callback, ret=false){
    let button = document.createElement("button");
    button.className = "item settingsTab";
    button.id = id;
    button.innerHTML = value;
    button.addEventListener("click", () => callback(button));
    callback.bind(button);
    if(!ret) return this.#buttons.appendChild(button);
    return button;
  }

  async deleteButton(id){
    let button = document.querySelector("#"+id);
    button.parentElement.removeChild(button);
  }

  async updatePanel(button, element){
    let navItems = document.getElementsByClassName("selected");
    for(let item of navItems){
      if(item.classList.contains("selected")){
        item.classList.remove("selected");
        item.removeAttribute("disabled");
      }
    }

    let panels = document.getElementsByClassName("settings-panel-right")[0].children;
    for(let element of panels) element.style.display = "none";
    button.classList.add("selected");
    button.setAttribute("disabled", "");
    currentSettingsPanel = "#powerpala-panel";
    let panel = document.querySelector(currentSettingsPanel);
    panel.innerHTML = element.innerHTML;
    $(panel).fadeIn(250);
  }

  async createCheckbox(settingsFlexContainer, id, titletext, description, checked, onCheck, onUncheck){
    let container = document.createElement("div");
    container.classList.add("info-container", "fix");

    let title = document.createElement("p");
    title.classList.add("title");
    title.innerHTML = titletext;
    container.appendChild(title);

    let desc = document.createElement("p");
    desc.classList.add("desc");
    desc.innerHTML = description;
    container.appendChild(desc);

    let label = document.createElement("label");
    label.classList.add("switch");
    container.appendChild(label);

    let input = document.createElement("input");
    input.type = "checkbox";
    input.id = "checkbox-"+id
    this.#checkboxs[input.id] = {onCheck, onUncheck};
    input.setAttribute("onclick", `if(this.checked){ powerpala.api.settings.callCheck(this.id) } else { powerpala.api.settings.callUncheck(this.id) }`);
    input.defaultChecked = checked;
    label.appendChild(input);

    let span = document.createElement("span");
    span.classList.add("slider");
    label.appendChild(span);

    onCheck.bind(input);
    onUncheck.bind(input);

    settingsFlexContainer.appendChild(container);

    return container;
  }

  callCheck(id){ this.#checkboxs[id].onCheck() }
  callUncheck(id){ this.#checkboxs[id].onUncheck() }
}
