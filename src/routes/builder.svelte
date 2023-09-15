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
  import SaveIcon from "../assets/accept.png";
  import { onMount } from "svelte";

  import {
    showModal,
    showEditBtnModal,
    editedText,
    inputTextList,
    btnCount,
    containerCount,
    buttonNames,
  } from "../lib/builderstore";

  function addBtn() {
    const newNames = [...$buttonNames, `Recipe ${$buttonNames.length + 1}`];
    buttonNames.set(newNames);
    showModal.update((arr) => [...arr, false]); // Add a new modal state set to 'closed'
    showEditBtnModal.update((arr) => [...arr, false]); // Same for edit button modal state

    // Update other count variables
    $btnCount = newNames.length;
    $containerCount = newNames.length;
  }

  function removeLastBtn() {
    const names = [...$buttonNames];
    names.pop();
    buttonNames.set(names);

    showModal.update((arr) => {
      arr.pop(); // Remove the last modal state
      return [...arr];
    });

    showEditBtnModal.update((arr) => {
      arr.pop(); // Remove the last edit button modal state
      return [...arr];
    });
  }

  // Swap two recipe buttons when user presses either arrow
  function swapButtons(index, direction) {
    $buttonNames = [...$buttonNames]; // Clone for reactivity
    if (direction === "up" && index > 0) {
      [$buttonNames[index], $buttonNames[index - 1]] = [
        $buttonNames[index - 1],
        $buttonNames[index],
      ];
    } else if (direction === "down" && index < $buttonNames.length - 1) {
      [$buttonNames[index], $buttonNames[index + 1]] = [
        $buttonNames[index + 1],
        $buttonNames[index],
      ];
    }
    buttonNames.set($buttonNames); // Update the store
  }

  // Hovering over arrow buttons will also arrow-highlighter the entire component
  let hoveredIndex = null;
  function onHover(index) {
    hoveredIndex = index;
  }

  function onLeave() {
    hoveredIndex = null;
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

  // Sets the bg color behind the navbar (funky solution)
  onMount(() => {
    // DispatchEvent changes color upon load
    dispatchEvent(new CustomEvent("set-color", { detail: "#8EA8C3" }));
  });
</script>

<div class="body">
  <div class="outer-container">
    <div class="body-container">
      <div class="stats">
        <p style="">Page editor</p>
        <p style="">Followers: 1276</p>
      </div>
      <br />
      <br />
      <br />

      <div class="button-component">
        <div>
          <h1 style="width: 90%;">
            <input bind:value={$editedText} class="editing-text" />
          </h1>
        </div>
        <!-- ↑↓ -->

        {#each $buttonNames as name, index (index)}
          <div
            class="btn-container {hoveredIndex === index
              ? 'arrow-highlighter'
              : ''}"
          >
            <button
              class="arrow-btn"
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
              style="margin-right: 0.5rem;"
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
              Edit button
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
    </div>
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
    src: url("/fonts/monofonto rg.otf") format("opentype");
  }

  h1,
  h2,
  h3,
  p,
  a {
    font-family: "Monofonto", fallback, sans-serif;
  }

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
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
  }

  .body-container {
    background-color: #212a3eec;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
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

  .stats {
    margin-top: 0;
    background-color: #2c3a53;
    padding: 1.5rem;
    font-size: calc(1em + 0.5vw);
    border-radius: 0.5rem;
    display: flex;
    background-color: #27324b;
    justify-content: space-between; /* Space items between the edges */
    align-items: center;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
  }

  .stats p {
    margin-bottom: 0;
  }

  .arrow-btn {
    height: 50%;
    margin-top: 2.5rem;
    border: none;
    margin-left: 0.1rem;
    background: none;
    padding: 0.5rem 1rem;
    font-size: calc(1.5em + 0.3vw);
    border-radius: 0.5rem;
    background-color: #27324b;
    color: white;
  }

  .arrow-btn:hover {
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
  }

  .arrow-highlighter {
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
    transition: 0.1s ease-in-out;
    padding: 0 1rem 1rem 1rem;
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
</style>
