/* Powerpala Functions */

// Get components
let components = {};

let _defineComponent = {defineComponent};
{defineComponent} = function defineComponent(options){
  let component = _defineComponent(options);
  components[component.name] = component;
  return component;
}

// Emit cache data

let weakMapSetFuncs = [];

window.onWeakMapSet = function (cb){
  if(typeof cb !== "function") return;
  weakMapSetFuncs.push(cb);
}

window.offWeakMapSet = function (cb){
  if(weakMapSetFuncs.indexOf(cb) === -1) return;
  weakMapSetFuncs.splice(weakMapSetFuncs.indexOf(cb), 1);
}

WeakMap = class WeakMap extends window.WeakMap {
  constructor() { super() }

  set(key, value){
    for(let func of weakMapSetFuncs) func(key, value);
    super.set(key, value);
  }
}

// Replace resolveDynamicComponent to add powerpala icon component

let _resolveDynamicComponent = {resolveDynamicComponent};
{resolveDynamicComponent} = function resolveDynamicComponent(component){
  if(component == "PowerpalaIcon"){
    return {
      name: "PowerpalaIcon",
      render(){
        return {
          type: "svg",
          props: {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 44 44",
            width: "37.498",
            height: "37.498"
          },
          children: [{
            type: "g",
            props: { transform: "translate(3)" },
            children: [{
              type: "path",
              props: { d: "m0 3 13 13q0-10 9-13z" },
              children: [],
              shapeFlag: 17
            }, {
              type: "g",
              props: { transform: "translate(6)" },
              children: [{
                type: "path",
                props: { d: "m13.7883 0c-.5299 0-.9564.4266-.9564.9564l0 2.4309c-1.2371.3071-2.4279.8014-3.5467 1.4745l-1.7136-1.7136c-.5716 2.8518-.5716 2.8518-1.3549 0l-3.1083 3.1083c-.3747.3747-.3747.9803 0 1.3549l1.7136 1.7136c-.6678 1.1155-1.1308 2.3198-1.4346 3.5467l-2.4309 0c-.5299 0-.9564.4266-.9564.9564l0 4.3836c0 .5299.4266.9564.9564.9564l2.391 0c.3071 1.2383.8009 2.427 1.4745 3.5467l-1.7136 1.7136c-.3747.3747-.3747.9803 0 1.3549l3.1083 3.1083c.3747.3747.9803.3747 1.3549 0l1.7136-1.7136c1.1237.6777 2.3093 1.1274 3.5467 1.4346l0 2.4309c0 .5299.4266.9564.9564.9564l4.3836 0c.5298 0 .9564-.4266.9564-.9564l0-2.4309c1.24-.3056 2.4252-.7618 3.5467-1.4346l1.7136 1.7136c.3747.3747.9803.3747 1.3549 0l3.1083-3.1083c.3747-.3747.3747-.9803 0-1.3549l-1.7136-1.7136c.6745-1.1177 1.1666-2.316 1.4745-3.5467l2.4309 0c.5299 0 .9564-.4266.9564-.9564l0-4.3836c0-.5299-.4266-.9564-.9564-.9564l-2.4309 0c-.3053-1.2297-.8077-2.4337-1.4745-3.5467l1.7136-1.7136c.3747-.3747.3747-.9803 0-1.3549l-3.1083-3.1083c-.3747-.3747-.9803-.3747-1.3549 0l-1.7136 1.7136c-1.1198-.6722-2.3144-1.1695-3.5467-1.4745l0-2.4309c0-.5299-.4266-.9564-.9564-.9564l-4.3836 0zm2.0324 9.9626c1.5496-.0411 3.13.4829 4.3437 1.6339 2.4274 2.3019 2.541 6.1404.2391 8.5679-2.2962 2.4214-6.1384 2.5269-8.5679.2391-2.4274-2.3019-2.541-6.1404-.2391-8.5679 1.151-1.2137 2.6745-1.8318 4.2242-1.873z" },
                children: [],
                shapeFlag: 17
              }, {
                type: "path",
                props: { d: "m4 13 6 0 0 25-6 0z" },
                children: [],
                shapeFlag: 17
              }, {
                type: "path",
                props: { d: "m6 23 4.5 0 0 15-4.5 0z" },
                children: [],
                shapeFlag: 17
              }, {
                type: "path",
                props: { d: "m4 38 6.5 0-6.5 5.5z" },
                children: [],
                shapeFlag: 17
              }],
              shapeFlag: 17
            }],
            shapeFlag: 17
          }],
          shapeFlag: 17
        }
      }
    }
  }
  return _resolveDynamicComponent(component);
}

