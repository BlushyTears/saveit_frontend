<!-- Temp color theme:
    #37C84C light green
    #376AC8 light blue
    #C837B3 magenta
    #C89537 gold orange
    #964B00 brown
    #FFFFFF white


    Existing color 1: #212a3e
    Existing color 2: #394867

    Lighter blue: #567aa5
    Even Lighter blue: #7a9dcb
    Complementary warm color: #A57F60
    Soft gray: #A9A9A9
    Off-white: #F2F2F2
    Darker gray: #666666
    Contrast color (green): #6AB187
    Accent color (coral): #FF6B6B

-->

<!-- A RANDOM GETQUEST FOR QUERY SERVER DIRECTLY = ACCOUNTABILITY FOR IF BACKEND IS OPERATIONAL YES YES -->
<script>
  // For some dumb reason Vscode says Editmodal and BtnEditModal cannot be found but they work fine
  // @ts-ignore
  import Editmodal from "../lib/editmodal.svelte";
  // @ts-ignore
  import BtnEditModal from "../lib/editbtnmodal.svelte";
  import { onMount } from "svelte";
  import CopyToClipboard from "../lib/clipboardcopy.svelte";

  import {
    showModal,
    showEditBtnModal,
    editedText,
    inputTextList,
    btnCount,
    containerCount,
    buttonNames,
    buttonColors,
  } from "../lib/builderstore";

  function addBtn() {
    const newNames = [...$buttonNames, `New recipe`];
    buttonNames.set(newNames);

    showModal.update((arr) => [...arr, false]); // Add a new modal state set to 'closed'
    showEditBtnModal.update((arr) => [...arr, false]); // Same for edit button modal state

    buttonColors.update((arr) => {
      const newArr = [...arr];
      newArr.push([
        {
          button: { color: "#ff0000", alpha: 1.0 },
          hover: { color: "#00ff00", alpha: 1.0 },
          border: { color: "#0000ff", alpha: 1.0 },
          shadow: { color: "#ff00ff", alpha: 1.0 },
        },
      ]); // Add a new color set in a nested array
      return newArr;
    });

    inputTextList.update((arr) => [...arr, ""]); // Add a new empty text field

    btnCount.update((n) => newNames.length);
    containerCount.update((n) => newNames.length);
  }

  function removeLastBtn() {
    // Remove from buttonNames
    const names = [...$buttonNames];
    if (names.length > 0) {
      names.pop();
      buttonNames.set(names);
    }

    // Remove from showModal
    showModal.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    // Remove from showEditBtnModal
    showEditBtnModal.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    // Remove from buttonColors
    buttonColors.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    // Remove from inputTextList
    inputTextList.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    // Decrease btnCount
    btnCount.update((n) => (n > 0 ? n - 1 : 0));

  }

  function swapButtons(index, direction) {
    console.log("Before swap", $buttonColors);

    $buttonNames = [...$buttonNames];
    $inputTextList = [...$inputTextList];
    $buttonColors = [...$buttonColors];

    if (direction === "up" && index > 0) {
      [$buttonNames[index], $buttonNames[index - 1]] = [
        $buttonNames[index - 1],
        $buttonNames[index],
      ];
      [$inputTextList[index], $inputTextList[index - 1]] = [
        $inputTextList[index - 1],
        $inputTextList[index],
      ];
      [$buttonColors[index], $buttonColors[index - 1]] = [
        $buttonColors[index - 1],
        $buttonColors[index],
      ];
    } else if (direction === "down" && index < $buttonNames.length - 1) {
      [$buttonNames[index], $buttonNames[index + 1]] = [
        $buttonNames[index + 1],
        $buttonNames[index],
      ];
      [$inputTextList[index], $inputTextList[index + 1]] = [
        $inputTextList[index + 1],
        $inputTextList[index],
      ];
      [$buttonColors[index], $buttonColors[index + 1]] = [
        $buttonColors[index + 1],
        $buttonColors[index],
      ];
    }

    buttonNames.set($buttonNames);
    inputTextList.set($inputTextList);
    buttonColors.set($buttonColors);

    console.log("After swap", $buttonColors);
  }

  // Hovering over arrow buttons will also arrow-highlighter the entire component
  // There is a slight timer of 25 milliseconds added to ensure people don't accidentally hover right above the button
  // And creating a flickering effect since hovering moves down the component and thus pointer is outside of border
  // Which means it's now false, and thus the border is deleted and the components come back up again 100000x's a second
  let hoveredIndex = null;
  let canSetToNull = true; // Flag to control cooldown
  let cooldownTime = 25; // Time in milliseconds for cooldown

  function onHover(index) {
    if (canSetToNull) {
      hoveredIndex = index;
    }
  }

  function onLeave() {
    if (canSetToNull) {
      hoveredIndex = null;
      canSetToNull = false; // Set the flag to false, starting the cooldown

      setTimeout(() => {
        canSetToNull = true; // Reset the flag after cooldown time
      }, cooldownTime);
    }
  }

  // Generic modal stuff below
  function openModal(index) {
    showModal.update((arr) => {
      arr[index] = true;
      return [...arr];
    });
  }

  function closeModal(index) {
    showModal.update((arr) => {
      arr[index] = false;
      return [...arr];
    });
  }

  function openEditBtnModal(index) {
    showEditBtnModal.update((arr) => {
      arr[index] = true;
      return [...arr];
    });
  }

  // Function to close a specific edit button modal
  function closeEditBtnModal(index) {
    showEditBtnModal.update((arr) => {
      arr[index] = false;
      return [...arr];
    });
  }

  // Updates all the contents for public and saves it on aws server
  function updatePageChanges(key, initialValue) {
    // const storedValue = localStorage.getItem(key);
    // const initial = storedValue ? JSON.parse(storedValue) : initialValue;
    // const store = writable(initial);

    // store.subscribe(($value) => {
    //     localStorage.setItem(key, JSON.stringify($value));
    // });

    // return store;
  }

  // Sets the bg color behind the navbar (funky solution)
  onMount(() => {
    // DispatchEvent changes color upon load
    dispatchEvent(new CustomEvent("set-color", { detail: "#8EA8C3" }));
  });
