<script>
    import { writable } from "svelte/store";
  
    export let showModal = false;
  
    let dialog;
    let editableContent = writable("Content");
    let dragging = false;

    let inputText = "Hello, Svelte!";
    
    function applyTag(tagName, editableDivId) {
      const editableDiv = document.getElementById(editableDivId);
      editableDiv.focus();
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const tagElement = document.createElement(tagName);
        range.surroundContents(tagElement);
        editableContent.set(editableDiv.innerHTML);
      }
    }
    
    $: if (dialog && showModal) dialog.showModal();
    
    let previewModal = false;
    
    function displayPreview() {
      previewModal = !previewModal;
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
        style="margin: 0;"
        class="close-modal-btn"
        on:click={() => dialog.close()}
      >
        X
      </button>
      <div
        style="font-size: 1.5em; width: calc(10vw + 10rem);"
      >
        <h3 style="margin: 0;">Button Title</h3>
      </div>
      <br />
      <div style="justify-content: space-between; display: flex;">
        <div style="margin: 0;">
          <button on:click={() => applyTag('b', 'editable-content')}>B</button>
          <button on:click={() => applyTag('i', 'editable-content')}>I</button>
          <button on:click={() => applyTag('u', 'editable-content')}>U</button>
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
        <button class="save-edits-btn">Save changes ✉</button>
        <br />
      </div>
      
      <div class="preview-modal">
        {#if previewModal}
        <hr />
        <div>
          <!-- Replace newline characters with <br> tags -->
          <p>{@html inputText.split('\n').join('<br>')}</p>
        </div>
        {/if}
      </div>
</dialog>

<style>
  /* 
<Modal bind:showModal={showPreviewModal} on:closeModal={() => closeModal}>
    <!-- modal content example hardcoded -->
    <h1 class="modal-title">Content delivery</h1>
  </Modal> */

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
    padding: 0.5rem;
    display: block;
    float: right;
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


