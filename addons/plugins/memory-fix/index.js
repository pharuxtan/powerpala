const { Plugin } = require("@powerpala/entities");
const { execSync } = require("child_process");
const isolation = powerpala.api.isolation;
const os = process.binding("os");

module.exports = class MemoryFix extends Plugin {
  constructor(){
    super();
  }

  async start(){
    isolation.modify(isolation.GET_TOTAL_MEM, async (cb, ...args) => {
      if(process.platform === "win32"){ // Windows
        return Math.ceil(os.getTotalMem() / 1073741824) * 1073741824;
      } else { // MacOS
        return +execSync("sysctl -n hw.memsize").toString();
      }
    });

    isolation.modify(isolation.GET_FREE_MEM, async (cb, ...args) => {
      if(process.platform === "win32"){ // Windows
        return os.getFreeMem();
      } else { // MacOS
        let totalMem = +execSync("sysctl -n hw.memsize").toString() / 1024;

        let memoryUsages = execSync("ps -caxm -orss,comm").toString().split("\n").slice(1).map(s => +s.trim().split(" ")[0]);

        let usedMemory = 0;
        for(let progMem of memoryUsages) usedMemory += progMem;

        let swapMem = execSync("sysctl -n vm.swapusage").toString();

        let swapUsedMem = parseFloat(swapMem.split("used = ")[1].split("M")[0].replace(",", ".")) * 1024;
        let swapFreeMem = parseFloat(swapMem.split("free = ")[1].split("M")[0].replace(",", ".")) * 1024;

        let freeMem = totalMem + swapUsedMem - usedMemory + swapFreeMem;

        return freeMem * 1024;
      }
    });

    await powerpala.executeInIsolation(this.getURL("isolation.js"));
  }

  async stop(){
    this.warning("This plugin need a launcher restart to be fully unload");
  }
}
