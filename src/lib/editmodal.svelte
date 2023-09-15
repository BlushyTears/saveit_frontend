<script>
    import { inputTextList, buttonNames } from '../lib/builderstore'; // Add this import
    export let showModal = false;
    export let index; // Add this prop to know which element to update
  
    let dialog;
    let dragging = false;

    export let inputText = "Enter content here";
    
    $: if (dialog && showModal) dialog.showModal();
    
    let previewModal = false;
    
    function displayPreview() {
      previewModal = !previewModal;
    }

    function saveContentChanges() {
      inputTextList.update(arr => {
        arr[index] = inputText;
        return [...arr];
      });
      console.log('Content Saved', $inputTextList);
      dialog.close();
    }
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
        class="close-modal-btn"
        on:click={() => dialog.close()}
      >
        X
      </button>
      <div
        style="font-size: 1.5em; width: calc(10vw + 10rem);"
      >

      <h3 style="margin: 0;" contenteditable="true" bind:innerText={$buttonNames[index]}>Button Title</h3>

      </div>
      <br />
      <div style="justify-content: space-between; display: flex;">
        <div style="margin: 0;">
          <button >B</button>
          <button >I</button>
          <button >U</button>
        </div>
      </div>
      <hr />
      <div>
        <div class="slot-wrapper" contenteditable="true">
          <slot name="header" />
          <div>
            <textarea class="input-modal-textarea" style="width: 100%;" bind:value={inputText} />
          </div>
          <slot />
        </div>
        <hr />
        <button class="preview-btn" on:click={() => displayPreview()}>Preview ↓</button>
        <button class="save-edits-btn" on:click={() => saveContentChanges()}>Save ✉</button>
        <br />
      </div>
      
      <div class="preview-modal">
        {#if previewModal}
        <hr />
        <div>
          <!-- Replaces newline characters with <br> tags -->
          <p>{@html inputText.split('\n').join('<br>')}</p>
        </div>
        {/if}
      </div>
</dialog>

<style>
  .input-modal-textarea {
    width: 100%;
    height: 200px;   
    border: none;
    background-color: #ffffff;
    padding: 10px;  
  }

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

  .preview-btn {
    padding: 0.6rem;
    font-size: 1.3em;
    border: none;
    border-radius: 1rem;
    background-color: #d69d32;
    transition: 0.05s ease-in-out;
    border-bottom: 1px solid rgb(148, 92, 7); /* 2px width, solid style, red color */
    border-right: 1px solid rgb(148, 92, 7);
  }

  .preview-btn:hover {
    background-color: #f1aa25;
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


