<script>
  import LogoAnimation from "../images/LogoAnimation.svelte";

  let showButtons = false;

  let button1 = {
    value: "",
    callback: null
  }

  let button2 = {
    value: "",
    callback: null
  }

  function b1CB(){ if(button1.callback) button1.callback() }
  function b2CB(){ if(button2.callback) button2.callback() }

  let message = "Vérification d'une maintenance";

  (async () => {
    let maintenance = await window.electron.getIsUnderMaintenance();

    function update(){
      showButtons = false;
      message = "Vérification d'une mise à jour du launcher";
      window.electron.onUpdateAvailable(() => {
        message = "Une mise à jour est disponible !\nCependant powerpala peu dysfonctionner après celle-ci";
        button1.value = "Faire la mise à jour";
        button1.callback = () => {
          showButtons = false;
          message = "Téléchargement de la mise à jour";
        }
        button2.value = "Continuer";
        button2.callback = () => {
          showButtons = false;
          message = "Démarrage du launcher";
          window.electron._startLauncher();
        };
        showButtons = true;
      });
      window.electron._onLauncherStart(() => {
        message = "Démarrage du launcher";
      });
      window.electron.checkForUpdates();
    }

    if(maintenance){
      message = "Une maintenance est en cours\nMais vous pouvez continuer tout de même";
      button1.value = "Quitter";
      button1.callback = window.electron.closeWindow;
      button2.value = "Continuer";
      button2.callback = update;
      showButtons = true;
    } else update();
  })();
</script>

<div class="splash">
  <LogoAnimation />
  <div class=message>{message}</div>
  <div style="visibility: {showButtons ? "visible" : "hidden"};">
    <input type="button" value={button1.value} on:click={b1CB} />
    <input type="button" value={button2.value} on:click={b2CB} />
  </div>
</div>

<style lang="scss">
  .splash {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;

    :global(svg.logo-animation){
      width: 125px;
      height: 125px;
      fill: #fff;
      margin-bottom: 30px;
    }

    .message {
      font-weight: bold;
      font-size: 1.3em;
      line-height: 30px;
      text-align: center;
      white-space: pre;
      height: 37px;

      margin-bottom: 35px;
    }

    input {
      cursor: pointer;
      font-size: 1.1em;

      background-color: #fff;
      border: 1px solid #212121;
      border-radius: 6px;
      color: #303030;
      padding: 9px 12px;
    }
  }
</style>
