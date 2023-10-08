
<script>
  import { onMount } from "svelte";
  import Example_Page from "../assets/examplepage.png";
  import Example_Page2 from "../assets/examplepage.png";
  let currentIndex = 0;
  let posts;
  let postWidth;
  let initialTouchPos = null;

  const images = [
    { src: Example_Page, alt: "Carusel image could not load" },
    { src: Example_Page2, alt: "Carusel image could not load" },
    { src: Example_Page, alt: "Carusel image could not load" },
    { src: Example_Page2, alt: "Carusel image could not load" },
    { src: Example_Page, alt: "Carusel image could not load" },
    { src: Example_Page2, alt: "Carusel image could not load" },
    { src: Example_Page, alt: "Carusel image could not load" },
  ];

  function calculatePostWidth() {
    const carouselPost = posts.querySelector(".carousel-post");
    if (carouselPost) {
      postWidth = carouselPost.getBoundingClientRect().width;
    }
  }

  function updateCarousel() {
    posts.style.transform = `translateX(-${currentIndex * postWidth}px)`;
  }

  const modulus = images.length;

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

  function onTouchStart(event) {
    initialTouchPos = event.touches[0].clientX;
  }

  function onTouchMove(event) {
    if (!initialTouchPos) return;

    let diff = initialTouchPos - event.touches[0].clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        moveToNext();
      } else {
        moveToPrev();
      }
      initialTouchPos = null;
    }
  }

  onMount(() => {
    setTimeout(() => {
      calculatePostWidth();
      updateCarousel();
   }, 500);  // 500ms delay needed to help the carusel load properly (otherwise it doesn't work)
  });
</script>

<div class="carousel">
  <div bind:this={posts}
       class="carousel-container"
       on:touchstart={onTouchStart}
       on:touchmove={onTouchMove}>
    {#each images as image}
      <div class="carousel-post">
        <img src={image.src} alt={image.alt} />
      </div>
    {/each}
  </div>
  <div class="carousel-controls">
    <button class="nextNPrevBtns" on:click={moveToPrev}>Prev</button>
    <div class="carousel-dots">
      {#each images as _, i}
        <div
          class={i === currentIndex ? "dot active-dot" : "dot"}
          on:click={() => { currentIndex = i; updateCarousel(); }}
          on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();  // Prevent the default action to avoid scrolling the page
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
    <button class="nextNPrevBtns" on:click={moveToNext}>Next</button>
  </div>
</div>

<br>

<style>
  .carousel {
    position: relative;
    width: 90%;
    margin: 0 auto;
    overflow: hidden;
  }

  .carousel-container {
    display: flex;
    transition: transform 0.5s ease-in-out;
  }

  .carousel-post {
    width: 100%;
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

  .carousel-dots {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dot {
    width: 0.6rem;
    height: 0.6rem;
    background-color: gray;
    border-radius: 50%;
    margin: 0 0.3rem;
    cursor: pointer;
  }

  .active-dot {
    background-color: black;
  }

  .nextNPrevBtns {
    font-size: 1.5em;
    border: none;
    cursor: pointer;
    color: white;
    background-color: #3f537c;
    padding: 0.6rem 1.2rem;
    border-radius: 0.5rem;
  }

  .nextNPrevBtns:hover {
    background-color: #4c6597;
    transition: 0.1s ease;
  }

  @media screen and (max-width: 1000px) {
    .carousel {
    width: 90%;
  }
  }
</style>