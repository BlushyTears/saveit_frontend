<script>
  import { get, writable } from 'svelte/store';
  import { showEditLinksPickerModal, socialLinksList, savedChanges } from "../lib/builderstore";

  let dialog;

  // Helper function to ensure links have the https:// protocol
  function ensureHttps(url) {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  // This function is called when the dialog is closed and is meant to update the store.
  function updateSocialLinks() {
    const updatedLinks = {
      home: ensureHttps(get(socialLinksList).home),
      twitter: ensureHttps(get(socialLinksList).twitter),
      instagram: ensureHttps(get(socialLinksList).instagram),
      facebook: ensureHttps(get(socialLinksList).facebook),
      youtube: ensureHttps(get(socialLinksList).youtube),
      reddit: ensureHttps(get(socialLinksList).reddit),
      tiktok: ensureHttps(get(socialLinksList).tiktok),
      linkedin: ensureHttps(get(socialLinksList).linkedin),
      medium: ensureHttps(get(socialLinksList).medium),
      discord: ensureHttps(get(socialLinksList).discord)
    };
    
    socialLinksList.set(updatedLinks);
    savedChanges.set(true);
    dialog.close();
  }

  // Reactive statement to handle the dialog presentation
  $: if (dialog && $showEditLinksPickerModal) {
    dialog.showModal();
  }
</script>

<dialog
  bind:this={dialog}
  on:close={() => {
    updateSocialLinks();
    showEditLinksPickerModal.set(false);
  }}
  on:mousedown|stopPropagation
  on:keydown={(e) => {
    if (e.key === "Escape") {
      updateSocialLinks();
    }
  }}
  on:click={(e) => {
    if (e.target === dialog) {
      dialog.close();
      showEditLinksPickerModal.set(false);
    }
  }}
>
  <div
    on:click|stopPropagation
    on:mousedown|stopPropagation
    on:mouseup|stopPropagation
    on:keydown|stopPropagation
    style="position: relative;"
  >
    <!-- Close button (X) in the upper right corner -->
    <button
      class="close-modal-btn"
      on:click={() => dialog.close()}
      style="position: absolute; top: 10px; right: 10px;"
    >
      X
    </button>

    <div class="content-container">
      <h2>Edit Links:</h2>

      <br>
      <br>

      <!-- Input fields for home link, twitter link, and youtube link -->
      <!-- Input fields for home link, twitter link, and youtube link -->
      <div class="input-container">
        <label for="homeLink">Home link:</label>
        <input
          bind:value={$socialLinksList.home}
          type="text"
          id="homeLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="twitterLink">Twitter link:</label>
        <input
          bind:value={$socialLinksList.twitter}
          type="text"
          id="twitterLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="instagramLink">Instagram link:</label>
        <input
          bind:value={$socialLinksList.instagram}
          type="text"
          id="instagramLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="facebookLink">Facebook link:</label>
        <input
          bind:value={$socialLinksList.facebook}
          type="text"
          id="facebookLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="youtubeLink">Youtube link:</label>
        <input
          bind:value={$socialLinksList.youtube}
          type="text"
          id="youtubeLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="redditLink">Reddit link:</label>
        <input
          bind:value={$socialLinksList.reddit}
          type="text"
          id="redditLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="linkedIn">LinkedIn link:</label>
        <input
          bind:value={$socialLinksList.linkedin}
          type="text"
          id="linkedIn"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="tiktokLink">Tiktok link:</label>
        <input
          bind:value={$socialLinksList.tiktok}
          type="text"
          id="tiktokLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="mediumLink">Medium link:</label>
        <input
          bind:value={$socialLinksList.medium}
          type="text"
          id="mediumLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>

      <div class="input-container">
        <label for="discordLink">Discord link:</label>
        <input
          bind:value={$socialLinksList.discord}
          type="text"
          id="discordLink"
          placeholder="Leave this empty to not display on page"
        />
      </div>
      <br>
    </div>
  </div>
</dialog>

<style>
  input {
    min-height: 3rem;
    border-radius: 0.5rem;
    border: none;
    flex: 1;
  }

  .input-container {
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  dialog {
    margin-top: 8%;
    width: calc(20rem + 6vw);
    max-height: 50rem;
    border-radius: 1rem;
    border: none;
  }

  input {
    font-size: 1.3rem;
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.1);

  }

  dialog::backdrop {
    background: transparent; /* Remove backdrop color */
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

  .content-container {
    display: flex;
    flex-direction: column;
  }

  .close-modal-btn {
    cursor: pointer;
    color: black;
    font-size: 1em;
    border-radius: 50%;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    padding: 0.8rem;
    border: none;
    background: none;
    display: block;
    transition: 0.1s ease-in-out;
  }

  .close-modal-btn:hover {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.18);
  }
</style>
