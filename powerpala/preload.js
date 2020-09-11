(async () => {
  const Module = require("module");
  const { join } = require("path");
  const fs = require("fs");
  const paladiumPath = join(__dirname, "..", "..", "app.asar");
  const { remote: { app: { getPath } } } = require("electron");
  const crypto = require("crypto");

  Module.Module.globalPaths.push(join(__dirname, 'fake_node_modules'));
  Module.Module.globalPaths.push(join(paladiumPath, 'node_modules'));

  const request = require("request");

  request({url: "https://raw.githubusercontent.com/Pharuxtan/powerpala/master/package.json", json: true}, (e, r, d) => {
    if(e) return;
    let version = parseInt(d.version.split(".").join(""));
    let pversion = parseInt(JSON.parse(fs.readFileSync(join(__dirname, "..", "package.json"), "utf8")).version.split(".").join(""));
    if(pversion < version){
      request({url: "https://api.github.com/repos/Pharuxtan/powerpala/branches", json: true, headers: {"User-Agent": "powerpala/1.0"}}, (e, r, d) => {
        if(e) return;
        let sha = d[0].commit.sha;
        request({url: `https://api.github.com/repos/Pharuxtan/powerpala/git/trees/${sha}?recursive=true`, json: true, headers: {"User-Agent": "powerpala/1.0"}}, (e, r, d) => {
          if(e) return;
          let tree = d.tree;
          let path = join(__dirname, "..") + "/";
          for(let file of tree){
            if(fs.existsSync(path + file.path)){
              if(file.type == "tree") continue
              let filesha = crypto.createHash('sha1').update(fs.readFileSync(path + file.path)).digest("hex");
              if(filesha != file.sha){
                let download = `https://raw.githubusercontent.com/Pharuxtan/powerpala/master/${file.path}`;
                request(`https://raw.githubusercontent.com/Pharuxtan/powerpala/master/${file.path}`, (e, r, d) => {
                  if(e) return;
                  fs.writeFileSync(path, path + file.path, "utf8");
                });
              }
            } else {
              if(file.type == "tree"){
                fs.mkdirSync(path + file.path);
                continue;
              };
              let download = `https://raw.githubusercontent.com/Pharuxtan/powerpala/master/${file.path}`;
              request(`https://raw.githubusercontent.com/Pharuxtan/powerpala/master/${file.path}`, (e, r, d) => {
                if(e) return;
                fs.writeFileSync(path, path + file.path, "utf8");
              });
            }
          }
        });
      });
    }
  });

  const Powerpala = require(join(__dirname, "powerpala"));

  const config = (fs.existsSync(join(getPath('userData'), "powerpala", "config.json"))) ? require(join(getPath('userData'), "powerpala", "config.json")) : {};

  if(config.isdev){
    require(join(paladiumPath, "app", "assets", "js", "isdev"));
    require.cache[require.resolve(join(paladiumPath, "app", "assets", "js", "isdev"))].exports = true;
  }

  let jsPath = join(paladiumPath, "app", "assets", "js");

  //Fix the smaller 'err' not defined stupid error
  const ConfigManager = require(join(jsPath, 'config_manager'));
  const Mojang = require(join(jsPath, 'mojang'));
  const logger = require(join(jsPath, 'logger_util'))('auth');
  require(join(jsPath, "auth_manager.js"));
  require.cache[require.resolve(join(jsPath, "auth_manager.js"))].exports.validateSelected = async () => {
    const current = ConfigManager.getSelectedAccount();
    const isValid = await Mojang.validate(current.accessToken, ConfigManager.getClientToken());
    if (!isValid) {
      try {
        const session = await Mojang.refresh(current.accessToken, ConfigManager.getClientToken());
        ConfigManager.updateAuthAccount(current.uuid, session.accessToken);
        ConfigManager.save();
      } catch (err) {
        logger.debug("Error while validating selected profile: " + err);
        logger.log("Account access token is invalid.");
        return false;
      }
      logger.log("Mojang account access token validated.");
      return true;
    } else {
      logger.log("Mojang account access token validated.");
      return true;
    }
  }

  require.cache[require.resolve("jquery")] = {exports: jQuery};
  require.cache[require.resolve("systeminformation")] = {exports: {graphics: (data) => {data({controllers:[{model: "HD Graphics"}]})}}};

  new Powerpala();

  Module._load(join(paladiumPath, "app", "assets", "js", "preloader.js"), null, true);

  function jQuery(selector){
    if(selector instanceof Function) return document.addEventListener("DOMContentLoaded", selector);
    if(selector instanceof HTMLElement || selector instanceof Document) return initjQueryFunctions(selector);
    if(typeof selector == "string") return initjQueryFunctions(document.querySelector(selector));
  }

  function initjQueryFunctions(element){
    if(element == null) element = {addEventListener: () => {}};
    if(element instanceof Document){
      element.on = (eventName, elementSelector, handler) => {
        element.addEventListener(eventName, function(e) {
          for (var target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches(elementSelector)) {
              handler.call(target, e);
              break;
            }
          }
        }, false);
      }
    } else {
      element.on = (eventName, eventHandler) => {element.addEventListener(eventName, eventHandler)};
    }
    element.click = handler => {
      if(element.id == "launcher-home-play-button") handler = function () { gameUpdate() };
      if(element.id == "settings-user-logout-button") {
        let interval;
        interval = setInterval(() => {
          if(window.powerpala && window.powerpala.api && window.powerpala.api.events){
            handler = powerpala.api.events._callFunc("logout", handler);
            element.addEventListener("click", handler);
            clearInterval(interval);
          }
        }, 100);
      } else element.addEventListener("click", handler);
    }
    element.html = text => {
      element.innerHTML = text;
    }
    element.fadeOut = milli => {
      let ms = milli, interval;
      if(element.fadeOutinterval) return;
      element.fadeOutinterval = setInterval(() => {
        ms -= 25;
        element.style.opacity = ms/milli;
        if(ms <= 0){
          element.setAttribute("style", "display: none");
          clearInterval(element.fadeOutinterval);
          delete element.fadeOutinterval;
        }
      }, 25);
    }
    element.fadeIn = milli => {
      let ms = 0, interval;
      if(element.fadeIninterval) return;
      element.fadeIninterval = setInterval(() => {
        if(ms == 0) element.setAttribute("style", "");
        ms += 25;
        element.style.opacity = ms/milli;
        if(ms >= milli){
          element.setAttribute("style", "");
          clearInterval(element.fadeIninterval);
          delete element.fadeIninterval;
        }
      }, 25);
    }
    element.show = () => {
      if(element.fadeIninterval){
        clearInterval(element.fadeIninterval);
        delete element.fadeIninterval;
      } else if(element.fadeOutinterval){
        clearInterval(element.fadeOutinterval);
        delete element.fadeOutinterval;
      }
      element.setAttribute("style", "display: block;");
    }
    element.hide = () => {
      if(element.fadeIninterval){
        clearInterval(element.fadeIninterval);
        delete element.fadeIninterval;
      } else if(element.fadeOutinterval){
        clearInterval(element.fadeOutinterval);
        delete element.fadeOutinterval;
      }
      element.setAttribute("style", "display: none;");
    }
    element.css = (property, value) => {
      if(property == "background-image") element.style.backgroundImage = value;
      if(typeof property == "object"){
        Object.entries(property).map(([prop, val]) => {
          element.style[prop] = val;
        });
      }
    }
    element.hasClass = className => {
      if(element.classList == undefined) return false;
      return element.classList.contains(className);
    }
    element.removeClass = className => {
      element.classList.remove(className);
      return element;
    }
    element.addClass = className => {
      element.classList.add(className);
      return element;
    }
    element.attr = element.prop = (property, value) => {
      if(value == undefined) return element[property];
      return element[property] = value;
    }
    return element;
  }
})()
