const { existsSync, writeFileSync, readFileSync } = require("fs");
const { join } = require("path");

module.exports = class Settings {
  config = {};

  async init(){
    this.file = join(await paladiumApi._getPowerpalaFolder(), "settings", "settings.json");
    if(!existsSync(this.file)){
      writeFileSync(this.file, "{}", "utf8");
      this.set("removemc", true);
    } else this.config = JSON.parse(readFileSync(this.file, "utf8"));
    return this;
  }

  get (key, defval) {
    if(this.config[key]) return this.config[key];
    return defval;
  }

  set (key, value) {
    this.config[key] = value;
    writeFileSync(this.file, JSON.stringify(this.config, null, 2), "utf8");
  }
}
