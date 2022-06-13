<script>
	import { fly } from 'svelte/transition';
	import LogoLarge from '../images/LogoLarge.svelte';
  export let state;
  let animate = false;
  setTimeout(() => {
    animate = true;
  }, 10);
  function changeState(){
		localStorage.setItem("first", true);
    state = "splash";
  }
</script>

<div class=welcome>
  {#if animate}
    <div in:fly="{{duration: 800, y: 30, opacity: 0}}" class=logo>
      <LogoLarge />
    </div>
  {/if}
	{#if animate}
		<div in:fly="{{delay: 150, duration: 800, y: 30, opacity: 0}}">
			<div class=message>
				Bienvenue sur votre nouveau launcher !
			</div>
		</div>
	{/if}
	{#if animate}
		<div in:fly="{{delay: 300, duration: 800, y: 30, opacity: 0}}">
			<input type="button" value="Commencer" on:click={changeState} />
		</div>
	{/if}
</div>

<style lang="scss">
  .welcome {
    position: absolute;
    top: 265px;
    left: 0px;
    z-index: 1;
    width: 100%;
    height: 255px;
    -webkit-user-select: none;
    user-select: none;

		.logo {
      position: absolute;
      top: 0px;
      left: 108px;
      width: 400px;

			:global(svg){
				fill: #fff;
			}
		}

    .message {
      position: absolute;
      top: 130px;
      left: 0px;
      width: 100%;
      text-align: center;
      font-weight: bold;
      font-size: 1.2em;
    }

		input {
			position: absolute;
	    top: 180px;
	    left: 50%;
			transform: translate(-50%);
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
