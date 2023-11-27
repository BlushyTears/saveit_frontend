<script>
    import { showEditBgColorModal, savedChanges } from "../lib/builderstore";
    import ColorPickerGeneric from "./bodybgcolorpicker.svelte";
  
    let dialog;
    let dragging = false;

    $: if (dialog && $showEditBgColorModal) dialog.showModal();

  </script>
  
  <dialog
  bind:this={dialog}
  on:close={() => ($showEditBgColorModal = false)}
  on:mousedown|stopPropagation
  on:keydown={(e) => {
      if (e.key === "Escape") {
      dialog.close();
      }
  }}
  on:click={() => {
      dialog.close();
  }}
>
  <div 
      on:click|stopPropagation
      on:mousedown|stopPropagation
      on:mouseup|stopPropagation
      on:keydown|stopPropagation
  >
      <div class="content-container" style="position: relative;">
        <div>
            <h3 >Miscellaneous</h3>
            <br />
            <ColorPickerGeneric />
        </div>
          <!-- Absolute positioning for the close button -->
          <button
              class="close-modal-btn"
              on:click={() => dialog.close()}
              style="position: absolute; top: -15px; right: -15px;"
          >
              X
          </button>
      </div>
  </div>
</dialog>

<style>

    dialog {
      margin-top: 8%;
      width: calc(15rem + 5vw);
      border-radius: 1rem;
      border: none;
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
  