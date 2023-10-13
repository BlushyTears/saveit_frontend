<script>
  import {
    showPreviewModal,
    editedText,
    containerCount,
    buttonNames,
    buttonColors,
    showEditBgColorModal,
    bodyBackgroundColor,
  } from "../lib/builderstore";

  import Previewmodal from "./previewmodal.svelte";
  import { hexToRgba } from "./helpers";

  let hoveredIndex = null;
  let isHovering = false;

  function openModal(index) {
    showPreviewModal.update((arr) => {
      arr[index] = true;
      return [...arr];
    });
  }

  function closeModal(index) {
    showPreviewModal.update((arr) => {
      arr[index] = false;
      return [...arr];
    });
  }

  function toggleHover(isHovered) {
    isHovering = isHovered;
  }

</script>

<div
  class="output-body"
  style="background-color: {hexToRgba($bodyBackgroundColor.bodybackground.color, $bodyBackgroundColor.bodybackground.alpha)};"
>
  <h1 class="tabbar" style="font-size: calc(2em + 0.5vw);">Preview</h1>
  <br />

  <h1 class="editing-text" style="margin-top: 2rem; background: none;">
    {$editedText}
  </h1>

  {#each $buttonNames as name, index (index)}
  <div class="btn-container">
    <button 
    class="recipe-link" 
    on:click={() => openModal(index)}
    on:mouseover={() => hoveredIndex = index}
    on:mouseout={() => hoveredIndex = null}
    on:focus={() => hoveredIndex = index}
    on:blur={() => hoveredIndex = null}
    style="background-color: {hoveredIndex === index ? 
    hexToRgba($buttonColors[index][0].hover.color, $buttonColors[index][0].hover.alpha) : 
    hexToRgba($buttonColors[index][0].button.color, $buttonColors[index][0].button.alpha)};">
    <h2 class="modal-btn-text">{name}</h2>
  </button>

  </div>
{/each}

  {#each Array($containerCount) as _, index (index)}
    <div class="template-container">
      <Previewmodal
        on:mouseover={() => toggleHover(true)}
        on:mouseout={() => toggleHover(false)}
        on:focus={() => toggleHover(true)}
        on:blur={() => toggleHover(false)}
        bind:showModal={$showPreviewModal[index]}
        on:closeModal={() => closeModal(index)}
        {index}
      />
    </div>
  {/each}
  <!-- The right amount of linebreaks is needed in order to make the button stay inside the container
  (secret trick), that makes us of the foundational pushing that is html (margin bottom doesn't work obviously) -->
  <br />
  <br />
  <br />
  <br />

  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />


</div>

<style>

.tabbar {
    text-align: center;
    color: #f2f2f2;
    font-size: calc(1.3em + 0.5vw);
    padding: 1rem;
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.25);
    border-radius: 1rem;
    border: none;
    cursor: text;
  }

  .editing-text {
    text-align: center;
    color: #f2f2f2;
    font-size: calc(1.3em + 0.5vw);
    padding: 1rem;
    border-radius: 1rem;
    border: none;
    cursor: text;
  }

  .output-body {
    margin: 0 auto;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.25);
    width: 30vw;
    margin-top: 2rem;
  }

  .btn-container {
    margin: 0 auto;
    width: calc(70% + 5vw);
    display: flex;
  }

  .recipe-link {
    border: none;
    font-family: "Roboto Condensed", sans-serif;
    background-color: rgba(0, 0, 0, 0);
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    color: rgb(223, 223, 223);
    background-size: cover;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 1.5rem;
    border-radius: 3rem;
    margin-top: 1rem;
    width: 100%;
    font-size: calc(0.8em + 0.4vw);
  }

  .recipe-link:hover {
    background-color: #f7c4a5;
    transition: 0.15s ease-in-out;
  }

  .modal-btn-text {
    color: white;
    flex: 1;
    text-align: center;
  }

  @media screen and (max-width: 1300px) {
    .output-body {
      width: 90%;
    }
  }
</style>
