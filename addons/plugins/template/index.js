const { Plugin } = require("@powerpala/entities");

module.exports = class TemplatePlugin extends Plugin {
  constructor(){
    super();
  }

  async start(){
    console.log("Hello World!")
  }

  async stop(){

  }
}
