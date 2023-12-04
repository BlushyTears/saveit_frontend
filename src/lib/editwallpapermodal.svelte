<script lang="ts">
  import { getCookie } from "../lib/helpers";
  import { backend_url } from "../lib/urls";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import Spinner from "../lib/loadspinner.svelte";

  import { userWallpaper } from "../lib/builderstore";

  let isModalOpen = false;
  let showSuccessBar = false;
  let showFailedBar = false;
  let mouseDownInsideModal = false;
  let isLoading = false;
  let imgSrc;
  let imgName;
  let selectedFile;

  function toggleModal() {
    isModalOpen = !isModalOpen;
  }

  function handleModalMouseDown() {
    mouseDownInsideModal = true;
  }

  function closeModalOnOutsideMouseUp(event) {
    if (
      !mouseDownInsideModal &&
      event.target.classList.contains("modal-overlay")
    ) {
      toggleModal();
    }
    mouseDownInsideModal = false;
  }

  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    showFailedBar = true;
  }

  async function removeWallpaper() {
    removeImageFromServer();
  }

  async function uploadImageToServer() {
    isLoading = true;

    const token = localStorage.getItem("token");
    const csrfToken = getCookie("csrftoken");

    const formData = new FormData();
    formData.append("image", selectedFile); // Append the file object

    try {
      const response = await fetch(backend_url + "/api/updatewallpaper/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        userWallpaper.set(selectedFile);
        console.log("Image uploaded successfully.");
        showSuccessNotification();
      } else {
        console.error("Error uploading image:", response.statusText);
        showFailedNotification();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showFailedNotification();
    }

    isLoading = false;
  }

  async function removeImageFromServer() {
    isLoading = true;

    const token = localStorage.getItem("token");
    const csrfToken = getCookie("csrftoken");

    try {
      const response = await fetch(backend_url + "/api/deletewallpaper/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        userWallpaper.set("");
        console.log("Image deleted successfully.");
        showSuccessNotification();
      } else {
        console.error("Error clearing image:", response.statusText);
        showFailedNotification();
      }
    } catch (error) {
      console.error("Error clearing image:", error);
      showFailedNotification();
    }

    isLoading = false;
  }

  function onImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      imgName = file.name;
      selectedFile = file;
    }
  }
</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message="Success!"
  color="#2dc23c"
  textShadow="#00ff48"
/>
<FailedNotif
  bind:showBar={showFailedBar}
  message="Error"
  color="#c22d2d"
  textShadow="#ff0037"
/>

<button on:click={toggleModal}>Change Wallpaper</button>

{#if isModalOpen}
  <div class="modal-overlay" on:click={closeModalOnOutsideMouseUp}>
    <div class="modal" on:mousedown={handleModalMouseDown}>
      <button style="float: right;" on:click={toggleModal}>Close</button>

      <div class="image-upload-form">
        <input
          id="fileInput"
          type="file"
          accept=".jpg, .jpeg, .png"
          on:change={onImageChange}
          style="display: none;"
        />
        <label for="fileInput" class="custom-upload-btn">Choose File</label>

        {#if isLoading}
          <div class="spinner-class"><Spinner /></div>
        {/if}

        <br />

        <p
          style="text-align:center; background-color: #41414136; padding: 0.5rem; border-radius: 0.2rem 0.2rem 0rem 0rem;"
        >
          Note: We suggest .jpg files because there's a 10mb limit. You also need to be verified to upload wallpaper (to combat spam)
        </p>

        <br />
        {#if selectedFile}
          <p>{imgName}</p>
          <br />
          <button style="width: 50%;" on:click={uploadImageToServer}
            >Update Wallpaper</button
          >
        {/if}

        {#if !selectedFile}
          <button class="remove-wp-btn" on:click={removeWallpaper}
            >Remove Current Wallpaper</button
          >
        {/if}

        <br />
      </div>
    </div>
  </div>
{/if}

<style>
  .spinner-class {
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translate(
      -50%,
      -50%
    ); /* This ensures the center of the spinner aligns with the center of the modal */
    z-index: 1; /* Optional, only if you want the spinner to appear above other modal content */
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal {
    min-height: 10rem;
    background-color: white;
    padding: 1rem;
    border-radius: 10px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }

  .image-upload-form {
    max-width: 500px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
  }

  input[type="file"] {
    max-width: 500px;
    max-height: 500px;
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 0.5rem;
  }

  button {
    font-size: 1em;
    cursor: pointer;
    background-color: #293255;
    color: white;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 2rem;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #434e74;
  }

  .remove-wp-btn {
    width: 50%;
    background-color: #8d2f2f;
    color: white;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 2rem;
    transition: background-color 0.2s;
  }

  .remove-wp-btn:hover {
    background-color: #a81f1f;
  }

  .custom-upload-btn {
    font-size: 1em;
    width: 6rem;
    display: inline-block;
    padding: 0.8rem 1.2rem;
    background-color: #293255;
    color: #fff;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: "Monofonto", fallback;
  }

  .custom-upload-btn:hover {
    background-color: #434e74;
  }

  .image-preview img {
    border-radius: 50%;
    max-width: 250px;
    max-height: 250px;
  }
</style>
