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
  import Modal from "../lib/modal.svelte";
  import Editmodal from "../lib/editmodal.svelte";
  import BtnEditModal from "../lib/editbtnmodal.svelte";
  import PenIcon from "../assets/pen.png";
  import SaveIcon from "../assets/accept.png";
  import { onMount } from "svelte";

  let showModal = [false, false];
  let showEditBtnModal = [false];

  let isEditing = false;
  let editedText = "Ellie's Recipes!";

  onMount(() => {
    // DispatchEvent changes color upon load
    dispatchEvent(new CustomEvent("set-color", { detail: "#8a8a8a" }));
  });

  // function to open a specific modal
  function openModal(index) {
    showModal[index] = true;
  }

  // function to close a specific modal
  function closeModal(index) {
    showModal[index] = false;
  }

  function startEditing() {
    isEditing = true;
  }

  function saveEdit() {
    isEditing = false;
  }

  function openEditBtnModal(index) {
    showEditBtnModal[index] = true;
  }

  // function to close a specific modal
  function closeEditBtnModal(index) {
    showEditBtnModal[index] = false;
  }
</script>

<div class="body">
  <div class="body-container">
    <div class="stats">
      <p style="margin-top: 0; background-color: #2C3A53; padding: 1.5rem; border-radius: 0.5rem;">Page editor</p>
      <p style="margin-top: 0; background-color: #2C3A53; padding: 1.5rem; border-radius: 0.5rem;">Followers: 1276</p>
    </div>

    <div class="button-component">
      <div style="display: flex; align-items: center;">
        <h1>
          {#if isEditing}
            <input
              bind:value={editedText}
              class="editing-text"
            />
          {:else}
          <button
          on:click={() => startEditing()}
          on:keydown={(e) => e.key === 'Enter' && startEditing()}
          class="edited-text"
        >
          {editedText}
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
        {#if isEditing}
          <img
            src={SaveIcon}
            class="ok-btn"
            alt="pen icon"
            style="height: 4rem; width: 4rem;"
          />
        {/if}
        </button>
      </div>

      <div class="btn-container">
        <button class="recipe-link" on:click={() => openModal(0)}>
          <span class="emoji">🍪</span>
          <h2 class="modal-btn-text">Chocolate Chip Cookies</h2>
        </button>
        <button class="edit-button-btn" on:click={() => openEditBtnModal(0)}
          ><p />
          Edit</button
        >
      </div>
    </div>
  </div>

  <div class="template-container">
    <Editmodal
      bind:showModal={showModal[0]}
      on:closeModal={() => closeModal(0)}
    />
  </div>

  <div class="template-container">
    <BtnEditModal
      bind:showModal={showEditBtnModal[0]}
      on:closeEditBtnModal={() => closeEditBtnModal(0)}
    >
      <h1>asds</h1>
    </BtnEditModal>
  </div>
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
Accent color (coral): #FF6B6B -->

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
    color: #F2F2F2;
    margin: 0;
    padding: 0;
  }

  .body {
    /* Remove vertical scrolling by Subtracting navbar margin found in navbar.svelte */
    height: calc(100vh - 10.6rem);
    margin-top: 3rem;
    background-color: #8a8a8a;
  }

  .body-container {
    background-color: #212a3e;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
    min-height: 95%;
    min-width: 20rem;
    max-width: 60%;
    margin: 0 auto;
  }

  .editing-text {
    color: #F2F2F2;
    font-size: calc(1.15em + 0.5vw);
    margin-right: 1rem; 
    padding: 1rem;
    border-radius: 1rem;
    background-color: #27324b;
    border: none;
    cursor: text;
  }

  .edited-text {
    color: #F2F2F2;
    font-size: calc(1.15em + 0.5vw);
    margin-right: 1rem; 
    padding: 1rem;
    border-radius: 1rem;
    background-color: #212a3e;
    border: none;
    cursor: text;
  }

  .edited-text:hover {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    padding: 1rem 1.1rem;
  }

  .stats {
    font-size: calc(0.7em + 1.1vw);
    border-radius: 0.5rem;
    margin-bottom: 5rem;
    display: flex;
    background-color: #27324b;
    justify-content: space-between; /* Space items between the edges */
    align-items: center;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
  }

  .stats p {
    margin-bottom: 0;
  }

  .ok-btn {
    box-sizing: border-box;
    padding: 0.5rem;
  }

  .ok-btn:hover {
    cursor: pointer;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    transform: scale(1.05); /* Scale the image slightly on hover */
  }

  /* Button styling starts */

  .button-component {
    font-size: calc(0.6em + 0.3vw);
    font-family: "Comme", sans-serif;
    margin: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .btn-container {
    width: calc(50% + 4rem);
    display: flex;
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
    background-color: #A57F60;
    transition: 0.15s ease-in-out;
  }

  .emoji {
    text-align: left;
    font-size: 1.5em;
    margin-left: 1vw;
  }

  .modal-btn-text {
    flex: 1;
    text-align: center;
    margin-right: 2vw;
  }
</style>