// Replace mount by an empty function to mount vue later
let _mount;

let _createAppAPI = {createAppAPI};
{createAppAPI} = function createAppAPI(render, hydrate){
  let _createApp2 = _createAppAPI(render, hydrate);
  let secondUse = false;
  return function createApp2(rootComponent, rootProps = null){
    let app = _createApp2.call(this, rootComponent, rootProps);
    let self = this;
    let _use = app.use;
    app.use = function use(plugin, ...options){
      if(secondUse = !secondUse) return _use.call(this, plugin, ...options);
      let app2 = _use.call(this, plugin, ...options);
      _mount = app2.mount;
      app2.mount = () => {};
      return app2;
    }
    return app;
  }
}

/* Paladium Renderer Code */
//
//

/* Powerpala Natives Export */

let router = {app}.config.globalProperties.$router;
let store = {app}.config.globalProperties.$store;

// Fix app store not loading properly because of not instant mount

let getNotifs = {app}._component.methods.getNotifs.bind({ $store: store });
getNotifs();
let notificationsInterval = setInterval(() => {
  getNotifs();
}, 300000);
window.electron.onNotifications(notifs => {
    store.commit("setNotifications", notifs);
})
window.electron.onUserDataFetch(user => {
    store.commit("setUsername", user.username);
    store.commit("setSkinUrl", user.skinUrl);
})

{app}._component.beforeMount = () => void 0;
{app}._component.beforeDestroy = () => clearInterval(notificationsInterval);

// node require declaration

const require = window.require = window.electron._require;

// Add DevTools shortcut

document.addEventListener("keypress", (event) => {
  if(event.ctrlKey && event.code == "KeyI"){
    window.electron._openDevTools();
  }
});

// Add Powerpala Side Menu

Ts.push({
  visibility: true,
  id: "powerpala",
  name: "Powerpala",
  icon: "PowerpalaIcon",
  backgroundImage: "powerpala://assets/images/transparent.png",
  logo: "powerpala://assets/images/transparent.png",
  headline: "",
  description: "",
  hideFooter: true,
  colors: {
    activeIcon: "#080808",
    activeIndicator: "#FF5C00",
    button: {
      default: "#000",
      hover: "#000",
      disabled: "#000"
    }
  }
})

// Powerpala Natives declaration

class Powerpala {
  mount(){
    _mount("#app");
    window.powerpala.app.components = components;
    this.emit("mounted", components);
    delete window.powerpala.mount;
    this.app.mounted = true;
    return components;
  }

  app = {
    context: {app}._context,
    router,
    store,
    components,
    mounted: false,

    apiModifier: window.electron._modifier,
    openDevTools: window.electron._openDevTools,
    closeDevTools: window.electron._closeDevTools
  };

  // Event Emitter

  #events = {}

  on(name, func){
    if(!this.#events[name]) this.#events[name] = [];
    this.#events[name].push(func);
  }

  off(name, func){
    if(!this.#events[name] || this.#events[name].indexOf(func) == -1) return;
    this.#events[name].splice(this.#events[name].indexOf(func), 1);
  }

  emit(name, ...args){
    if(!this.#events[name]) return;
    for(let func of this.#events[name]){
      func(...args);
    }
  }
}

window.powerpala = new Powerpala();

// Powerpala Page Loading

let gameComponents = router.getRoutes()[2].components.default;
let gameRender = gameComponents.render;
let gameSetup = gameComponents.setup;

setInterval(() => {
  if(document.querySelector("#game-page__content .title") && document.querySelector("#game-page__content .title").innerText.toUpperCase() == "POWERPALA"){
    if(document.querySelector("#game-page").style.display != "none"){
      window.powerpala.emit("powerpalaComponent", true);
      document.querySelector("#game-page").style.display = "none";
    }
  } else if(document.querySelector("#game-page") && document.querySelector("#game-page").style.display != "flex") {
    document.querySelector("#game-page").style.display = "flex";
  }
}, 20);

gameComponents.render = function render(...args){
  if(args[2].id != "powerpala" && document.querySelector("#game-page")) {
    window.powerpala.emit("powerpalaComponent", false);
  }

  return gameRender(...args);
}
gameComponents.setup = function setup(...args){
  if(!args[0].id) args[0].id = "powerpala";
  return gameSetup(...args);
}
