<script>
  export let click = () => {};
  export let id = "";
  export let checked = false;
</script>

<label>
  <input type="checkbox" {id} on:click={click} {checked} />
  <span></span>
</label>

<style lang="scss">
  label {
    position: relative;
    width: 42px;
    height: 24px;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    input:checked + span {
      background-color: #ff5c00;
    }

    input:focus + span {
      box-shadow: 0 0 1px #3b3b3b;
    }

    input:checked + span:after {
      transform: translateX(18px);
    }

    span {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 24px;
      background-color: #3b3b3b;
      transition: .4s;

      &:after {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        margin: 3px;
        border-radius: 9px;
        background-color: white;
        transition: .4s;
      }
    }
  }
</style>
