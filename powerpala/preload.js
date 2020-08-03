(() => {
  const Module = require("module");
  const { join } = require("path");
  const fs = require("fs");
  const paladiumPath = join(__dirname, "..", "..", "app.asar");

  Module.Module.globalPaths.push(join(__dirname, 'fake_node_modules'));
  Module.Module.globalPaths.push(join(paladiumPath, 'node_modules'));

  const Powerpala = require(join(__dirname, "powerpala"));

  const config = (fs.existsSync(join(__dirname, "config.json"))) ? require(join(__dirname, "config.json")) : {};

  if(config.isdev){
    require(join(paladiumPath, "app", "assets", "js", "isdev"));
    require.cache[require.resolve(join(paladiumPath, "app", "assets", "js", "isdev"))].exports = true;
  }

  require.cache[require.resolve("jquery")] = {exports: jQuery};

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
      element.addEventListener("click", handler);
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
