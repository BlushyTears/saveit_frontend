<script>
  export let showModal = false;
  export let index = 0;
  import Colorpicker from "./editbtnmodalcolorpicker.svelte";
  import {buttonNames, buttonColors} from "../lib/builderstore";
  import {savedChanges} from "../lib/builderstore";
  import { hexToRgba } from "./helpers";

  let dialog;
  let dragging = false;
  let isEditing = false;

  // Manually implement hover button instead of css :hover pseudo element since
  // Svelte can't reactively do that here.
  let isHovering = false;
  
  // Disabled until we add fonts options again
  // let boxes = ["F", "O", "N", "T", "S"];

  function startEditing() {
    isEditing = true;
  }

  function saveEdit() {
    isEditing = false;
  }

  function toggleHover(isHovered) {
    isHovering = isHovered;
  }

  $: if (dialog && showModal) dialog.showModal(index);

let btnColor = "";
let btnHover = "";
let btnBorder = "";
let btnShadow = "";

$: {
    btnColor = hexToRgba($buttonColors[index][0].button.color, $buttonColors[index][0].button.alpha);
    btnHover = hexToRgba($buttonColors[index][0].hover.color, $buttonColors[index][0].hover.alpha);
    btnBorder = hexToRgba($buttonColors[index][0].border.color, $buttonColors[index][0].border.alpha);
    btnShadow = hexToRgba($buttonColors[index][0].shadow.color, $buttonColors[index][0].shadow.alpha);
  }


  function updateStore() {
      savedChanges.set(false);
    }

</script>

<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:mousedown={() => (dragging = true)}
  on:mouseup={() => {
    if (dragging) {
      updateStore();
      dialog.close();
    }
    dragging = false;
  }}
  on:keydown={(e) => {
    if (e.key === "Escape") {
      updateStore();
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
        on:click={() => updateStore()}
        on:click={() => dialog.close()}
      >
        X
      </button>
      <div class="button-component">
        <div style="display: flex;">
          <h1 style="background-color: #3a47698c; color: white; font-size: calc(0.5vw + 1rem); width: calc(4vw + 5rem); padding: 0.5rem; margin-right: 1rem; border-radius: 1rem; text-align: center;">Button Design</h1>
          <h1>
            {#if isEditing}
            <input
            bind:value={$buttonNames[index]}
            class="editing-text"
            on:mouseover={() => toggleHover(true)}
            on:mouseout={() => toggleHover(false)}
            on:focus={() => toggleHover(true)}
            on:blur={() => toggleHover(false)}
            style="
              background-color: {isHovering ? btnHover : btnColor};
              border: 2px solid {btnBorder};
              {isHovering ? `box-shadow: 0px 0px 5px 2px ${btnShadow};` : ''}
            "
          />
          {:else}
          <button
            on:click={startEditing}
            on:keydown={(e) => e.key === 'Enter' && startEditing()}
            class="edited-text"
            on:mouseover={() => toggleHover(true)}
            on:mouseout={() => toggleHover(false)}
            on:focus={() => toggleHover(true)}
            on:blur={() => toggleHover(false)}
            style="
              background-color: {isHovering ? btnHover : btnColor};
              border: 2px solid {btnBorder};
              {isHovering ? `box-shadow: 0px 0px 5px 2px ${btnShadow};` : ''}
            "
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
          </button>
        </div>
      <br />
      <br>

      <div class="color-pickers">
        <div class="flex-div">
          <div class="colorpicker">
            <Colorpicker nameType={"Button"} index={index} subIndex={0}/>
          </div>
          <div class="description-div button-color-indication" style="background-color: {btnColor};"> 
            <h1>Button Color</h1>
          </div>
        </div>
        <br>
        <div class="flex-div">
          <div class="colorpicker">
            <Colorpicker nameType={"Hover"} index={index} subIndex={0}/>
          </div>
          <div class="description-div button-hover-indication" style="background-color: {btnHover};"> 
            <h1>Hover Color</h1>
          </div>
        </div>
        <br>
        <div class="flex-div">
          <div class="colorpicker">
            <Colorpicker nameType={"Border"} index={index} subIndex={0}/>
          </div>
          <div class="description-div button-border-indication transparent-div" style="border-color: {btnBorder};"> 
            <h1>Border Color</h1>
          </div>
        </div>
        <br>
        <div class="flex-div">
          <div class="colorpicker">
            <Colorpicker nameType={"Shadow"} index={index} subIndex={0}/>
          </div>
          <div class="description-div button-shadow-indication" style="box-shadow: 1px 1px 5px 1px {btnShadow};"> 
            <h1>Shadow Color</h1>
          </div>
        </div>
        <br>
      </div>
        <br>
      <br />

      <!-- Future font layout disabled (DON'T REMOVE) until we actually add them, its just not really needed for MVP. Needs: 
      let boxes = ["F", "O", "N", "T", "S"];
      in <script> order to work, also has css ready -->
      <!-- <div class="font-boxes">
        {#each boxes as box}
          <div class="box">
            {box}
            <div class="tooltip">Roboto</div>
          </div>
        {/each}
      </div> -->
      
      <hr>
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

  .button-component {
    font-size: calc(0.6em + 0.3vw);
    font-family: "Comme", sans-serif;
    margin: 0;
    flex-direction: column;
  }

  .editing-text {
    text-align: center;
    color: #F2F2F2;
    font-size: calc(1.15em + 0.5vw);
    padding: 1rem;
    border-radius: 1rem;
    border: none;
    cursor: text;
    max-width: clamp(10vw + 5rem, calc(15vw + 1rem), 15vw + 15rem);
  }

  .edited-text {
    text-align: center;
    color: #F2F2F2;
    font-size: calc(1.15em + 0.5vw);
    max-width: clamp(10vw + 5rem, calc(15vw + 1rem), 15vw + 15rem);
    padding: 1rem;
    border-radius: 1rem;
    border: none;
    cursor: text;
    transition: 0.1s ease-out;
  }

  .edited-text:hover {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.3);
  }

  .flex-div {
    display: flex;
    justify-content: space-between; /* This pushes the child elements to the extremes */
    align-items: center;
    width: 100%; /* Ensure it spans the full width of its container */
  }

  .colorpicker {
    flex: 0 0 auto; /* Ensures that the Colorpicker doesn't shrink or grow */
    margin-right: 1rem;
  }

  .color-pickers {
    display: block; 
  }

  .description-div {
    width: 15rem;
    padding: 1rem;
    text-align: center;
  }

  .transparent-div {
    background-color: rgba(0,0,0,0);
    border-width: 2px;
    border-style: solid;
    border-color: gray;
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

  /* Unused but shouldn't be removed because it's just disabled */
  .font-boxes {
    margin-top: 3rem;
    gap: 1rem;
    display: flex;
  }
    /* Unused but shouldn't be removed because it's just disabled */
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

  /* Unused but shouldn't be removed because it's just disabled */
  .box:hover {
    border: 2px solid black;
  }

  /* Unused but shouldn't be removed because it's just disabled */
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
  /* Unused but shouldn't be removed because it's just disabled */
  .box:hover .tooltip {
    visibility: visible;
    opacity: 0.95;
  }

  /* Unused but shouldn't be removed because it's just disabled */
  .box .tooltip::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: gray transparent transparent transparent;
  }

</style>
