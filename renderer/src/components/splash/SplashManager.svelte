<script>
  import { slideSideOut, slideSideIn } from "../transitions.js";
  let fromInit = localStorage.getItem("first") == "true";

  function slideIn(..._){
    let slide = slideSideIn();
    if(fromInit) slide.duration = 0;
    return slide;
  }

  import Welcome from "./Welcome.svelte";
  import Splash from "./Splash.svelte";

  $: state = localStorage.getItem("first") == "true" ? "splash" : "welcome";
</script>

{#if state == "welcome"}
  <div class=transition out:slideSideOut>
    <Welcome bind:state={state} />
  </div>
{:else}
  <div class=transition in:slideIn>
    <Splash bind:state={state} />
  </div>
{/if}

<style lang="scss">
  .transition {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
</style>
