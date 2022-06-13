<script>
  function close(){
    window.electron.closeWindow();
  }

  function minimize(){
    window.electron.minimizeWindow();
  }
</script>

<div class=frame>
  {#await window.electron.isMacos}
    <div></div>
  {:then bool}
    {#if !bool}
      <div class=button on:click={minimize}></div>
      <div class=button on:click={close}></div>
    {/if}
  {/await}
</div>

<style lang="scss">
  .frame {
    position: fixed;
    top: 0px;
    z-index: 9;

    display: flex;
    justify-content: flex-end;

    width: 100%;
    height: 30px;
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: drag;

    .button {
      grid-row: 1/span 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 46px;
      height: 100%;
      cursor: pointer;
      color: #fff;
      user-select: none;
      -webkit-app-region: no-drag;
      font-family: Segoe Fluent Icons,Segoe MDL2 Assets;
      font-size: 10px;
      background-color: #ffffff00;

      transition: background-color .1s;

      &:hover {
        background-color: #ffffff50;
      }
    }
  }
</style>
