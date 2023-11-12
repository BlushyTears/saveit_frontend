<script>
    import { onMount } from 'svelte';
    import Cropper from 'cropperjs';
    import 'cropperjs/dist/cropper.css';
  
    let cropper;
    let imageElement;
    let isOpen = false; // Local state to control modal visibility
    

    function close() {
    isOpen = false;
  }

  function onSelectFile(event) {
  if (event.target.files && event.target.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Create an off-screen image to resize if necessary
      const offScreenImage = new Image();
      offScreenImage.onload = () => {
        // Check if the image needs resizing
        const maxWidth = 800; // max width for the preview
        const maxHeight = 600; // max height for the preview
        let { width, height } = offScreenImage;

        // Calculate the width and height maintaining aspect ratio
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        // Set the resized dimensions to the visible image element
        imageElement.width = width;
        imageElement.height = height;
        imageElement.src = offScreenImage.src;

        // Initialize the cropper on the resized image
        if (cropper) {
          cropper.replace(offScreenImage.src); // replace the cropper image source
        } else {
          cropper = new Cropper(imageElement, {
            aspectRatio: 16 / 9,
            // additional options...
          });
        }
      };
      offScreenImage.src = e.target.result; // set source to load the image
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}


  
  function onUpload() {
    const canvas = cropper.getCroppedCanvas();
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('croppedImage', blob, 'cropped-image.png');
      // You need to implement the actual upload logic here
      // For example, sending formData to a server endpoint
    });
  }
  
    onMount(() => {
    });
  </script>

<svelte:head>
  <link href="/node_modules/cropperjs/dist/cropper.css" rel="stylesheet" />
  <script src="/path/to/cropper.js"></script>
</svelte:head>

    <button on:click="{() => isOpen = true}">Open Cropper</button>

  {#if isOpen}
  <div class="modal">
    <div class="modal-background" on:click={close}></div>
    <div class="modal-content">
      <input type="file" accept="image/*" on:change="{onSelectFile}" />
      <div class="cropper-container">
        <img bind:this="{imageElement}" alt="Source Image" />
      </div>
      <button on:click="{onUpload}">Upload Image</button>
      <button on:click="{close}">Close</button>
    </div>
  </div>
  {/if}
  
  
  <style>
    .modal {
      /* Your modal styling */
    }
    .cropper-container {
      /* Style as needed to contain the cropper */
    }
  </style>
  