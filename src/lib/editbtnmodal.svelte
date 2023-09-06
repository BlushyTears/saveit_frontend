<script>
  export let showModal = false;

  let dialog;
  let dragging = false;

  let btnText = "Button Title";

  $: if (dialog && showModal) dialog.showModal();

</script>

<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:mousedown={() => (dragging = true)}
  on:mouseup={() => {
    if (dragging) {
      dialog.close();
    }
    dragging = false;
  }}
  on:keydown={(e) => {
    if (e.key === "Escape") {
      dialog.close();
    }
  }}
>
  <div
    on:click|stopPropagation
    on:mousedown|stopPropagation={() => (dragging = false)}
    on:mouseup|stopPropagation={() => (dragging = false)}
    on:keydown|stopPropagation
  >
    <div on:click|stopPropagation on:keydown|stopPropagation>
      <button
        style="margin: 0;"
        class="close-modal-btn"
        on:click={() => dialog.close()}
      >
        X
      </button>
      <div style="width: calc(25% + 5rem); margin-left: 5%;">
        <button class="focused-btn">
          <h2 class="modal-btn-text">{btnText}</h2>
        </button>
      </div>
      <br />
      <button style="margin-bottom: 1rem;" class="save-edits-btn"
        >Save changes ✉</button
      >
      <div>
        <div class="slot-wrapper" contenteditable="true" />
      </div>
    </div>
  </div>
</dialog>

<style>

  dialog {
    margin-top: 8%;
    width: 40%;
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
    padding: 0.5rem;
    display: block;
    float: right;
  }

  .focused-btn {
    border: none;
    font-family: "Roboto Condensed", sans-serif;
    background-color: rgb(12, 218, 22);
    border-bottom: 2px solid rgb(7, 148, 14); /* 2px width, solid style, red color */
    border-right: 2px solid rgb(7, 148, 14);
    color: rgb(255, 255, 255);
    cursor: pointer;
    border-radius: 3rem;
    margin-top: 1rem;
    width: 100%;
    font-size: calc(0.8em + 0.4vw);
  }

  .focused-btn:hover {
    background-color: rgb(13, 201, 22);
    transition: 0.1s ease-in-out;
  }

  .save-edits-btn {
    float: right;
    padding: 0.6rem;
    font-size: 1.3em;
    border: none;
    border-radius: 1rem;
    background-color: #d69d32;
    transition: 0.05s ease-in-out;
    border-bottom: 1px solid rgb(148, 92, 7); /* 2px width, solid style, red color */
    border-right: 1px solid rgb(148, 92, 7);
  }

  .save-edits-btn:hover {
    background-color: #f1aa25;
  }
</style>
