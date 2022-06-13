<script>
  import { fade } from "svelte/transition";
  import { slideUpIn, slideUpOut, slideDownIn, slideDownOut } from "./transitions.js";
  import Frame from "./Frame.svelte";
  import Splash from "./splash/SplashManager.svelte";
  import Page from "./page/Page.svelte";

  let message = "Initialisation...";

  let init = true;
  let splash = false;
  function mount() {
    init = splash = false;
    powerpala.native.mount();
  }
  
  let page = false;

  PowerpalaNatives.on("powerpalaComponent", (b) => {
    if (b) document.querySelector("#titlebar").classList.add("powerpala");
    else document.querySelector("#titlebar").classList.remove("powerpala");
    page = b;
  });

  (async () => {
    let Powerpala = (await PowerpalaNatives.powerpala).default;
    delete PowerpalaNatives.powerpala;
    window.powerpala = new Powerpala();

    powerpala.on("initiated", () => {
      message = "Démarrage des modules...";
      powerpala.start();
    });

    powerpala.on("ready", () => {
      message = "Prêt";
      if (window.location.href.endsWith("#/splash")) {
        init = false;
        splash = true;
      } else {
        mount();
      }
    });

    powerpala.initialize();

    if (await window.electron.isMacos()) document.body.classList.add("macos");
  })();
</script>

<div class=powerpala style="pointer-events: {init || splash || page ? "all" : "none"};">
	{#if init || splash}
		<Frame/>
	{/if}

  {#if init}
    <div transition:fade={{ duration: 100 }} class=init>
      <img alt=init src="powerpala://assets/images/logo-animated.svg" />
      <div class=text>{message}</div>
    </div>
  {/if}

	{#if splash}
		<div transition:fade={{ duration: 100 }}>
			<Splash />
		</div>
	{/if}

  {#if page}
		<div class="drag"></div>
    <div in:slideDownIn={{ duration: 1200 }} out:slideUpOut={{ duration: 1200 }} class=page>
      <Page />
    </div>
  {/if}
</div>

<style lang="scss">
	:global(body, #game-page){
		background-color: #12131b !important;
	}

	:global(.tabs-header .tab:nth-last-child(2)){
		display: none !important;
	}

	:global(div#titlebar.powerpala){
		width: 138px !important;
		right: 0px !important;
	}

	:global(div#titlebar .button){
		transition: background-color .1s;
	}

	:global(div#titlebar .button:hover){
		background-color: #ffffff30;
	}

	:global(body.removemc a.navigation-item[title=Minecraft]){
		display: none;
	}

  .powerpala {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;

    * {font-family: "Inter" }
  }

	.drag {
		height: 30px;
		top: 0;
		width: 130px;
		position: fixed;
		z-index: 9;
		-webkit-app-region: drag;
	}

	.page {
		position: fixed;
		top: 0px;
		left: 0px;
    width: 100vw;
    height: 100vh;
	}

  .init {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;

    img {
      width: 125px;
      height: 125px;
      fill: #fff;

      margin-bottom: 25px;
    }

    .text {
      font-weight: bold;
      font-size: 1.2em;

      margin-bottom: 20px;
    }
  }
</style>
