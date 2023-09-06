<script>
  export let showModal; // boolean

  let dialog; // HTMLDialogElement

  $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <button class="close-modal-btn" on:click={() => dialog.close()}>X</button>
    <br />
    <br />
    <slot name="header" />
    <hr />
    <slot />
    <hr />
  </div>
</dialog>

<style>
  dialog {
    margin-top: 8%;
    width: 80%;
    border-radius: 1rem;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .close-modal-btn {
    border-radius: 50%;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    padding: 0.8rem;
    border: none;
    background: none;
    display: block;
    float: right;
    margin: 0;
    transition: 0.1s ease-in-out;
  }

  .close-modal-btn:hover {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.18);
  }
</style>
