<script lang="ts">
  import Logo from "../assets/favedis.png";
  import { navigate } from "svelte-routing";
  import { onDestroy, onMount } from "svelte";
  import { backend_url, frontend_url } from "../lib/urls";
  import { hexToRgba, getCookie } from "../lib/helpers.js";
  import GenModal from "../lib/genmodalview.svelte";
  import HomeLogo from '../assets/home_logo.png'
  import YoutubeLogo from '../assets/youtube_logo.png'
  import InstagramLogo from '../assets/instagram_logo.png'
  import FacebookLogo from '../assets/facebook_logo.png'
  import TwitterLogo from '../assets/twitter_logo.png'

  import {
    showPreviewModal,
    editedText,
    inputTextList,
    btnCount,
    containerCount,
    socialLinksList,
    buttonNames,
    buttonColors,
    borderRadius,
    textThickness,
    initializeStoresWithLocalStorage,
    stores,
    savedChanges,
    titleColor,
    bodyBackgroundColor,
    userImage,
    userWallpaper,
  } from "../lib/builderstore";

  const token = localStorage.getItem("token");
  let hoveredIndex = null;
  let outputMessageH1 = "Loading page...";

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

  function navigateToEditor() {
      navigate("/editor");
      window.location.reload();
  }


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
      const defaultRadius = 0.5; // Set your default border radius value here
      const newArr = [...arr];
      newArr.push(defaultRadius);
      return newArr;
    });

    // Ensure inputTextList has the correct number of elements
    inputTextList.update((arr) =>
      arr.length === length ? arr : new Array(length).fill("")
    );
    btnCount.set(length);
    containerCount.set(length);
  }

  let isGenpage = false;
  let foundPage = false;

  onMount(async () => {

    try {
      // Extract the last part of the URL (after the last '/')
      const pathParts = window.location.pathname.split("/");
      const firstNameFromURL = pathParts[pathParts.length - 1];
      const csrfToken = getCookie("csrftoken");
      let isLoggedIn = localStorage.getItem("token") !== null;

      if (firstNameFromURL == "genpage") {
        if(isLoggedIn) {
          try {
            const response = await fetch(backend_url + "/api/getname/", {
            method: "POST",
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          });

          const data = await response.json();

          if (localStorage.getItem("linkname") != data.first_name) {
            localStorage.setItem("linkname", data.first_name);
          }

          if(data.first_name != null) {
            navigate('/' + data.first_name);
          }
          else {
            navigate('/' + localStorage.getItem("linkname"));
          }
          window.location.reload();

          } catch (error) {
            console.error("An error occurred while fetching data:", error);
          } 
        }
        
        isGenpage = true;
      }

      console.log("foundPage status ", foundPage);

      console.log("Name from URL:", firstNameFromURL);

      const response = await fetch(backend_url + "/api/getdatapublic/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name: firstNameFromURL }),
      });

      if (!response.ok) {
        foundPage = false;
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Response data from server: ", responseData);

      // Handle JSON data
      if (responseData.data) {
        // Ensure responseData.data is a string and valid JSON before processing
        if (typeof responseData.data !== "string") {
          throw new Error(
            "Expected responseData.data to be a string representing a Python dictionary (file likely doesn't exist)."
          );
        }
        let jsonString = responseData.data;

        if (jsonString.startsWith("b'")) {
          jsonString = jsonString.substring(2, jsonString.length - 1);
        }

        jsonString = jsonString
          .replace(/\\\\\\"/g, '\\"')
          .replace(/\\\\/g, "\\");

        const jsonObject = JSON.parse(jsonString);

        // Parse the cleaned JSON string into a JavaScript object
        Object.entries(jsonObject).forEach(([storeName, storeValue]) => {
          if (stores[storeName]) {
            stores[storeName].set(storeValue);
            localStorage.setItem(storeName, JSON.stringify(storeValue));
          }
        });

        foundPage = true;

        // Initialize stores with local storage or fetched data
        initializeStoresWithLocalStorage();
      }

      // Handle image data
      if (responseData.image_data && responseData.image_data.length > 0) {
        userImage.set(`data:image/png;base64,${responseData.image_data}`);
      }

      if (responseData.wallpaper_data && responseData.wallpaper_data.length > 0) {
        userWallpaper.set(`data:image/png;base64,${responseData.wallpaper_data}`);
      }

      // Miscellaneous tasks, like dispatching events
      dispatchEvent(new CustomEvent("set-color", { detail: "#596b91" }));
      updateAllStores();
      savedChanges.set(true);
    } catch (error) {
      foundPage = false;
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  });

  let buttonStyles = [];

  $: {
    buttonStyles = $buttonColors.map((buttonColor, index) => ({
      btnBorderRadius: $borderRadius[index],
      textThickness: $textThickness[index],
      txtColor: hexToRgba(buttonColor[0].text.color, buttonColor[0].text.alpha),
      btnColor: hexToRgba(
        buttonColor[0].button.color,
        buttonColor[0].button.alpha
      ),
      btnHover: hexToRgba(
        buttonColor[0].hover.color,
        buttonColor[0].hover.alpha
      ),
      btnBorder: hexToRgba(
        buttonColor[0].border.color,
        buttonColor[0].border.alpha
      ),
      btnShadow: hexToRgba(
        buttonColor[0].shadow.color,
        buttonColor[0].shadow.alpha
      ),
    }));
  }

  // Automatically re-route when url changes, otherwise it requires manual reload
  onMount(() => {
    const handlePopState = (event) => {
        // Check if the current URL path is on of the navbar routes from logged in state:
        if (window.location.pathname === '/editor' || window.location.pathname === '/' || window.location.pathname === '/personal') {
            window.location.reload();
        }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
        window.removeEventListener('popstate', handlePopState);
    };
});

</script>


{#if !isGenpage}
  {#if foundPage}
    <div
      class="output-body"
      style="min-height: 100vh; background-color: {hexToRgba(
        $bodyBackgroundColor.body.color,
        $bodyBackgroundColor.body.alpha
      )};
      {$userWallpaper ? `background-image: url(${$userWallpaper}); background-size: cover; background-position: center;` : ''}"
    >

    {#if token}
    <a
      on:click={navigateToEditor}
      class="logo-container"
    >
      <img src={Logo} alt="Logo" class="site-logo" />
    </a>
  {:else}
    <a
      href="{frontend_url}"
      class="logo-container"
    >
      <img src={Logo} alt="Logo" class="site-logo" />
    </a>
  {/if}

      <br />

      <div class="header-component">
        <img
          style="margin-bottom: -5rem; margin-top: 8rem;"
          class="profile-img"
          src={$userImage}
          alt="Unable to load profile image"
        />

        <div style="margin-top: 6rem;" >
          {#if $socialLinksList.home}
          <a href="{$socialLinksList.home}" class='social-icon' target="_blank" rel="noopener noreferrer">
            <img
              class="social-icon-image"
              src={HomeLogo}
              alt="Home"
            />
          </a>
          {/if}
          
          {#if $socialLinksList.twitter}
          <a href="{$socialLinksList.twitter}" class='social-icon' target="_blank" rel="noopener noreferrer">
            <img
              class="social-icon-image"
              src={TwitterLogo}
              alt="Twitter"
            />
          </a>
          {/if}

          {#if $socialLinksList.instagram}
          <a href="{$socialLinksList.instagram}" class='social-icon' target="_blank" rel="noopener noreferrer">
            <img
              class="social-icon-image"
              src={InstagramLogo}
              alt="Twitter"
            />
          </a>
          {/if}

          {#if $socialLinksList.facebook}
          <a href="{$socialLinksList.facebook}" class='social-icon' target="_blank" rel="noopener noreferrer">
            <img
              class="social-icon-image"
              src={FacebookLogo}
              alt="Twitter"
            />
          </a>
          {/if}
          
          {#if $socialLinksList.youtube}
          <a href="{$socialLinksList.youtube}" class='social-icon' target="_blank" rel="noopener noreferrer">
            <img
              class="social-icon-image"
              src={YoutubeLogo}
              alt="YouTube"
            />
          </a>
          {/if}
        </div>

        <h1
          class="editing-text"
          style="background: none; font-weight: 1; color: {hexToRgba(
            $titleColor.body.color,
            $titleColor.body.alpha
          )}"
        >
          {$editedText}
        </h1>
      </div>

      {#each $buttonNames as name, index (index)}
        <div class="btn-container">
          <button
            class="recipe-link {hoveredIndex === index ? 'hovered' : ''}"
            on:click={() => openModal(index)}
            on:mouseover={() => (hoveredIndex = index)}
            on:mouseout={() => (hoveredIndex = null)}
            on:focus={() => (hoveredIndex = index)}
            on:blur={() => (hoveredIndex = null)}
            style="--btn-hover-color: {buttonStyles[index].btnHover};
        --btn-color: {buttonStyles[index].btnColor};
        --btn-border-radius: {buttonStyles[index].btnBorderRadius}px;
        --btn-border-color: {buttonStyles[index].btnBorder};
        --btn-shadow-color: {buttonStyles[index].btnShadow}"
          >
            <h2
              class="modal-btn-text"
              style="color: {buttonStyles[index].txtColor};
            --textThickness: {buttonStyles[index].textThickness};
          "
            >
              {$buttonNames[index]}
            </h2>
          </button>
        </div>
      {/each}

      <!-- ... -->
    </div>

    {#each Array($containerCount) as _, index (index)}
      <div class="template-container">
        <GenModal
          bind:showModal={$showPreviewModal[index]}
          on:closeModal={() => closeModal(index)}
          {index}
        />
      </div>
    {/each}

  {:else}
    <div
      style="background-color: {hexToRgba(
        $titleColor.body.color,
        $titleColor.body.alpha
      )};"
      class="center"
    >
      <br />
      <h1>
        {outputMessageH1}
      </h1>
    </div>
  {/if}
{:else}

  <div
    style="background-color: {hexToRgba(
      $titleColor.body.color,
      $titleColor.body.alpha
    )};"
    class="center"
  >
    <br />
    <h1>Failed to load</h1>
  </div>
{/if}

<style lang="scss">
  .output-body {
    flex: 1;
  }

  .logo-container {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
  }

  .site-logo {
    padding: 1rem;
    border-radius: 0.5rem;
    width: 15rem; /* You can adjust the size if needed */
    height: auto;
    cursor: pointer;
  }
  .site-logo:hover {
    background-color: rgba(0, 0, 0, 0.01);
    transform: 0.15s;
  }

  .header-component {
    margin: 0;
    align-items: center;
    display: flex;
    flex-direction: column; /* Stacks the template-container divs vertically */
  }

  .profile-img {
    border-radius: 50%;
    height: 12rem;
    width: 12rem;
  }

  .social-icon {
    border-radius: 15%; 
    padding: 0.4rem;
  }

  .social-icon:hover {
    transition: 0.3s;
  }

  .social-icon-image {
  width: 30px; 
  height: 30px;
  transition: transform 0.15s; /* Apply the transition to the transform property */
}

.social-icon-image:hover {
  transform: scale(1.1); /* Scale up the icon by 10% */
}

  .editing-text {
    text-align: center;
    color: #f2f2f2;
    font-size: calc(3.3em + 0.5vw);
    padding: 1rem;
    border: none;
    cursor: text;
  }

  .btn-container {
    margin: 0 auto;
    width: calc(70% + 5vw);
    display: flex;
  }

  .recipe-link {
    border-style: solid;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0);
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    color: rgb(223, 223, 223);
    background-size: cover;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 1.5rem;
    width: calc(50% + 10rem);
    font-size: calc(0.8em + 0.4vw);
    margin-top: 1rem;
  }

  .recipe-link {
    background-color: var(--btn-color);
    box-shadow: 0px 0px 5px 2px var(--btn-shadow-color);
    &:hover {
      background-color: var(--btn-hover-color);
    }

    border-radius: var(--btn-border-radius);
    border-color: var(--btn-border-color);
  }

  .modal-btn-text {
    color: var(--text-color);
  }

  .modal-btn-text {
    font-weight: var(--textThickness);
    color: white;
    flex: 1;
    text-align: center;
  }

  .center {
    height: 100vh;
    text-align: center;
  }

  .center h1 {
    width: 30%;
    color: white;
    margin: 0 auto;
    padding: 20px; /* optional padding */
    margin-top: 10rem;
    font-size: calc(1em + 1vw);
  }

  // There's some white space generated for no reason, so we override that with a ducktaped footer div
  // Can try to change this and go to a generated page and look at bottom to see what happens if confusing
  .footer {
    background-color: var(--body-bg-color);
    height: 6vh;
    width: 100%;
  }
</style>
