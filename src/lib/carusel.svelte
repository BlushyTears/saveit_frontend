<script>
  import { onMount, onDestroy } from "svelte";
  import Example_Page3 from "../assets/examplepage1.png"; // Ensure this is a different image

  const images = [
    { src: Example_Page3, alt: "Carousel image 1" },
    { src: Example_Page3, alt: "Carousel image " },
    { src: Example_Page3, alt: "Carousel image 1" },
    { src: Example_Page3, alt: "Carousel image " },
    { src: Example_Page3, alt: "Carousel image 1" },
    { src: Example_Page3, alt: "Carousel image " },
    { src: Example_Page3, alt: "Carousel image 1" },
    { src: Example_Page3, alt: "Carousel image " },
    { src: Example_Page3, alt: "Carousel image 1" },
    { src: Example_Page3, alt: "Carousel image " },
    { src: Example_Page3, alt: "Carousel image 1" },
    { src: Example_Page3, alt: "Carousel image " },
    // Add more images as needed
  ];


</script>

<body>
  <footer class="footer">
    <div class="bd-best">
      <div class="bd-best-list">
        <!-- First set of images -->
        {#each images as image}
          <figure class="bd-best-item">
            <img class="kl_img" src={image.src} alt={image.alt}>
          </figure>
        {/each}

        <!-- Duplicate set for continuous loop -->
        {#each images as image}
          <figure class="bd-best-item">
            <img class="kl_img" src={image.src} alt={image.alt}>
          </figure>
        {/each}

        {#each images as image}
        <figure class="bd-best-item">
          <img class="kl_img" src={image.src} alt={image.alt}>
        </figure>
      {/each}
      </div>
    </div>
  </footer>
</body>

<style>
  /* CSS for the best list and other styles */
  .bd-best {
    height: calc(35rem);
    padding: 0.5rem 0;
    overflow: hidden;
    position: relative;
  }

  .kl_img {
    max-width: 35rem;
    width: calc(60vw + 7rem);
  }

  .bd-best-list {
    animation-duration: 700s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    display: flex;
    left: 0;
    position: absolute;
    top: 1rem;
    -webkit-animation-name: bdBestCarousel;
    animation-name: bdBestCarousel;
  }

  .bd-best-item {
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 16px;
    transition-duration: 85ms;
    transition-property: box-shadow, transform;
  }

  .bd-best-item:hover {
    box-shadow: 0 1em 1em rgba(0,0,0,.1);
    transform: translateY(-.1em);
  }

  .bd-best-list:hover {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }

  @keyframes bdBestCarousel {
    100% {
      transform: translateX(calc(-155% + 3120px));
    }
  }

  .footer {
    padding: 0 0 0 !important;
    background: none;
  }

</style>
