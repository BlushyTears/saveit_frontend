<script lang="ts">
  import { inputTextList, buttonNames } from "./builderstore"; // Add this import
  import { savedChanges } from "./builderstore";
  import { onMount } from "svelte";
  import Quillstance from "quill";

  export let showModal = false;
  export let index = 1; // Add this prop to know which element to update

  let quill_instance: any;

  let dialog;
  // Dragging is to make sure the user doesn't hold mouse inside modal and let go mouse outside and accidentally close the modal (annoying)
  let dragging = false;

  $: if (dialog && showModal) dialog.showModal();

  function updateStoresAndClose() {
    // Changes to false on purpose to make notification on close ready
    savedChanges.set(false);
    dialog.close();
  }

  let rawContent = "";
  
  onMount(() => {
  // Initialize Quill editor without a toolbar and in read-only mode
  quill_instance = new Quillstance(`.preview-editor-${index}`, {
    theme: 'snow',
    readOnly: true,
    modules: {
      toolbar: false
    }
  });
  
  // Set the initial content of the Quill editor using the API
  quill_instance.clipboard.dangerouslyPasteHTML($inputTextList[index] || "");
  rawContent = quill_instance.getText();

  // Listen for text changes and look for URLs matching image formats
  quill_instance.on('text-change', function(delta) {
  delta.ops.forEach(op => {
    if (op.insert && typeof op.insert === 'string') {
      const match = op.insert.match(/(https?:\/\/[^\s]+?(?:\.jpg|\.png|\.gif))/);
      if (match) {
        setTimeout(() => {
          const imageUrl = match[1];
          const position = quill_instance.getText().indexOf(imageUrl);
          if (position !== -1) {
            quill_instance.deleteText(position, imageUrl.length);
            quill_instance.insertEmbed(position, 'image', imageUrl);
          }
        }, 0);
      }
    }
  });
});

  // Update the inputTextList when there are changes to the editor content
  quill_instance.on("text-change", () => {
    $inputTextList[index] = quill_instance.root.innerHTML;
  });
});

// Reactive statement to update the Quill editor content based on store changes
$: if (quill_instance && $inputTextList[index] !== quill_instance.root.innerHTML) {
  quill_instance.clipboard.dangerouslyPasteHTML($inputTextList[index]);
}

</script>

<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:mousedown={() => (dragging = true)}
  on:mouseup={() => {
    if (dragging) {
      dialog.close();
      updateStoresAndClose();
    }
    dragging = false;
  }}
  on:keydown={(e) => {
    if (e.key === "Escape") {
      dialog.close();
      updateStoresAndClose();
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
        on:click={() => updateStoresAndClose()}
        on:click={() => dialog.close()}
      >
        X
      </button>
      <div style="font-size: 2em; width: calc(10vw + 10rem);">
        <h3
          style="margin: 0; color: black;"
          contenteditable="false"
          bind:innerText={$buttonNames[index]}
        >
          Title
        </h3>
      </div>
      <hr />
      <div>
        <!-- Contenteditable = false makes it so you're forced to press on top and create lines with enter.
        But this is on purpose as otherwise it screws the forum editor up when you try to 
        make a text bold, it puts the editor-mouse at the start without bolding the text for instance -->
        <div class="preview-slot-wrapper" contenteditable="false" style="width: 100%;">
          <div class={`preview-editor preview-editor-${index}`} style="width: 100%; font-size: 18px;"></div>
        </div>
        <hr />
        <br />
      </div>
    </div>
  </div>
</dialog>

<style>
.preview-editor {
    min-height: 600px;
    max-height: 800px;
    overflow-y: auto;
}
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
    color: black;
    font-size: 1em;
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
