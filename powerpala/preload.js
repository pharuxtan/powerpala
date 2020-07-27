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

  new Powerpala();

  Module._load(join(paladiumPath, "app", "assets", "js", "preloader.js"), null, true);
})()
