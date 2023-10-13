<!-- 95% of the layout is static, but few things such as coloring, emojis, content, social links are exclusive and thus are to be generated -->

<!-- Layout.svelte is a hardcoded outcome example of a basic template skeleton.svelte with added customization -->
<!-- Page customization and content is stored in a bucket together -->

<!-- Below is an example of a layout.svelte file that was hardcoded -->

<script>
  import Modal from "../lib/modal.svelte";
  import ProfileImg from "../assets/profile.png";
  import cookieImage from "../assets/cookies.png";
  import coffeeImage from "../assets/coffee.png";
  import Logo from "../assets/backlogo.png";
  import { onDestroy, onMount } from "svelte";
  import { backend_url } from "../lib/urls";
  import { hexToRgba, getCookie } from "../lib/helpers.js";
  import GenModal from "../lib/genmodalview.svelte";

  import {
    showPreviewModal,
    editedText,
    inputTextList,
    btnCount,
    containerCount,
    buttonNames,
    buttonColors,
    initializeStoresWithLocalStorage,
    stores,
    savedChanges,
    bodyBackgroundColor,
  } from "../lib/builderstore";


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

  function navigateToEditor() {
    window.location.href = '/editor';
  }
  
  function updateAllStores() {
    // Ensure showModal and showEditBtnModal have the correct number of elements
    const length = $buttonNames.length;

    // Ensure buttonColors has the correct number of elements
    buttonColors.update((arr) => {
      while (arr.length < length) {
        arr.push([
          {
            button: { color: "#ff0000", alpha: 1.0 },
            hover: { color: "#ff0000", alpha: 1.0 },
            border: { color: "#0000ff", alpha: 1.0 },
            shadow: { color: "#ff00ff", alpha: 1.0 },
          },
        ]);
      }
      return arr;
    });

    // Ensure inputTextList has the correct number of elements
    inputTextList.update((arr) =>
      arr.length === length ? arr : new Array(length).fill("")
    );
    btnCount.set(length);
    containerCount.set(length);
  }

  onMount(async () => {
  try {
    // Extract the last part of the URL (after the last '/')
    const pathParts = window.location.pathname.split('/');
    const firstNameFromURL = pathParts[pathParts.length - 1];

    console.log('Name from URL:', firstNameFromURL);
    const csrfToken = getCookie("csrftoken");
    const token = localStorage.getItem("token");

    const response = await fetch(backend_url + "/api/getdatapublic/", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name: firstNameFromURL })
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Response data from server: ", responseData);

    // Ensure responseData.data is a string and valid JSON before processing
    if (typeof responseData.data !== "string") {
      throw new Error(
        "Expected responseData.data to be a string representing a Python dictionary."
      );
    }
    let jsonString = responseData.data;

    if (jsonString.startsWith("b'")) {
      jsonString = jsonString.substring(2, jsonString.length - 1);
    }

    jsonString = jsonString
        .replace(/\\\\\\"/g, '\\"')
        .replace(/\\\\/g, '\\'); 

    const jsonObject = JSON.parse(jsonString);

    // Parse the cleaned JSON string into a JavaScript object
    Object.entries(jsonObject).forEach(([storeName, storeValue]) => {
      if (stores[storeName]) {
        stores[storeName].set(storeValue);
        localStorage.setItem(storeName, JSON.stringify(storeValue));
      }
    });

    // Initialize stores with local storage or fetched data
    initializeStoresWithLocalStorage();

    // Miscellaneous tasks, like dispatching events
    dispatchEvent(new CustomEvent("set-color", { detail: "#596b91" }));
    updateAllStores();
    savedChanges.set(true);
  } catch (error) {
    console.error(
      "There has been a problem with your fetch operation::",
      error
    );
  }
});


</script>

<div
  class="output-body"
  style="height: 100vh; background-color: {hexToRgba($bodyBackgroundColor.bodybackground.color, $bodyBackgroundColor.bodybackground.alpha)};"
>
    <a href="javascript:void(0);" on:click={navigateToEditor} class="logo-container">
    <img src={Logo} alt="Logo" class="site-logo" />
  </a>
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
    <h2 class="modal-btn-text">{$buttonNames[index]}</h2>
  </button>

  </div>
{/each}

  {#each Array($containerCount) as _, index (index)}
    <div class="template-container">
      <GenModal
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
  <br />

</div>

<style>

.logo-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}

.site-logo {
  width: 120px; /* You can adjust the size if needed */
  height: auto;
  cursor: pointer;
}
.site-logo:hover {
    background-color: rgba(255, 255,255, 0.1);
    transform: 0.1s;
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

  .btn-container {
    margin: 0 auto;
    width: calc(70% + 5vw);
    display: flex;
  }

  .recipe-link {
    margin: 0 auto;
    border: none;
    background-color: rgba(0, 0, 0, 0);
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    color: rgb(223, 223, 223);
    background-size: cover;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 1.5rem;
    border-radius: 3rem;
    width: calc(50% + 10rem);
    font-size: calc(0.8em + 0.4vw);
    margin-top: 1rem;
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
</style>
