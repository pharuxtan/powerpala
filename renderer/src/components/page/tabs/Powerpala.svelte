<script>
  import Switch from "./util/Switch.svelte"

  let products = [
    {
      title: "Activer la transparence",
      id: "transparent",
      description: "Permet de rendre la fenêtre transparente (peut être utile pour les thèmes, nécessite un redémarrage du launcher)",
      default: false,
      click: function(){ window.powerpala("settings.set")("transparent", this.checked) }
    },
    {
      title: "Activer le multi-instance",
      id: "multi",
      description: "Permet de lancer plusieurs instances du Paladium Launcher, à noter que le multi instances n'est pas possible pour le launcher macOS",
      default: false,
      click: function(){ window.powerpala("settings.set")("multi", this.checked) }
    },
    {
      title: "Enlever Minecraft Vanilla",
      id: "removemc",
      description: "Enleve la page de minecraft vanilla",
      default: true,
      click: function(){
        window.powerpala("settings.set")("removemc", this.checked);
        if(this.checked) document.body.classList.add("removemc");
        else document.body.classList.remove("removemc");
      }
    }
  ]
</script>

<div class="products">
  {#each products as product (product.id)}
    <div class="product">
      <div class="header">
        <div class="title">{product.title}</div>
        <Switch id={product.id} click={product.click} checked={window.powerpala("settings.get")(product.id, product.default)} />
      </div>
      <div class="divider"></div>
      <div class="description">{product.description}</div>
    </div>
  {/each}
</div>

<style lang="scss">
  .product {
    position: relative;
    border-radius: 5px;
    border: 1px solid #202225;
    background-color: #282b3e;
    padding: 20px;
    margin: 10px 20px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .title {
        font-size: 1em;
      }
    }

    .divider {
      margin: 20px 0px;
      border-bottom: 1px solid rgba(65,68,74,.6);
    }

    .description {
      font-size: 0.8em;
      white-space: pre-wrap;
      line-height: 16px;
    }
  }
</style>
