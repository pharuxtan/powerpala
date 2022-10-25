<script>
  import Switch from "./util/Switch.svelte";

  let products = [];

  for(let { isolationInfo } of window.preload("powerpala.manager.plugins.getPlugins")().map(p => window.preload("powerpala.manager.plugins.get")(p))){
    products.push({
      title: isolationInfo.manifest.name,
      id: isolationInfo.pluginID,
      author: isolationInfo.manifest.author,
      version: isolationInfo.manifest.version,
      description: isolationInfo.manifest.description,
      checked: window.preload("powerpala.manager.plugins.isEnabled")(isolationInfo.pluginID)
    });
  }

  function checkClick(event){
    if(this.checked){
      window.preload("powerpala.manager.plugins.enable")(this.id);
    } else {
      window.preload("powerpala.manager.plugins.disable")(this.id);
    }
  }

  function reload(){
    window.preload("powerpala.manager.plugins.reloadAll")();
  }
</script>

<div class="products">
  {#each products as product (product.id)}
    <div class="product">
      <div class="header">
        <div class="title">{product.title}</div>
        <Switch id={product.id} click={checkClick} checked={product.checked} />
      </div>
      <div class="divider"></div>
      <div class="description">{product.description}</div>
      <div class="metadata">
        <div class="author">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>{product.author}</span>
        </div>
        <div class="version">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M21.707 13.293l-11-11C10.519 2.105 10.266 2 10 2H3c-.553 0-1 .447-1 1v7c0 .266.105.519.293.707l11 11c.195.195.451.293.707.293s.512-.098.707-.293l7-7c.391-.391.391-1.023 0-1.414zM7 9c-1.106 0-2-.896-2-2 0-1.106.894-2 2-2 1.104 0 2 .894 2 2 0 1.104-.896 2-2 2z" />
          </svg>
          <span>{product.version}</span>
        </div>
      </div>
    </div>
  {/each}
</div>
<input class="reload" type="button" value="Recharger les plugins" on:click={reload} />

<style lang="scss">
  .products {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow-y: overlay;

    &::-webkit-scrollbar {
      display: none;
    }
  }

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
      margin-bottom: 10px;
      white-space: pre-wrap;
      line-height: 16px;
    }

    .metadata {
      width: 100%;
      display: flex;
      justify-content: space-between;

      div {
        display: flex;
        align-items: center;
      }

      span {
        margin-left: 5px;
        font-size: 0.8em;
      }
    }
  }

  .reload {
    position: absolute;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
  }
</style>
