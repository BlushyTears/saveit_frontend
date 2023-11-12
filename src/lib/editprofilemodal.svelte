<script lang="ts">
  import { getCookie } from "../lib/helpers";
  import { backend_url } from "../lib/urls";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import Spinner from "../lib/loadspinner.svelte";
  import { userImage } from "../lib/builderstore";
  import { tick } from "svelte";
  import Cropper from "cropperjs";

  let isModalOpen = false;
  let showSuccessBar = false;
  let ShowFailedBar = false;
  let mouseDownInsideModal = false;
  let isLoading = false;
  let showImageToCrop = true;
  let showPreview = false;
  let cropper;
  let imgSrc;

  function toggleModal() {
    isModalOpen = !isModalOpen;
  }

  function handleModalMouseDown() {
    mouseDownInsideModal = true;
  }
  function closeModalOnOutsideMouseUp(event) {
    // Check if the mouse was not pressed down inside the modal
    if (
      !mouseDownInsideModal &&
      event.target.classList.contains("modal-overlay")
    ) {
      toggleModal();
    }
    // Reset the flag for the next sequence of events
    mouseDownInsideModal = false;
  }

  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    ShowFailedBar = true;
  }


  async function uploadImageToServer() {
    isLoading = true;
    const previewImage = document.getElementById(
      "cropped-image-preview"
    ) as HTMLImageElement;

    if (!previewImage || !previewImage.src) {
      console.error("No cropped image available.");
      return;
    }

    const croppedImageDataUrl = previewImage.src;
    const token = localStorage.getItem("token");
    const csrfToken = getCookie("csrftoken");

    const formData = new FormData();
    const blob = await fetch(croppedImageDataUrl).then((res) => res.blob());

    const file = new File([blob], "uploaded_image.png", { type: "image/png" });

    formData.append("image", file, "uploaded_image.png");

    formData.forEach((value, key) => {
      console.log(key + " = " + value);
    });

    try {
      const response = await fetch(backend_url + "/api/updateprofile/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
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

  function onImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imgSrc = e.target.result;
        // This next line will now only run after onMount ensuring the target element is available.
        if (showImageToCrop) { // Ensure the image-to-crop area is meant to be shown.
          initializeCropper(imgSrc);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const MIN_WIDTH = 50; // Set your minimum width
  const MIN_HEIGHT = 50; // Set your minimum height

  const MAX_WIDTH = 500; // Set your maximum width
  const MAX_HEIGHT = 500; // Set your maximum height

function initializeCropper(imageData: string) {
  const imageElement = new Image();
  imageElement.src = imageData;

  imageElement.onload = () => {
    let width = imageElement.width;
    let height = imageElement.height;
    let isImageScaled = false; // Flag to check if scaling is required

    // Create a canvas to perform the image resizing
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Check if the image size exceeds the maximum limits
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      // Calculate the scale to fit the image within max dimensions
      const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
      width *= scale;
      height *= scale;
      isImageScaled = true; // Set the flag as true since scaling is done
    }

    // Apply minimum dimension constraints
    width = Math.max(MIN_WIDTH, width);
    height = Math.max(MIN_HEIGHT, height);

    // Set the canvas dimensions to the new dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw the image to the canvas, scaled as needed
    if (isImageScaled) {
      // Only scale the image if needed
      ctx.drawImage(imageElement, 0, 0, width, height);
    } else {
      // If no scaling is required, draw the image as it is
      ctx.drawImage(imageElement, 0, 0);
    }

    // Convert the canvas back to an image data URL
    let scaledImageData = canvas.toDataURL();

    // Set the scaled image data as the source for the image to crop
    const targetElement = document.querySelector('.image-to-crop') as HTMLImageElement;
    if (targetElement) {
      targetElement.src = scaledImageData;

      if (cropper) {
        cropper.destroy();
      }

      // Initialize Cropper with the new scaled image data
      cropper = new Cropper(targetElement, {
        aspectRatio: 1,
        viewMode: 1,
        minCropBoxWidth: MIN_WIDTH,
        minCropBoxHeight: MIN_HEIGHT,
      });
    }
  };
}


  function uploadImageToPreview() {
    console.log('loading cropper preview: ', Cropper);
    if (cropper) {
      const modifiedImageData = cropper.getCroppedCanvas().toDataURL();

      // Destroy the cropper before hiding the image
      cropper.destroy();
      cropper = null; // Nullify the cropper reference

      // Update visibility variables
      showImageToCrop = false;
      showPreview = true;

      setTimeout(() => {
        const previewImage = document.getElementById(
          "cropped-image-preview"
        ) as HTMLImageElement;
        if (previewImage) {
          previewImage.src = modifiedImageData;
        }
      }, 0);
    }
  }

  async function resetImgUpload() {
    showImageToCrop = true;
    showPreview = false;

    // Ensure the DOM has updated
    await tick();

    if (imgSrc) {
      initializeCropper(imgSrc);
    }
  }

  console.log('loading cropper: ', Cropper); // Should log the Cropper function if loaded properly

  import { onMount } from 'svelte';
  let imgElement;

  onMount(() => {
    imgElement = document.querySelector('.image-to-crop'); 
  });

</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message="Profile changed!"
  color="#2dc23c"
  textShadow="#00ff48"
/>

<FailedNotif
  bind:showBar={ShowFailedBar}
  message="Error"
  color="#9e9e9e"
  textShadow="#828282"
/>

<svelte:head>
	<link  href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.css" rel="stylesheet">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.min.js"></script>
</svelte:head>

<!-- Button to open the modal -->
<button on:click={toggleModal}>Change Profile</button>

{#if isModalOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal-overlay" on:click={closeModalOnOutsideMouseUp}>
    <div class="modal" on:mousedown={handleModalMouseDown}>
      <button style="float: right;" on:click={toggleModal}>Close</button>

      <div class="image-upload-form">
        <!-- Making input invisible -->
        <input
          id="fileInput"
          type="file"
          accept=".jpg, .jpeg, .png"
          on:change={onImageChange}
          style="display: none;"
        />

        <!-- Custom button as a label for the file input -->
        <label for="fileInput" class="custom-upload-btn">Choose File</label>

        {#if isLoading}
        <div class='spinner-class'>
          <Spinner />
        </div>
        {/if}

        {#if showImageToCrop}
          <div class="cropper-container">
            <img class="image-to-crop" src={imgSrc} />
          </div>
          <br />
          {#if imgSrc}
            <button style="width: 50%;" on:click={uploadImageToPreview}
              >Upload</button
            >
          {/if}
        {/if}
      </div>
      <br />

      <div class="profile-preview">
        {#if showPreview}
          <div class="image-preview">
            <img id="cropped-image-preview" alt="Cropped Image Preview" />
            <div class="image-buttons">
              <button on:click={resetImgUpload}>Change</button>
              <button on:click={uploadImageToServer}>Save</button>
            </div>
          </div>
        {/if}
      </div>

    </div>
  </div>
{/if}

<style>

.spinner-class {
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translate(-50%, -50%); /* This ensures the center of the spinner aligns with the center of the modal */
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
    background-color: white;
    padding: 1rem;
    border-radius: 10px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }

  .cropper-container {
    max-width: 500px;
    max-height: 500px;
    width: 70%;
    min-height: 5rem;
    height: auto;
    max-height: 20rem;
    margin: 0; /* to center it if you like */
  }

  /* Get element by ID is faster load time for processing somehow than class */
  #cropped-image-preview {
    max-width: 500px;
    max-height: 500px;
    display: block;
    margin: 0;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  }

  .image-to-crop {
    max-width: 250px;
    height: auto;
    margin: 0 auto;
  }

  /* Image preview styles */
  .image-preview {
    max-width: 500px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image-preview img {
    border-radius: 50%;
    max-width: 500px;
    max-height: 500px;
    margin-bottom: 10px; /* Adjust as needed */
  }

  .image-buttons {
    margin-top: 1rem;
    display: flex;
    gap: 10px; /* Adjust as needed */
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

  button{
    cursor: pointer;
    background-color: #bf15e9;
    color: white;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 2rem;
    font-size: 1.1em;
    transition: background-color 0.2s;
  }

  button:hover{
    background-color: #ad11d4;
  }

  .custom-upload-btn {
    font-size: 1.1em;
    width: 6rem;
    display: inline-block;
    padding: 0.8rem 1.2rem;
    background-color: #bf15e9;
    color: #fff;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .custom-upload-btn:hover {
    background-color: #ad11d4;
  }

  .image-preview img {
    border-radius: 50%;
    max-width: 250px;
    max-height: 250px;
  }
</style>
