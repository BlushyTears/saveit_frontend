<script>
  import { tick } from 'svelte';
  export let showBar = false;
  export let message = "This is a notification";
  export let color = "#c22d2d";
  let sinking = false;

  async function closeBar() {
      sinking = true;
      await tick();
      setTimeout(() => {
        sinking = false;
        showBar = false;
      }, 2000); // Stops sinking and disappears after 1 second
    }
  
    $: if (showBar) {
      setTimeout(async () => {
        await tick();
        closeBar();
      }, 1);  // Start sinking immediately
    }
</script>


{#if showBar}
<div class={sinking ? 'notification-bar sinking' : 'notification-bar'} style="background-color: {color}">
<span>{message}</span>
</div>
{/if}

<style>
.notification-bar {
  position: fixed;
  top: -10px;
  left: 50%;  /* move the left edge to the center of the viewport */
  transform: translateX(-50%);  /* move it back by half its own width */
  width: 50%;
  background-color: #4CAF50;
  color: white;
  text-align: center;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 1rem;
  font-size: 1.5em;
  z-index: 1000;
  transition: top 0.1s ease-in-out; /* 1-second animation */
}

.sinking {
    top: 0.05rem;  /* Move to the bottom of the viewport */
    transition: top 0.1s ease-in;  /* 1-second sinking animation */
  }
</style>