<script>
	import { fade } from 'svelte/transition';
	import Powerpala from "./tabs/Powerpala.svelte";
	import Plugins from "./tabs/Plugins.svelte";
	import Themes from "./tabs/Themes.svelte";

  let tab = "powerpala"

  let tabs = {
    powerpala: Powerpala,
    plugins: Plugins,
    themes: Themes
  }
</script>

<div class=page>
  <div class=tabs>
    <input type=button class=tab class:active={tab == "powerpala"} on:click={() => tab = "powerpala"} value="Powerpala" />
    <input type=button class=tab class:active={tab == "plugins"} on:click={() => tab = "plugins"} value="Plugins" />
    <input type=button class=tab class:active={tab == "themes"} on:click={() => tab = "themes"} value="Themes" />
  </div>
  <div class=content>
    {#key tab}
      <div class=transition transition:fade={{ duration: 200 }}>
        <svelte:component this={tabs[tab]} />
      </div>
    {/key}
  </div>
</div>

<style lang="scss">
  .page {
    position: relative;
    top: 0px;
    left: 130px;
    width: calc(100% - 130px);
    height: 100%;

    .tabs {
      position: absolute;
      top: 0px;
      left: 0px;
      width: calc(100% - 138px);
      height: 30px;

      body.macos & {
        width: 100%;
      }

      display: flex;
      justify-content: space-between;

      .tab {
        width: -webkit-fill-available;
        height: 30px;
        padding: 0px;

        transition: background-color .2s, border-left .2s, border-right .2s, border-top .2s;

        $border: 1px solid #14161f;
        border-left: $border;
        border-right: $border;
        border-top: $border;
        background-color: #161822;

        border-radius: 10px 10px 0px 0px;
        border-bottom: none;
        outline: none;

        color: #fff;
        font-size: 1em;
        font-weight: 500;

        cursor: pointer;

        &:first-child {
          border-left: none !important;
        }

        &:last-child {
          border-right: none !important;
        }

        &.active {
          $border: 1px solid #191a26;
          border-left: $border;
          border-right: $border;
          border-top: $border;

          background-color: #212333;

          &:hover {
            background-color: #212333;
          }
        }

        &:hover {
          background-color: #1c1e2b;
        }
      }
    }

    .content {
      position: absolute;
      top: 30px;
      left: 0px;
      width: 100%;
      height: calc(100% - 30px);

      background-color: #212333;

      overflow-y: overlay;

      .transition {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
