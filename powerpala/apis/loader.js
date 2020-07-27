const { API } = require('powerpala');

module.exports = class LoaderAPI extends API {
  constructor(){
    super();

    this.splashes = [
      {text: "Chargement du menu de chargement", author: "Chaika9"},
      {text: "Char...ge...ment en courssssss.....", author: "Chaika9"},
      {text: "#On aime les chargements", author: "Chaika9"}
    ];

    this.matrix = [
      ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "a62102", "a62102", "a62102"],
      ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "a62102", "fa9608", "f5d44f", "a62102"],
      ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "a62102", "fa9608", "f5d44f", "fa9608", "a62102"],
      ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "a62102", "fa9608", "f5d44f", "fa9608", "a62102", "none"],
      ["none", "none", "none", "none", "080808", "none", "none", "none", "none", "a62102", "fa9608", "f5d44f", "fa9608", "a62102", "none", "none"],
      ["none", "none", "none", "080808", "080808", "none", "none", "a62102", "a62102", "fa9608", "f5d44f", "fa9608", "a62102", "none", "none", "none"],
      ["none", "none", "080808", "080808", "080808", "none", "a62102", "fa9608", "fa9608", "f5d44f", "fa9608", "a62102", "none", "none", "none", "none"],
      ["none", "none", "080808", "3b3837", "080808", "none", "a62102", "fa9608", "f5d44f", "fa9608", "a62102", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "080808", "3b3837", "a62102", "fa9608", "f5d44f", "fa9608", "fa9608", "a62102", "none", "none", "none", "none", "none"],
      ["none", "none", "080808", "3b3837", "080808", "080808", "080808", "fa9608", "a62102", "a62102", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "080808", "3b3837", "080808", "6b6767", "080808", "a62102", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "080808", "6b6767", "080808", "080808", "3b3837", "080808", "080808", "080808", "080808", "none", "none", "none", "none"],
      ["none", "none", "3b3837", "6b6767", "080808", "3b3837", "3b3837", "080808", "3b3837", "080808", "080808", "none", "none", "none", "none", "none"],
      ["080808", "080808", "6b6767", "3b3837", "none", "080808", "080808", "none", "080808", "080808", "none", "none", "none", "none", "none", "none"],
      ["080808", "ff0600", "080808", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"],
      ["080808", "080808", "080808", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"]
    ]

    showLoading = () => {
      var splash = this.splashes[Math.floor(Math.random() * this.splashes.length)];
      document.querySelector("#loading-splash-text").innerHTML = splash.text;
      document.querySelector("#loading-sudmitted-author").innerHTML = "@"+splash.author;

      let matrix = splash.matrix ? splash.matrix : this.matrix;

      document.querySelector('.paladium-loader').style.display = "block";
      for (let i = 0; i < 16; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.id = "line-"+i;
        document.querySelector(".paladium-loader").appendChild(line);
        for (let j = 0; j < 16; j ++) {
          let type = matrix[i][j];
          let random = Math.floor((Math.random() * 5));
          let square = document.createElement("div");
          square.classList.add("square", "square-"+random);
          square.setAttribute("data-color", type);
          square.id = `line-${i+1}-col-${j+1}`;
          line.appendChild(square);
        }
      }
      document.querySelectorAll(".square").forEach((el) => {
        let color = el.getAttribute("data-color");
        if(color != "none"){
          //added support of rgb/rgba
          if((color.startsWith("rgba(") || color.startsWith("rgb(")) && color.endsWith(")")){
            let rgb = color.replace(/(rgb)[a(]\(/g, "").replace(")", "").split(",").map(v => Number(v.trim()).toString(16));
            color = "#";
            color += (rgb[0].length == 1 ? "0" : "")+rgb[0];
            color += (rgb[1].length == 1 ? "0" : "")+rgb[1];
            color += (rgb[2].length == 1 ? "0" : "")+rgb[2];
            if(rgb[3] != undefined) color += (rgb[3].length == 1 ? "0" : "")+rgb[3];
          }
          // default
          el.style.backgroundColor = (!color.startsWith("#") ? "#" : "") + color;
        }
      });
      $('#loading-view').fadeIn(500);
    }
    showLoading.bind(this);

    showLoading = powerpala.api.events._callFunc("showLoading", showLoading);
  }

  addSplash(text, author, matrix){
    this.splashes.push({text, author, matrix});
  }
}
