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

  let showImageToCrop = true;
  let showPreview = false;
  let cropper;
  let imgSrc;

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
          "Content-Type": "multipart/form-data",
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
        initializeCropper(imgSrc);
      };
      reader.readAsDataURL(file);
    }
  }

  const MIN_WIDTH = 400; // Set your minimum width
  const MIN_HEIGHT = 400; // Set your minimum height

  function initializeCropper(imageData: string) {
    const imageElement = new Image();
    imageElement.src = imageData;

    imageElement.onload = () => {
      let scaledImageData = imageData;

      // Check image dimensions and scale if needed
      if (imageElement.width < MIN_WIDTH || imageElement.height < MIN_HEIGHT) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set the canvas dimensions to the minimum dimensions
        canvas.width = Math.max(MIN_WIDTH, imageElement.width);
        canvas.height = Math.max(MIN_HEIGHT, imageElement.height);

        // Draw the image to the canvas, scaled up
        ctx?.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

        // Convert the canvas back to an image data URL
        scaledImageData = canvas.toDataURL();
      }

      const targetElement = document.querySelector(
        ".image-to-crop"
      ) as HTMLImageElement;
      if (targetElement) {
        targetElement.src = scaledImageData;

        if (cropper) {
          cropper.destroy();
        }

        cropper = new Cropper(targetElement, {
          aspectRatio: 1,
          viewMode: 1,
          // Force a minimum crop size to avoid super small image crops which takes forever to load
          // For now you can crop 33% of original image
          minCropBoxWidth: MIN_WIDTH / 3,
          minCropBoxHeight: MIN_HEIGHT / 3,
        });
      }
    };
  }

  function uploadImageToPreview() {
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

  // The rest of your existing script logic here...
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
    width: 70%;
    min-height: 10rem;
    height: auto;
    max-height: 1000px;
    margin: 0; /* to center it if you like */
  }

  /* Get element by ID is faster load time for processing somehow than class */
  #cropped-image-preview {
    max-width: 400px; /* Adjust as needed */
    max-height: 400px; /* Adjust as needed */
    display: block;
    margin: 0;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  }

  .image-to-crop {
    margin: 0 auto;
  }

  /* Image preview styles */
  .image-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image-preview img {
    border-radius: 50%;
    width: 200px;
    height: 200px;
    margin-bottom: 10px; /* Adjust as needed */
  }

  .image-buttons {
    margin-top: 1rem;
    display: flex;
    gap: 10px; /* Adjust as needed */
  }

  .image-upload-form {
    max-height: 500px;
    display: flex;
    flex-direction: column;
  }

  input[type="file"] {
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
    width: 200px;
    height: 200px;
    object-fit: cover;
  }
</style>
