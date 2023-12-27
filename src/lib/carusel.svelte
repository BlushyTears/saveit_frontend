<script>
  import { onMount, onDestroy } from "svelte";
  import Example_Page1 from "../assets/examplepage1.webp";
  import Example_Page2 from "../assets/examplepage2.webp";
  import Example_Page3 from "../assets/examplepage3.webp";
  import Example_Page4 from "../assets/examplepage4.webp";
  import Example_Page5 from "../assets/examplepage5.webp";
  import Example_Page6 from "../assets/examplepage6.webp";
  import Example_Page7 from "../assets/examplepage7.webp";
  import Example_Page8 from "../assets/examplepage8.webp";
  import Example_Page9 from "../assets/examplepage9.webp";
  import Example_Page10 from "../assets/examplepage10.webp";
  import Example_Page11 from "../assets/examplepage11.webp";
  import Example_Page12 from "../assets/examplepage12.webp";

  const images = [
    { src: Example_Page2, alt: "Carousel image 2" },
    { src: Example_Page3, alt: "Carousel image 3" },
    { src: Example_Page4, alt: "Carousel image 4" },
    { src: Example_Page5, alt: "Carousel image 5" },
    { src: Example_Page6, alt: "Carousel image 6" },
    { src: Example_Page7, alt: "Carousel image 7" },
    { src: Example_Page8, alt: "Carousel image 8" },
    { src: Example_Page9, alt: "Carousel image 9" },
    { src: Example_Page10, alt: "Carousel image 10" },
    { src: Example_Page11, alt: "Carousel image 11" },
    { src: Example_Page1, alt: "Carousel image 1" },
    { src: Example_Page12, alt: "Carousel image 12" },
    // Add more images as needed
  ];

  let carousel;
  const numImages = images.length;

  onMount(() => {
    const checkEnd = () => {
      if (
        carousel.scrollLeft >
        carousel.scrollWidth - window.innerWidth - 200
      ) {
        // Append the first few images to the end
        images.push(...images.slice(0, 4));
      }
    };

    carousel = document.querySelector(".bd-best-list");
    carousel.addEventListener("scroll", checkEnd);

    return () => {
      carousel.removeEventListener("scroll", checkEnd);
    };
  });
</script>

<body>
  <footer class="footer">
    <div class="bd-best">
      <div class="bd-best-list" bind:this={carousel}>
        <!-- First set of images -->
        {#each images as image}
          <figure class="bd-best-item">
            <img class="kl_img" src={image.src} alt={image.alt} />
          </figure>
        {/each}
      </div>
    </div>
  </footer>
</body>

<style>
  /* CSS for the best list and other styles */
  .bd-best {
    height: calc(30rem);
    padding: 0rem 0rem;
    overflow: hidden;
    position: relative;
  }

  .kl_img {
    max-width: 35rem;
    /* width: calc(60vw + 7rem); */
  }

  .bd-best-list {
    width: auto;
    animation-duration: 600s;
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
    margin-bottom: 0;
    border: 1px solid black;
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 16px;
    transition-duration: 85ms;
    transition-property: box-shadow, transform;
  }

  .bd-best-item:hover {
    transform: translateY(-0.2em);
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

  @media screen and (max-width: 1400px) {
    .bd-best {
      height: calc(22rem);
    }

    .kl_img {
      max-width: 25rem;
    }
  }
</style>
