<script>
  import {
    showPreviewModal,
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
    titleColor,
    bodyBackgroundColor,
    userImage,
    userWallpaper,
  } from "../lib/builderstore";

  import HomeLogo from '../assets/home_logo.png'
  import YoutubeLogo from '../assets/youtube_logo.png'
  import InstagramLogo from '../assets/instagram_logo.png'
  import TwitterLogo from '../assets/twitter_logo.png'
  import FacebookLogo from '../assets/facebook_logo.png'
  import Previewmodal from "./previewmodal.svelte";
  import { hexToRgba } from "./helpers";

  let hoveredIndex = null;

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

  let buttonStyles = [];

  $: {
    buttonStyles = $buttonColors.map((buttonColor, index) => ({
      btnBorderRadius: $borderRadius[index],
      textThickness: $textThickness[index],
      txtColor: hexToRgba(
        buttonColor[0].text.color, 
        buttonColor[0].text.alpha
      ),
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

</script>

<div
  class="output-body"
  style="background-color: {hexToRgba(
    $bodyBackgroundColor.body.color,
    $bodyBackgroundColor.body.alpha
  )};
    {$userWallpaper ? `background-image: url(${$userWallpaper}); background-size: cover; background-position: center;` : ''}"
>
  <h1 class="tabbar" style="font-size: calc(2em + 0.2vw);">Preview</h1>
  <br />

  <div class="header-component">
    <img
      style="margin-bottom: -5rem; margin-top: 4rem;"
      class="profile-img"
      src={$userImage}
      alt="Unable to load profile image"
    />

    <div class="social-icons" style="margin-top: 6rem;">
      {#if $socialLinksList.home}
      <a href="{$socialLinksList.home}" style="border-radius: 50%; padding: 5px;" target="_blank" rel="noopener noreferrer">
        <img
          src={HomeLogo}
          alt="Home"
          style="width: 30px; height: 30px;"
        />
      </a>
      {/if}
      
      {#if $socialLinksList.twitter}
      <a href="{$socialLinksList.twitter}" style="border-radius: 50%; padding: 5px;" target="_blank" rel="noopener noreferrer">
        <img
          src={TwitterLogo}
          alt="Twitter"
          style="width: 30px; height: 30px;"
        />
      </a>
      {/if}

      {#if $socialLinksList.instagram}
      <a href="{$socialLinksList.instagram}" style="border-radius: 50%; padding: 5px;" target="_blank" rel="noopener noreferrer">
        <img
          src={InstagramLogo}
          alt="Twitter"
          style="width: 30px; height: 30px;"
        />
      </a>
      {/if}

      {#if $socialLinksList.facebook}
      <a href="{$socialLinksList.facebook}" style="border-radius: 50%; padding: 5px;" target="_blank" rel="noopener noreferrer">
        <img
          src={FacebookLogo}
          alt="Twitter"
          style="width: 30px; height: 30px;"
        />
      </a>
      {/if}
      
      {#if $socialLinksList.youtube}
      <a href="{$socialLinksList.youtube}" style="border-radius: 50%; padding: 5px;" target="_blank" rel="noopener noreferrer">
        <img
          src={YoutubeLogo}
          alt="YouTube"
          style="width: 30px; height: 30px;"
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

  {#each Array($containerCount) as _, index (index)}
    <div class="template-container">
      <Previewmodal
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
    padding: 1.5rem;
    border: 1px solid rgba(99, 99, 99, 0.5);
    border-radius: 0 0 1rem 1rem;
    cursor: text;
  }

  .editing-text {
    text-align: center;
    color: #f2f2f2;
    font-size: calc(2.2em + 0.5vw);
    padding: 1rem;
    border-radius: 1rem;
    border: none;
    cursor: text;
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


  .output-body {
    border: 1px solid rgba(99, 99, 99, 0.5);
    margin: 0 auto;
    height: auto;
    width: 30vw;
    margin-top: 2rem;
  }

  .btn-container {
    margin: 0 auto;
    width: calc(70% + 5vw);
    display: flex;
  }

  .recipe-link {
    border-style: solid;
    font-family: "Roboto Condensed", sans-serif;
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

  .recipe-link {
    background-color: var(--btn-color);
    box-shadow: 0px 0px 5px 2px var(--btn-shadow-color);
    &:hover {
      background-color: var(--btn-hover-color);
    }

    border-radius: var(--btn-border-radius);
    border-color: var(--btn-border-color);
  }

  .recipe-link:hover {
    transition: 0.15s ease-in-out;
  }


  .modal-btn-text {
    font-weight: var(--textThickness);
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
