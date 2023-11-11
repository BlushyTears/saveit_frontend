<script>
  export let showBtnModal = false;
  export let index = 0;
  import Colorpicker from "./editbtnmodalcolorpicker.svelte";
  import AlphaSliderTextThickness from "./editbtntextslider.svelte";
  import AlphaSliderCorner from "./editbtncornerslider.svelte";

  import {
    showModal,
    showPreviewModal,
    showEditBtnModal,
    editedText,
    inputTextList,
    btnCount,
    containerCount,
    buttonNames,
    buttonColors,
    borderRadius,
    textThickness,
    initializeStoresWithLocalStorage,
    stores,
    savedChanges,
    bodyBackgroundColor,
    titleColor,
    showEditBgColorModal,
  } from "../lib/builderstore";

  import { hexToRgba } from "./helpers";

  let dialog;
  let dragging = false;
  let isEditing = false;
  let showBtnDesigner = true;

  // Manually implement hover button instead of css :hover pseudo element since
  // Svelte can't reactively do that here.
  let isHovering = false;

  // Disabled until we add fonts options again
  // let boxes = ["F", "O", "N", "T", "S"];

  function toggleAccordion() {
    showBtnDesigner = !showBtnDesigner;
  }

  function copyButton(copyFromIndex = null) {
    console.log(copyFromIndex);
    savedChanges.set(false);
  const newNames = [...$buttonNames, `New recipe`];
  buttonNames.set(newNames);

  showModal.update((arr) => [...arr, false]); // Add a new modal state set to 'closed'
  showPreviewModal.update((arr) => [...arr, false]); // Add a new modal state set to 'closed'
  showEditBtnModal.update((arr) => [...arr, false]); // Same for edit button modal state

  buttonColors.update((arr) => {
    const newArr = [...arr];
    if (copyFromIndex !== null) {
      newArr.push(arr[copyFromIndex]);  // Copy color set from existing button
    } else {
      // Use hardcoded values for a new button
      newArr.push([
        {
          text: { color: "#F2F2F2", alpha: 1.0 },
          button: { color: "#373a70", alpha: 1.0 },
          hover: { color: "#4c5091", alpha: 1.0 },
          border: { color: "#000330", alpha: 0.5 },
          shadow: { color: "#000000", alpha: 0.1 },
        }
      ]);
    }
    return newArr;
  });

  borderRadius.update((arr) => {
    const newArr = [...arr];
    if (copyFromIndex !== null) {
      newArr.push(arr[copyFromIndex]);  // Copy border radius from existing button
    } else {
      const defaultRadius = 0.5;
      newArr.push(defaultRadius);
    }
    return newArr;
  });

  textThickness.update((arr) => {
    const newArr = [...arr];
    if (copyFromIndex !== null) {
      newArr.push(arr[copyFromIndex]);  // Copy text thickness from existing button
    } else {
      const defaultThickness = 10;
      newArr.push(defaultThickness);
    }
    return newArr;
  });

  inputTextList.update((arr) => {
    const newArr = [...arr];
    // Always use an empty string for the input text of the new button
    newArr.push("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    return newArr;
  });

  btnCount.update((n) => newNames.length);
  containerCount.update((n) => newNames.length);
  }

  function startEditing() {
    isEditing = true;
  }

  function saveEdit() {
    isEditing = false;
  }

  function toggleHover(isHovered) {
    isHovering = isHovered;
  }

  $: if (dialog && showBtnModal) dialog.showModal(index);

  let txtColor = "";
  let btnColor = "";
  let btnBorderRadius = "";
  let btnHover = "";
  let btnBorder = "";
  let btnShadow = "";

  $: {
    btnBorderRadius = $borderRadius[index];
    txtColor = hexToRgba(
      $buttonColors[index][0].text.color,
      $buttonColors[index][0].text.alpha
    );
    btnColor = hexToRgba(
      $buttonColors[index][0].button.color,
      $buttonColors[index][0].button.alpha
    );
    btnHover = hexToRgba(
      $buttonColors[index][0].hover.color,
      $buttonColors[index][0].hover.alpha
    );
    btnBorder = hexToRgba(
      $buttonColors[index][0].border.color,
      $buttonColors[index][0].border.alpha
    );
    btnShadow = hexToRgba(
      $buttonColors[index][0].shadow.color,
      $buttonColors[index][0].shadow.alpha
    );
  }

  function updateStore() {
    savedChanges.set(false);
  }
</script>

<dialog
  bind:this={dialog}
  on:close={() => (showBtnModal = false)}
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
              color: {txtColor};
              border-radius: {btnBorderRadius}px;
              box-shadow: 0px 0px 5px 2px {btnShadow};
            "
              />
            {:else}
              <button
                on:click={startEditing}
                on:keydown={(e) => e.key === "Enter" && startEditing()}
                class="edited-text"
                on:mouseover={() => toggleHover(true)}
                on:mouseout={() => toggleHover(false)}
                on:focus={() => toggleHover(true)}
                on:blur={() => toggleHover(false)}
                style="
              background-color: {isHovering ? btnHover : btnColor};
              border: 2px solid {btnBorder};
              color: {txtColor};
              border-radius: {btnBorderRadius}px;
              box-shadow: 0px 0px 5px 2px {btnShadow};
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
          />
        </div>
        <br />
        <br />

        <button class="accordation-btn" on:click={toggleAccordion}>
          {#if !showBtnDesigner}
            <p style="color: white;">Button designer</p>
          {:else}
            <p style="color: white;">Close</p>
          {/if}
        </button>

        <button class="accordation-btn" on:click={() => copyButton(index)}>
            <p style="color: white;">Copy Design</p>
        </button>
        <br />
        <br />

        {#if showBtnDesigner}
          <br />
          <br />
          <div class="color-pickers">
            <div class="flex-div">
              <div class="colorpicker">
                <Colorpicker nameType={"Text"} {index} subIndex={0} />
              </div>
              <div
                class="description-div button-color-indication"
                style="background-color: gray;"
              >
                <h1 style="color: {txtColor};">Text Color</h1>
              </div>
            </div>
            <br />
            <hr />
            <br />

            <div class="flex-div">
              <div class="colorpicker">
                <AlphaSliderTextThickness {index} />
              </div>
              <div
                class="description-div">
                <h1 style="font-weight: {$textThickness[index]}; ">Text thickness {$textThickness[index]}</h1>
              </div>
            </div>
            <br />
            <hr />
            <br />

            <div class="flex-div">
              <div class="colorpicker">
                <Colorpicker nameType={"Button"} {index} subIndex={0} />
              </div>
              <div
                class="description-div button-color-indication"
                style="background-color: {btnColor};"
              >
                <h1>Button Color</h1>
              </div>
            </div>
            <br />
            <hr />
            <br />

            <div class="flex-div">
              <div class="colorpicker">
                <Colorpicker nameType={"Hover"} {index} subIndex={0} />
              </div>
              <div
                class="description-div button-hover-indication"
                style="background-color: {btnHover};"
              >
                <h1>Hover Color</h1>
              </div>
            </div>
            <br />
            <hr />
            <br />

            <div class="flex-div">
              <div class="colorpicker">
                <Colorpicker nameType={"Border"} {index} subIndex={0} />
              </div>
              <div
                class="description-div button-border-indication transparent-div"
                style="border-color: {btnBorder};"
              >
                <h1>Border Color</h1>
              </div>
            </div>
            <br />
            <hr />
            <br />

            <div class="flex-div">
              <div class="colorpicker">
                <Colorpicker nameType={"Shadow"} {index} subIndex={0} />
              </div>
              <div
                class="description-div button-shadow-indication"
                style="box-shadow: 1px 1px 5px 1px {btnShadow};"
              >
                <h1>Shadow Color</h1>
              </div>
            </div>
            <br />
            <hr />
            <br />

            <div class="flex-div">
              <div class="colorpicker">
                <AlphaSliderCorner {index}/>
              </div>
              <div
                class="description-div button-border-indication transparent-div"
                style="border-color: black; border-radius: {btnBorderRadius}px;"
              >
                <h1>Corner Roundness</h1>
              </div>
            </div>
            <br />

            <br />
          </div>
        {/if}

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

        <hr />
      </div>
    </div>
  </div>
</dialog>

<style>
  dialog {
    margin-top: 8%;
    width: calc(25% + 20rem);
    border-radius: 1rem;
    border: none;
    padding: 0;
    height: 50rem;
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

  .accordation-btn {
    border: none;
    padding: 1.5rem;
    font-size: calc(0.8em + 0.5vw);
    border-radius: 0.8rem;
    background: none;
    background-color: #3a4769d5;
  }

  .accordation-btn:hover {
    background-color: #2a3653d5;
    cursor: pointer;
  }

  .button-component {
    font-size: calc(0.6em + 0.3vw);
    font-family: "Comme", sans-serif;
    margin: 0;
    flex-direction: column;
  }

  /* Editing-text and edited-text are not duplicates */
  .editing-text {
    text-align: center;
    font-size: calc(1.15em + 0.5vw);
    padding: 1rem;
    border: none;
    cursor: text;
    max-width: clamp(10vw + 5rem, calc(15vw + 1rem), 15vw + 15rem);
  }

  .edited-text {
    text-align: center;
    color: #f2f2f2;
    font-size: calc(1.15em + 0.5vw);
    max-width: clamp(10vw + 5rem, calc(15vw + 1rem), 15vw + 15rem);
    padding: 1rem;
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
    width: 97%; 
  }

  .colorpicker {
    margin-left: 1rem;
    flex: 0 0 auto; /* Ensures that the Colorpicker doesn't shrink or grow */
    margin-right: 15rem;
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
    background-color: rgba(0, 0, 0, 0);
    border-width: 2px;
    border-style: solid;
    border-color: gray;
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
