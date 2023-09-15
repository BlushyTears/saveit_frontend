<script>
  export let showModal = false;
  export let index = 0;
  import Colorpicker from "./colorpicker.svelte";

  import {buttonNames} from "../lib/builderstore";
  
  let dialog;
  let dragging = false;
  let isEditing = false;

  let boxes = ["F", "O", "N", "T", "S"];


  function startEditing() {
    isEditing = true;
  }

  function saveEdit() {
    isEditing = false;
  }

  $: if (dialog && showModal) dialog.showModal(index);

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
      <!-- <div style="width: calc(25% + 5rem); margin-left: 5%;" contenteditable="true">
        <button class="focused-btn">
          <h2 class="modal-btn-text">{btnText}</h2>
        </button>
      </div> -->
      <div class="button-component">
        <div style="display: flex;">
          <h1>
            {#if isEditing}
              <input
                bind:value={$buttonNames[index]}
                class="editing-text"
              />
            {:else}
            <button
            on:click={() => startEditing()}
            on:keydown={(e) => e.key === 'Enter' && startEditing()}
            class="edited-text"
          >
            {$buttonNames[index]}
          </button>
            {/if}
          </h1>
          <button
            class="edit-button"
            on:click={isEditing ? saveEdit : startEditing}
            on:keydown={(e) => {
              if (e.key === "Enter" || e.key === "Space") {
                isEditing ? saveEdit() : startEditing();
              }
            }}
            tabindex="0"
            style="background: none; border: none; padding: 0; cursor: pointer;"
          >
          <!-- This is an example of a feedback button they press when they're done editing.
            It's not technically needed since they can just click outside of the text area to finish editing. 
            Undecided if needed or not so just commented out for now -->
          <!-- {#if isEditing}
            <img
              src={SaveIcon}
              class="ok-btn"
              alt="ok icon"
            />
          {/if} -->
          </button>
        </div>
      
      <br />

      <div class="color-pickers">
        <Colorpicker nameType={"Button:"}/>

      <br />
        <Colorpicker nameType={"Hover:"}/>
        <br/>
        <Colorpicker nameType={"Border:"}/>
      <br/>
        <Colorpicker nameType={"Shadow:"}/>
      </div>
      <br />

      <div class="font-boxes">
        {#each boxes as box}
          <div class="box">
            {box}
            <div class="tooltip">Roboto</div>
          </div>
        {/each}
      </div>

      <hr>
      
      <button class="save-edits-btn"
        >Save ✉</button
      >

    </div>

  </div>
</dialog>

<style>
  dialog {
    margin-top: 8%;
    width: calc(20% + 20rem);
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

  .button-component {
    font-size: calc(0.6em + 0.3vw);
    font-family: "Comme", sans-serif;
    margin: 0;
    flex-direction: column;
  }

  .editing-text {
    color: #F2F2F2;
    font-size: calc(1.15em + 0.5vw);
    padding: 1rem;
    border-radius: 1rem;
    background-color: #27324b;
    border: none;
    cursor: text;
    max-width: clamp(15vw + 5rem, calc(25vw + 1rem), 30vw + 15rem);
  }

  .edited-text {
    color: #F2F2F2;
    font-size: calc(1.15em + 0.5vw);
    width: calc(5rem + 15vw);
    padding: 1rem;
    border-radius: 1rem;
    background-color: #212a3e;
    border: none;
    cursor: text;
  }

  .edited-text:hover {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.3);
  }

  .ok-btn {
    height: calc(3.2rem + 1vw); 
    width: calc(3.2rem + 1vw);
    box-sizing: border-box;
    padding: 0.5rem;
  }

  .ok-btn:hover {
    cursor: pointer;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    transform: scale(1.05); /* Scale the image slightly on hover */
  }

  .color-pickers {
    display: flex; 
  }

  .font-boxes {
    margin-top: 3rem;
    gap: 1rem;
    display: flex;
  }
  .box {
    position: relative; /* Make the box a relative container for the tooltip */
    border: 2px solid gray;
    width: calc(2.5vw + 2rem);
    height: calc(2.5vw + 2rem);
    font-size: calc(1em + 1vw);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer; /* Indicates that the box is interactive */
  }

  .box:hover {
    border: 2px solid black;
  }

  .tooltip {
    font-size: 0.5em;
    visibility: hidden;
    background-color: gray;
    color: white;
    text-align: center;
    padding: 0.2rem;
    border-radius: 0.5rem;
    position: absolute;
    z-index: 1;
    bottom: 100%; /* Position at the top of the box */
    left: 50%;
    transform: translate(-20%, -0.5rem); /* Center the tooltip */
    opacity: 0;
    transition: opacity 0.3s;
  }
  .box:hover .tooltip {
    visibility: visible;
    opacity: 0.95;
  }

  .box .tooltip::after {
    content: " ";
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: gray transparent transparent transparent;
  }

  .save-edits-btn {
    width: 20%;
    padding: 0.5rem;
    font-size: 1.3em;
    border: none;
    border-radius: 1rem;
    background-color: #d69d32;
    border-bottom: 1px solid rgb(148, 92, 7); /* 2px width, solid style, red color */
    border-right: 1px solid rgb(148, 92, 7);
    margin-bottom: 0.5rem;
    float: right;
  }

  .save-edits-btn:hover {
    transition: 0.05s ease-in-out;
    background-color: #f1aa25;
  }

  /* Media queries: */

  @media only screen and (max-width: 1000px) {
    .color-pickers {
      display: block;
    }
  }
</style>
