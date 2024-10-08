<script lang="ts">
  import { inputTextList, buttonNames } from "../lib/builderstore";
  import { savedChanges } from "../lib/builderstore";
  import { onMount } from "svelte";
  import Quill from "quill";

  export let showModal = false;
  export let index = 1;
  export let showInstructions = false;

  let quill: any;
  // Because frontend frameworks are reactive sometimes they are also stupid. We need to use "tempText" variable for the content as long as its open
  // and only upon close do we update the store, as stores being updated can cause the modal to lose focus otherwise.
  let tempText = $inputTextList[index];
  let dialog;
  let dragging = false;

  $: if (dialog && showModal) dialog.showModal();

  function updateStoresAndClose() {
    // Update the store with the tempText value and then reset tempText
    $inputTextList[index] = tempText;
    savedChanges.set(false);
    dialog.close();
  }

  function handleImageInstructions() {
    // Toggle the instructions display
    showInstructions = !showInstructions;
  }
  
  const toolbarOptions = [
    ['bold', 'italic', 'underline'], // toggled buttons
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'size': ['small', true, 'large', 'huge'] }],  // custom dropdown
];

onMount(() => {
    quill = new Quill(`.editor-${index}`, {
      theme: 'snow',
      modules: {
          toolbar: toolbarOptions
      }
    });

    const editorContainer = document.querySelector(`.editor-${index}`);
    if (editorContainer) {
        const toolbar = editorContainer.previousElementSibling; // Adjust this if toolbar is not immediately before .editor in the DOM
        const customButton = toolbar.appendChild(document.createElement('span'));
        customButton.className = 'ql-formats';
        const button = document.createElement('button');
        button.innerHTML = 'Images';
        button.title = 'Image Instructions';
        button.onclick = handleImageInstructions;
        customButton.appendChild(button);
    }

    quill.on('text-change', function(delta) {
      delta.ops.forEach(op => {
        if (op.insert && typeof op.insert === 'string') {
          const match = op.insert.match(/(https?:\/\/[^\s]+?(?:\.jpg|\.jpeg|\.png|\.gif))/);
          if (match) {
            setTimeout(() => {
              const imageUrl = match[1];
              const position = quill.getText().indexOf(imageUrl);
              if (position !== -1) {
                quill.deleteText(position, imageUrl.length);
                quill.insertEmbed(position, 'image', imageUrl);
              }
            }, 0);
          }
        }
      });
    });

    quill.root.innerHTML = tempText;

    quill.on("text-change", () => {
      tempText = quill.root.innerHTML;
      console.log(tempText)
    });
  });
</script>

<svelte:head>
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
  <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
</svelte:head>

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
        on:click={() => {
          updateStoresAndClose();
          dialog.close();
        }}
      >
        X
      </button>
      <div style="font-size: 2em; width: calc(25vw + 7rem);">
        <h3
          style="margin: 0; color: black;"
          contenteditable="true"
          bind:innerText={$buttonNames[index]}
        >
          Title
        </h3>
      </div>
      <hr />
      <div>
        {#if showInstructions}
        <div class="image-instructions">
          <p>Instructions for adding an image:</p>
          <ul>
            <li>Visit a popular image hosting site such as imgur and select an image</li>
            <li>Right click the image and press "Copy Image Address" and paste it here</li>
            <li>The image will be automatically loaded when you paste it here in the editor.</li>
            <li>It should have this form: https://i.imgur.com/KT6wCMs.png</li>
            <li> Accepted formats: .png, .jpg, .jpeg, .gif (Yes, you read the last one right)</li>
          </ul>
          <button style="padding: 0.2rem; float: right; cursor: pointer;" on:click={() => showInstructions = false}>Close Instructions</button>
        </div>
        {/if}
        <!-- Contenteditable = false makes it so you're forced to press on top and create lines with enter.
        But this is on purpose as otherwise it screws the forum editor up when you try to 
        make a text bold, it puts the editor-mouse at the start without bolding the text for instance -->
        <div class="slot-wrapper" contenteditable="false" style="width: 100%;">
          <div class={`editor editor-${index}`} style="width: 100%; font-size: 18px;"></div>
        </div>
        <br />
      </div>
    </div>
  </div>
</dialog>

<style>

.image-instructions {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    z-index: 10;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }
.editor {
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
