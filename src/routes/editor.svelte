<script>
  // For some reason Vscode says Editmodal and BtnEditModal cannot be found but they work fine and are used
  // @ts-ignore
  import Editmodal from "../lib/editmodal.svelte";
  // @ts-ignore
  import BtnEditModal from "../lib/editbtnmodal.svelte";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import CopyToClipboard from "../lib/clipboardcopy.svelte";
  import { backend_url } from "../lib/urls";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import LoggedOutNotif from "../lib/notification.svelte";
  import Previewbuilder from "../lib/previewbuilder.svelte";
  import ColorSchemeModal from "../lib/colorschememodal.svelte";
  import LinksPickerModal from "../lib/editlinkspickermodal.svelte";

  import { getCookie } from "../lib/helpers";

  import {
    titleColor,
    showModal,
    showPreviewModal,
    showEditBtnModal,
    editedText,
    inputTextList,
    socialLinksList,
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
    showEditBgColorModal,
    showEditLinksPickerModal,
  } from "../lib/builderstore";
  
  let hoveredIndex = null;

  function addBtn() {
    savedChanges.set(false);
    const newNames = [...$buttonNames, `New recipe`];
    buttonNames.set(newNames);

    showModal.update((arr) => [...arr, false]); // Add a new modal state set to 'closed'
    showPreviewModal.update((arr) => [...arr, false]); // Add a new modal state set to 'closed'
    showEditBtnModal.update((arr) => [...arr, false]); // Same for edit button modal state

    buttonColors.update((arr) => {
      const newArr = [...arr];
      newArr.push([
        {
          // These are intentionally hardcoded values whenever a new button is made
          text: { color: "#F2F2F2", alpha: 1.0 },
          button: { color: "#373a70", alpha: 1.0 },
          hover: { color: "#4c5091", alpha: 1.0 },
          border: { color: "#000330", alpha: 0.5 },
          shadow: { color: "#000000", alpha: 0.1 },
        },
      ]); // Add a new color set in a nested array
      return newArr;
    });

    borderRadius.update((arr) => {
      const defaultRadius = 0.5; // Set your default border radius value here
      const newArr = [...arr];
      newArr.push(defaultRadius);
      return newArr;
    });

    textThickness.update((arr) => {
      const defaultThickness = 10; // Set your default border radius value here
      const newArr = [...arr];
      newArr.push(defaultThickness);
      return newArr;
    });

    // We hardcode a bunch of empty newlines in the quilljs text editor so you're not limited to interacting with text input at
    // the very top only and can now press anywhere in the modal, rather than having to manually create new lines from the top.
    // Won't need to be removed unless height of modal is changed and we dont want a scrollbar on the y-axis (unlikely)
    inputTextList.update((arr) => [
      ...arr,
      "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
    ]); // Add a new empty text field

    btnCount.update((n) => newNames.length);
    containerCount.update((n) => newNames.length);
  }

  function removeLastBtn() {
    savedChanges.set(false);
    const names = [...$buttonNames];
    if (names.length > 0) {
      names.pop();
      buttonNames.set(names);
    }

    showModal.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    showPreviewModal.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    showEditBtnModal.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    buttonColors.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    borderRadius.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    textThickness.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    inputTextList.update((arr) => {
      if (arr.length > 0) {
        arr.pop();
      }
      return [...arr];
    });

    // Decrease btnCount here
    btnCount.update((n) => (n > 0 ? n - 1 : 0));
    // Update to make sure consistency between stores (important for removal)
    updateAllStores();
  }

  // Vital function for making sure the store variables are all reset upon refreshing site
  // Without this, buttons cannot be opened because browser gets confused if a modal is open or not for instance
  function updateAllStores() {
    // Ensure showModal and showEditBtnModal have the correct number of elements
    const length = $buttonNames.length;

    // Ensure buttonColors has the correct number of elements
    buttonColors.update((arr) => {
      while (arr.length < length) {
        arr.push([
          {
            text: { color: "#F2F2F2", alpha: 1.0 },
            button: { color: "#ff0000", alpha: 1.0 },
            hover: { color: "#ff0000", alpha: 1.0 },
            border: { color: "#0000ff", alpha: 1.0 },
            shadow: { color: "#ff00ff", alpha: 1.0 },
          },
        ]);
      }
      return arr;
    });

    borderRadius.update((arr) => {
      while (arr.length < length) {
        const defaultRadius = 0; // Set your default border radius value here
        arr.push(defaultRadius);
      }
      return arr;
    });

    textThickness.update((arr) => {
      while (arr.length < length) {
        const defaultRadius = 0; // Set your default border radius value here
        arr.push(defaultRadius);
      }
      return arr;
    });

    // Ensure inputTextList has the correct number of elements
    inputTextList.update((arr) =>
      arr.length === length ? arr : new Array(length).fill("")
    );
    btnCount.set(length);
    containerCount.set(length);

    socialLinksList.update((links) => {
      // Here's where you'd establish default keys if necessary
      // For instance, if buttonNames included 'home', 'twitter', 'youtube', you'd ensure defaults
      // Loop over your expected keys (in this case 'home', 'twitter', 'youtube') to ensure they exist
    $buttonNames.forEach((name) => {
        if (!(name in links)) {
          links[name] = ''; // Use existing or fallback to empty string
        }
    });

      return { ...links }; // Return combined default and existing links
    });
  }

  let draggedIndex = null; // New variable

  function onDragStart(event, index) {
    event.dataTransfer.setData("text/plain", index.toString());
    draggedIndex = index; // Set the dragged index
  }

  function onDrop(event, dropIndex) {
    const dragIndex = Number(event.dataTransfer.getData("text/plain"));
    if (dragIndex !== dropIndex) {
      swapButtons(dragIndex, dropIndex);
    }
    hoveredIndex = null; // Reset the hovered index after the drop
  }

  function allowDrop(event, index) {
    event.preventDefault();
    hoveredIndex = index; // Set the hovered index
  }

  function swapButtons(dragIndex, dropIndex) {
    savedChanges.set(false);

    // Make shallow copies
    $buttonNames = [...$buttonNames];
    $inputTextList = [...$inputTextList];
    $buttonColors = [...$buttonColors];
    $borderRadius = [...$borderRadius]; // Make a copy of borderRadius
    $textThickness = [...$textThickness]; 

    // Swap function for readability and reusability
    function swapArrayElements(array, i, j) {
      [array[i], array[j]] = [array[j], array[i]];
    }

    // Swap elements in all arrays
    swapArrayElements($buttonNames, dragIndex, dropIndex);
    swapArrayElements($inputTextList, dragIndex, dropIndex);
    swapArrayElements($buttonColors, dragIndex, dropIndex);
    swapArrayElements($borderRadius, dragIndex, dropIndex); // Swap borderRadius as well
    swapArrayElements($textThickness, dragIndex, dropIndex); // Swap borderRadius as well

    // Update the stores
    buttonNames.set($buttonNames);
    inputTextList.set($inputTextList);
    buttonColors.set($buttonColors);
    borderRadius.set($borderRadius); // Update the borderRadius store
    textThickness.set($textThickness); 
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
  onMount(async () => {
    try {
      const csrfToken = getCookie("csrftoken");
      const token = localStorage.getItem("token");

      const response = await fetch(backend_url + "/api/getdata/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 401) {
        // If it is 401, remove the token from the local storage
        showLoggedOutNotification();
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        throw new Error("Invalid or expired token. Token has been removed.");
      }

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Response data from server:", responseData);

      // Ensure responseData.data is a string and valid JSON before processing
      if (typeof responseData.data !== "string") {
        sendStoreDataToServer(false);
        throw new Error(
          "Expected responseData.data to be a string representing a Python dictionary."
        );
      }
      let jsonString = responseData.data;

      if (jsonString.startsWith("b'")) {
        jsonString = jsonString.substring(2, jsonString.length - 1);
      }

      jsonString = jsonString.replace(/\\\\\\"/g, '\\"').replace(/\\\\/g, "\\");

      const jsonObject = JSON.parse(jsonString);

      // Parse the cleaned JSON string into a JavaScript object
      Object.entries(jsonObject).forEach(([storeName, storeValue]) => {
        if (stores[storeName]) {
          stores[storeName].set(storeValue);
          localStorage.setItem(storeName, JSON.stringify(storeValue));
        }
      });

      // If the fetch operation is successful, initialize stores with local storage or with fetched data
      initializeStoresWithLocalStorage();

      // Miscellaneous tasks, like dispatching events
      dispatchEvent(new CustomEvent("set-color", { detail: "#596b91" }));
      updateAllStores();
      savedChanges.set(true);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  });

  async function sendStoreDataToServer(displayNotif) {
    savedChanges.set(true);
    console.log("Saved changes state: ", $savedChanges);

    // Get the current values from the stores
    const titleColorValue = get(titleColor)
    const buttonColorsValue = get(buttonColors);
    const borderRadiusValue = get(borderRadius);
    const textThicknessValue = get(textThickness);
    const buttonNamesValue = get(buttonNames);
    const showModalValue = get(showModal);
    const showPreviewModalValue = get(showPreviewModal);
    const showEditBtnModalValue = get(showEditBtnModal);
    const editedTextValue = get(editedText);
    const inputTextListValue = get(inputTextList);
    const socialLinksListValue = get(socialLinksList);
    const showEditLinksPickerModalValue = get(showEditLinksPickerModal);
    const btnCountValue = get(btnCount);
    const containerCountValue = get(containerCount);
    const bodyBackgroundColorValue = get(bodyBackgroundColor);
    const showPreviewBtnModalValue = get(showEditBgColorModal);

    // Create an object containing all the relevant data
    const dataToSend = {
      titleColor: titleColorValue,
      buttonColors: buttonColorsValue,
      borderRadius: borderRadiusValue,
      textThickness: textThicknessValue,
      buttonNames: buttonNamesValue,
      showModal: showModalValue,
      showPreviewModal: showPreviewModalValue,
      showEditBtnModal: showEditBtnModalValue,
      editedText: editedTextValue,
      inputTextList: inputTextListValue,
      socialLinksList: socialLinksListValue,
      showEditLinksPickerModal: showEditLinksPickerModalValue,
      btnCount: btnCountValue,
      containerCount: containerCountValue,
      bodyBackgroundColor: bodyBackgroundColorValue,
      showEditBgColorModal: showPreviewBtnModalValue,
    };

    console.log("Data being sent: ", JSON.stringify(dataToSend));
    const csrfToken = getCookie("csrftoken");

    const token = localStorage.getItem("token");

    try {
      // Make a POST request to send the data to the backend
      const response = await fetch(backend_url + "/api/postdata/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Authorization: `Token ${token}`,
          // Include any other headers your backend requires, e.g., for authentication
        },
        body: JSON.stringify(dataToSend), // Convert the data to a JSON string
      });

      // Check if the request was successful
      if (!response.ok) {
        showFailedNotification();
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Data sent successfully!", responseData);
      // We run publish first time user goes to editor.svelte to create .json file
      // But we don't want to show the notification they didn't press the Publish button
      if (displayNotif){
        showSuccessNotification();
      }
    } catch (error) {
      console.error("Failed to send data:", error);
      showFailedNotification();
    }
  }

  $: {
    $titleColor,
    $buttonColors,
    $borderRadius,
    $textThickness,
    $buttonNames,
    $showModal,
    $showPreviewModal,
    $showEditBtnModal,
    $editedText,
    $inputTextList,
    $socialLinksList,
    $btnCount,
    $containerCount,
    $bodyBackgroundColor,
    $showEditBgColorModal,
    $showEditLinksPickerModal;
  }

  // Mischelaneous stuff here
  let showSuccessBar = false;
  let ShowFailedBar = false;
  let showLoggedOutNotifBar = false;

  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    ShowFailedBar = true;
  }

  function showLoggedOutNotification() {
    showLoggedOutNotifBar = true;
  }

  function openColorEditModal() {
    showEditBgColorModal.set(true);
  }

  function openLinksEditModal() {
    showEditLinksPickerModal.set(true);
  }
</script>

<svelte:head>
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
  <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
</svelte:head>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message="Saved!"
  color="#2dc23c"
  textShadow="#00ff48"
/>
<FailedNotif
  bind:showBar={ShowFailedBar}
  message="Error"
  color="#c22d2d"
  textShadow="#ff0037"
/>

<LoggedOutNotif
  bind:showBar={showLoggedOutNotifBar}
  message="Session expired, please log in again"
  color="#9e9e9e"
  textShadow="#828282"
/>

<br />
<div class="header-body">
  <div class="page-editor-text">
    <p style="">Page editor</p>
    <CopyToClipboard />
    <!-- <p style="">Followers: 1276</p> -->
  </div>
  <div class="parrent-body">
    <br />

    <div class="body">
      <div class="body-container">
        <h1 class="tabbar" style="font-size: calc(2em + 0.2vw);">Editor</h1>

        <div class="title-component">
          <div>
            <!-- Add margin-left because buttons are not truly centered because of its layout forcing the buttons to the right -->
            <h1 style="width: 90%; margin-left: calc(3vw + 1rem);">
              <input bind:value={$editedText} class="editing-text" />
            </h1>
          </div>

          {#each $buttonNames as name, index (index)}
            <div
              class="btn-container {hoveredIndex === index
                ? 'hovered'
                : ''} {draggedIndex === index ? 'dragged' : ''}"
              draggable="true"
              on:dragstart={(e) => onDragStart(e, index)}
              on:drop={(e) => onDrop(e, index)}
              on:dragover={(e) => allowDrop(e, index)}
            >
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
                <h2 style="padding: 0.8rem 0;" class="modal-btn-text">Add</h2>
              </button>
              <button class="add-btn-class" on:click={() => removeLastBtn()}>
                <h2 style="padding: 0.8rem 0;" class="modal-btn-text">
                  Remove
                </h2>
              </button>
            </div>
          </div>
        </div>
        <!-- The right amount of linebreaks is needed in order to make the button stay inside the container at the bottom
            (secret trick), that makes us of the foundational pushing that is html (margin-bottom doesn't work obviously) -->
        <br />
        <br />
        <br />
        <br />
        <button style="margin-left: 0.6rem;" class="colorPickerBtn" on:click={() => openColorEditModal()}>
          🎨
          <span class="tooltip">Global Colors</span>
        </button>

        <button class="colorPickerBtn" on:click={() => openLinksEditModal()}>
          🔗
          <span class="tooltip">Social Links</span>
        </button>

        <button class="save-edits-btn" on:click={() => sendStoreDataToServer(true)}
          >Save & Publish</button
        >
        <br />
        <br />
      </div>
      <br />

      <div>
        <ColorSchemeModal />
      </div>

      <div>
        <LinksPickerModal />
      </div>

      {#each Array($containerCount) as _, index (index)}
        <div class="template-container">
          <Editmodal
            bind:showModal={$showModal[index]}
            on:closeModal={() => closeModal(index)}
            {index}
          />
        </div>

        <div class="template-container">
          <BtnEditModal
            bind:showBtnModal={$showEditBtnModal[index]}
            on:closeEditBtnModal={() => closeEditBtnModal(index)}
            {index}
          />
        </div>
      {/each}
    </div>

    <div class="output-container">
      <Previewbuilder />
    </div>
  </div>
  <br />
  <br />
  <br />
</div>

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
    margin: 0 auto;
    padding: 0;
    min-height: 80vh;
  }

  .parrent-body {
    display: flex;
  }

  .header-body {
    background-color: #3a4769d5;
    width: 95%;
    margin: auto;
    margin-top: 2rem;
  }

  .body-container {
    margin: 0 auto;
    padding: 0;
    background-color: #27324b3d;
    height: auto;
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.15);
    width: calc(15rem + 40vw);
    margin-top: 2rem;
  }

  .page-editor-text {
    padding: 1.5rem;
    font-size: calc(1.3em + 0.5vw);
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    display: flex;
    background-color: #27324b3f;
    justify-content: space-between; /* Space items between the edges */
    align-items: center;
    box-shadow: 0px 3px 3px 2px rgba(0, 0, 0, 0.05);
  }

  .tabbar {
    text-align: center;
    color: #f2f2f2;
    font-size: calc(1.3em + 0.5vw);
    padding: 1.5rem;
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    border: none;
    cursor: text;
  }

  .editing-text {
    text-align: center;
    color: #f2f2f2;
    font-size: calc(1.3em + 0.5vw);
    padding: 1.5rem;
    border-radius: 0.3rem;
    background-color: #27324b3f;
    border: none;
    cursor: text;
    width: 80%;
    margin: 0 auto;
  }

  /* Button styling starts */
  .title-component {
    font-size: calc(0.6em + 0.2vw);
    font-family: "Comme", sans-serif;
    margin: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }

  .btn-container {
    width: calc(70% + 5vw);
    display: flex;
  }

  .add-and-remove-buttons-container {
    display: flex;
  }

  .edit-button-btn {
    cursor: pointer;
    border: none;
    background-color: rgba(12, 218, 22, 0);
    margin-top: 5rem;
    font-size: 1.2em;
    color: #bebebe;
    padding: 0.5rem;
  }

  .edit-button-btn:hover {
    color: #ffffff;
    transition: 0.1s ease-in-out;
  }

  .btn-container.hovered {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    border-radius: 3rem;
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
    background-color: #445d8d;
    transition: 0.15s ease-in-out;
  }

  .add-btn-class {
    border: none;
    font-family: "Roboto Condensed", sans-serif;
    background-color: #394867;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(99, 99, 99, 0.616);
    color: rgb(223, 223, 223);
    cursor: pointer;
    padding: 0 calc(2rem + 5vw);
    border-radius: 3rem;
    width: 100%;
    margin-top: 1rem;
    font-size: calc(0.8em + 0.4vw);
  }

  .add-btn-class:hover {
    background-color: #40557e;
    transition: 0.1s ease-in-out;
  }

  .modal-btn-text {
    flex: 1;
    text-align: center;
  }

  .colorPickerBtn {
    position: relative;
    padding: 0.3rem;
    font-size: 1.5em;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.2);
    margin-left: 0.1rem;
    margin-top: 4rem;
  }

  .colorPickerBtn:hover {
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.35);
  }

  .colorPickerBtn:hover .tooltip {
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.25);
    visibility: visible;
    opacity: 1;
  }

  .tooltip {
    font-size: 0.7em;
    visibility: hidden;
    position: absolute;
    background-color: #555;
    color: #fff;
    text-align: center;
    padding: 0.6rem;
    border-radius: 0.3rem;
    z-index: 1;
    bottom: 125%; /* Position the tooltip above the button */
    left: 50%;
    margin-left: -1.5rem; /* Centers the tooltip */
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip::after {
    content: "";
    position: absolute;
    top: 100%; /* Arrow will appear at the bottom of the tooltip */
    left: 35%;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  .save-edits-btn {
    padding: 0.5rem 1rem;
    font-size: 2em;
    border: none;
    border-radius: 1rem;
    color: rgb(240, 240, 240);
    background-color: #d69d32;
    border: 1px solid rgb(148, 92, 7); /* 2px width, solid style, red color */
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    margin-top: 3rem;
    float: right;
  }

  .save-edits-btn:hover {
    cursor: pointer;
    transition: 0.1s ease-in-out;
    background-color: #ce8c13;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
  }

  /* The preview/output body that shows end result starts here */
  .output-container {
    margin: 0 auto;
  }

  @media screen and (max-width: 1300px) {
    .body {
      min-height: 0;
      height: auto;
    }
    
    .body-container {
      width: 90%;
    }

    .parrent-body {
      display: block;
  }

    .body-container {
      margin: 0 auto;
    }
  }
</style>