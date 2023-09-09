<script>
  import { onMount } from "svelte";

  import Example_Page from "../assets/examplepage.png";
  import Example_Page2 from "../assets/examplepage.png";

  let currentIndex = 0;
  let posts;
  let postWidth;

  const images = [
    { src: Example_Page, alt: "Carusel image could not load" },
    { src: Example_Page2, alt: "Carusel image could not load" },
    { src: Example_Page, alt: "Carusel image could not load" },
    { src: Example_Page2, alt: "Carusel image could not load" },
    { src: Example_Page, alt: "Carusel image could not load" },
    { src: Example_Page2, alt: "Carusel image could not load" },
    { src: Example_Page, alt: "Carusel image could not load" },
    // add more images here
  ];

  function calculatePostWidth() {
    const carouselPost = posts.querySelector(".carousel-post");
    if (carouselPost) {
      postWidth = carouselPost.getBoundingClientRect().width;
    }
  }

  function updateCarousel() {
    // Translate the carousel by the pixel width of each post, times the current index
    posts.style.transform = `translateX(-${currentIndex * postWidth}px)`;
  }

  // WARNING: If current index modulus constant exceeds the number of pictures it'll cause a visual bug when you get to the end of the images
  const modulus = 6;
  function moveToNext() {
    currentIndex = (currentIndex + 1) % modulus;
    updateCarousel();
  }

  function moveToPrev() {
    if (currentIndex > 0) {
      currentIndex = (currentIndex - 1) % modulus;
      updateCarousel();
    }
  }

  onMount(() => {
    calculatePostWidth();
    window.addEventListener('resize', calculatePostWidth);
    return () => { window.removeEventListener('resize', calculatePostWidth); }; // Cleanup
  });

  // Automatically start moving when the component mounts
</script>

<div class="carousel">
  <div bind:this={posts} class="carousel-container">
    {#each images as image}
      <div class="carousel-post">
        <img src={image.src} alt={image.alt} />
      </div>
    {/each}
  </div>
  <div class="carousel-controls">
    <button on:click={moveToPrev}>&lt;</button>
    <div class="carousel-dots">
      {#each images as _, i}
        <div
          class={i === currentIndex ? "dot active-dot" : "dot"}
          on:click={() => ((currentIndex = i), updateCarousel())}
          on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              currentIndex = i;
              updateCarousel();
            }
          }}
          tabindex="0"
          role="button"
          aria-label={`Go to slide ${i + 1}`}
        />
      {/each}
    </div>
    <button on:click={moveToNext}>&gt;</button>
  </div>
</div>

<style>
  .carousel {
    position: relative;
    width: 70%;
    margin: 0 auto;
    overflow: hidden;
  }

  .carousel-container {
    width: 40%;
    height: 40%;
    display: flex;
    transition: transform 0.5s ease-in-out;
  }

  .carousel-post {
    flex: 0 0 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    background-color: lightgray;
  }

  .carousel-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }

  .carousel-controls button {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dot {
    width: 10px;
    height: 10px;
    background-color: gray;
    border-radius: 50%;
    margin: 0 5px;
    cursor: pointer;
  }

  .active-dot {
    background-color: black;
  }
</style>