</script>

<div class="body">
  <div class="outer-container">
    <div class="body-container">
      <div class="page-editor-text">
        <p style="">Page editor</p>
        <CopyToClipboard />
        <!-- <p style="">Followers: 1276</p> -->
      </div>
      <br />
      <br />
      <br />

      <div class="button-component">
        <div>
          <!-- Add margin-left because buttons are not truly centered because of its layout forcing the buttons to the right -->
          <h1 style="width: 90%; margin-left: calc(3vw + 1rem);">
            <input
              bind:value={$editedText}
              class="editing-text"
              style="width: 80%; margin: 0 auto;"
            />
          </h1>
        </div>

        {#each $buttonNames as name, index (index)}
          <div
            class="btn-container {hoveredIndex === index
              ? 'arrow-highlighter'
              : ''}"
          >
            <button
              class="arrow-btn"
              style="border-radius: 0.5rem 0 0 0.5rem;"
              on:mouseover={() => onHover(index)}
              on:mouseleave={onLeave}
              on:focus={() => onHover(index)}
              on:blur={onLeave}
              on:click={() => swapButtons(index, "up")}
            >
              ↑
            </button>

            <button
              class="arrow-btn"
              style="margin-right: 0.5rem; border-radius: 0 0.5rem 0.5rem 0;"
              on:mouseover={() => onHover(index)}
              on:mouseleave={onLeave}
              on:focus={() => onHover(index)}
              on:blur={onLeave}
              on:click={() => swapButtons(index, "down")}
            >
              ↓
            </button>

            <button class="recipe-link" on:click={() => openModal(index)}>
              <h2 class="modal-btn-text">{name}</h2>
            </button>

            <button
              class="edit-button-btn"
              on:click={() => openEditBtnModal(index)}
            >
              Edit
            </button>
          </div>
        {/each}

        <div class="edit-and-remove-btn-container">
          <div class="add-and-remove-buttons-container">
            <button class="add-btn-class" on:click={() => addBtn()}>
              <h2 class="modal-btn-text">Add Button</h2>
            </button>
            <button class="edit-button-btn" on:click={() => removeLastBtn()}>
              Remove
            </button>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <button class="save-edits-btn" on:click={() => updatePageChanges()}
        >Publish</button
      >
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

    </div>
    <br />

  </div>

  {#each Array($containerCount) as _, index (index)}
    <div class="template-container">
      <Editmodal
        bind:showModal={$showModal[index]}
        on:closeModal={() => closeModal(index)}
        inputText={$inputTextList[index]}
        {index}
      />
    </div>

    <div class="template-container">
      <BtnEditModal
        bind:showModal={$showEditBtnModal[index]}
        on:closeEditBtnModal={() => closeEditBtnModal(index)}
        inputText={$inputTextList[index]}
        {index}
      >
        <h1>Content for Container {index}</h1>
      </BtnEditModal>
    </div>
  {/each}
</div>

<!-- 
Existing color 1: #212a3e
Existing color 1 slight light: #27324b

Existing color 2: #394867

Lighter blue: #567aa5
Even Lighter blue: #7a9dcb
Complementary warm color: #A57F60
Soft gray: #A9A9A9
Off-white: #F2F2F2
Darker gray: #666666
Contrast color (green): #6AB187
Accent color (coral): #FF6B6B 

V2:

#212A3E Blue 
#F7C4A5 Apricot orange
#9E7682 Pink
#8EA8C3 Soft blue (rly nice)
-->

<style>
@font-face {
    font-family: "Monofonto";
    src: url("../assets/monofontorg.otf") format("opentype");
}

  input,
  h1,
  h2,
  p {
    color: #f2f2f2;
    margin: 0;
    padding: 0;
  }

  .body {
    /* Remove vertical scrolling by Subtracting navbar margin found in navbar.svelte */
    height: 100vh;
    margin-top: 3rem;
    background-color: #8ea8c3;
  }

  .outer-container {
    background-color: #27324b;
    width: calc(42rem + 15vw);
    max-width: 95%;
    min-height: 34rem;
    margin: 0 auto;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.15);
  }

  .body-container {
    background-color: #212a3eec;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.25);
    width: calc(40rem + 20vw);
    max-width: 90%;
    min-height: 32rem;
    margin: 0 auto;
  }

  .editing-text {
    text-align: center;
    color: #f2f2f2;
    font-size: calc(1.3em + 0.5vw);
    margin-right: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: #212a3ec9;
    border: none;
    cursor: text;
  }

  .page-editor-text {
    background-color: #2c3a53;
    padding: 1.5rem;
    font-size: calc(1.3em + 0.5vw);
    border-radius: 0.5rem;
    display: flex;
    background-color: #27324b;
    justify-content: space-between; /* Space items between the edges */
    align-items: center;
    box-shadow: 0px 3px 3px 2px rgba(0, 0, 0, 0.05);
  }

  .page-editor-text p {
    margin-bottom: 0;
  }

  .arrow-btn {
    height: 50%;
    margin-top: 1.8rem;
    border: none;
    background: none;
    padding: 0.8rem 1.3rem;
    font-size: calc(1em + 1vw);
    background-color: #27324b;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.15);
    color: white;
  }

  .arrow-btn:hover {
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.35);
  }

  .arrow-highlighter {
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
    transition: 0.1s ease-in-out;
    padding: 0 1rem 1rem 1rem;
    margin-top: 1rem;
  }

  /* Button styling starts */
  .button-component {
    font-size: calc(0.6em + 0.2vw);
    font-family: "Comme", sans-serif;
    margin: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .btn-container {
    width: calc(70% + 5vw);
    display: flex;
  }

  .add-and-remove-buttons-container {
    display: flex;
    justify-content: flex-end;
  }

  .edit-button-btn {
    cursor: pointer;
    border: none;
    background-color: rgba(12, 218, 22, 0);
    margin-top: 4rem;
    font-size: 1.2em;
    color: #bebebe;
    padding: 0.5rem;
  }

  .edit-button-btn:hover {
    color: #ffffff;
    transition: 0.1s ease-in-out;
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
    padding: 1rem;
    border-radius: 3rem;
    margin-top: 1rem;
    width: 100%;
    font-size: calc(0.8em + 0.4vw);
  }

  .recipe-link:hover {
    background-color: #f7c4a5;
    transition: 0.15s ease-in-out;
  }

  .add-btn-class {
    border: none;
    font-family: "Roboto Condensed", sans-serif;
    background-color: #394867;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    color: rgb(223, 223, 223);
    cursor: pointer;
    padding: 0 calc(2rem + 5vw);
    border-radius: 3rem;
    width: 100%;
    margin-left: calc(5rem + 1vw);
    margin-top: 1rem;
    font-size: calc(0.8em + 0.4vw);
  }

  .add-btn-class:hover {
    background-color: #40557e;
    transition: 0.1s ease-in-out;
  }

  /* Is unused atm, but this is a <span> meant to fill the space as an emoji such as 🍪 */
  .emoji {
    text-align: left;
    font-size: 1.5em;
    margin-left: 1vw;
  }

  .modal-btn-text {
    flex: 1;
    text-align: center;
  }

  .save-edits-btn {
    padding: 0.5rem 1rem;
    font-size: 2em;
    border: none;
    border-radius: 1rem;
    color: rgb(240, 240, 240);
    background-color: #d69d32;
    border-bottom: 1px solid rgb(148, 92, 7); /* 2px width, solid style, red color */
    border-right: 1px solid rgb(148, 92, 7);
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    margin-top: 3rem;
    float: right;
  }

  .save-edits-btn:hover {
    transition: 0.05s ease-in-out;
    background-color: #f1aa25;
  }
</style>
