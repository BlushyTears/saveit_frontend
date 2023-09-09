<!-- Temp color theme:
    #37C84C light green
    #376AC8 light blue
    #C837B3 magenta
    #C89537 gold orange
    #964B00 brown
    #FFFFFF white


    Temp color theme 2:
    #272829 black
    #61677A gray
    #D8D9DA light gray
    #FFF6E0 white
-->

<script>
  import { Router, Link, Route } from "svelte-routing";
  import Coffee_Illustration from "../assets/coffee_illustration.svg";
  import Barista_illustration from "../assets/barista_illustration.svg";
  import Accordion from "../lib/accordation.svelte";
  import Example_Page from "../assets/examplepage.png";
  import Carusel from "../lib/carusel.svelte";
  import { onMount } from "svelte";
  import Cooking from "../assets/cooking.jpg";

  // Svelte sucks balls at exporting because it turns everything into a god damn store with objects instead of what you variable you actually assigned to them
  import { backend_url, frontend_url } from "../lib/urls";

  let claimLink = "";

  export let accordation_title = "";
  export let accordation_content = "";

  function handleSubmit(event) {
    event.preventDefault();
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Maybe add these to post request below at some point if needed
  const token = localStorage.getItem("token");
  const csrfToken = getCookie("csrftoken");

  onMount(() => {
    dispatchEvent(new CustomEvent("set-color", { detail: "#394867" }));
  });

  // This onMount checks if the user is logged in upon redirection
  onMount(() => {
    // DispatchEvent changes color upon load

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // In case the user has multiple google accounts, we need to give it a unique name

    if (code) {
      fetch(backend_url + "/api/googleauth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Failed to exchange code for access tokeroni: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          // Login was successful here
          localStorage.setItem("token", data);
          window.location.reload();
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  });
</script>

<main>
  <section class="section1">
    <div class="text-chunk-section1">
      <h2
        style="color: #FFD700; font-size: calc(2.3vw + 3em); margin-bottom: 1rem; line-height: calc(2.2vw + 2.6rem);"
      >
        Share All Your Delicious Dishes with a Single Link.
      </h2>
      <p
        style="color: #F2F2F2; font-size: calc(1em + 0.5vw); text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.10);"
      >
        Amplify your brand and expand your reach through the power of sharing
        your cherished recipes. Cultivate your passion while simultaneously
        building a thriving audience for the days ahead.
      </p>
    </div>
    <img
      class="section1-illustration"
      src={Coffee_Illustration}
      alt="Coffee Illustration"
      style="width: calc(15vw + 15rem); height: calc(15vw + 15rem);"
      width="500"
      height="500"
    />
  </section>

  <section class="section2">
    <br />

    <div
      style="background-color: #3d8a5c; margin-left: 10vw; margin-right: 10vw; margin-top: 5vw; border-radius: 3rem 0 3rem 0; box-shadow: 0px 0px 10px 4px rgba(255, 255, 255, 0.1); text-align: center;"
    >
      <h1
        style="font-size: calc(1.55em + 3vw); color: #F2F2F2; padding: 0.4rem;"
      >
        Example Layouts:
      </h1>
    </div>
    <br />
    <br />
    <br />

    <Carusel />

  </section>
  <section class="section3">
    <div class="section3-main">
      <br />
      <img
        class="section3-illustration"
        src={Barista_illustration}
        alt="Coffee Illustration"
      />

      <div class="text-chunk-section3">
        <h2
          style="color: #F2F2F2; font-size: calc(3em + 3vw); font-weight: bold; text-decoration: underline;"
        >
          Minutes Away from Getting Started.
        </h2>
        <br />

        <p style="font-size: calc(1.5em + 0.5vw);">
          Faveit is a hub of hubs where you explore new food and drink with
          others that have similar preferences to you in order to more
          effectively find what you like: You can follow creators and be
          notified whenever they release a new recipe
        </p>
      </div>
    </div>

    <div style="display: flex; justify-content: center;">
      <form on:submit={handleSubmit}>
        <input
          type="text"
          class="claimInput"
          bind:value={claimLink}
          required
          placeholder="faveit/clusteredTomatoes"
          style="width: calc(10rem + 5vw);"
        />
        <button type="submit">Claim</button>
      </form>
    </div>
  </section>

  <section class="section4">
    <br />

    <div
      style="text-align: center; min-height: 60rem; padding-bottom: 1rem;"
      class="section-4-container"
    >
      <h3
        style="font-size: 3em; background-color: #212a3e; width: calc(7rem + 4vw); margin: 0 auto; padding: 1rem;"
      >
        Q&A
      </h3>

      <Accordion
        title="What is Faveit?"
        content="Faveit is a hub of hubs where anyone can explore new foods and drinks."
      />
      <Accordion
        title="Can I make money on this?"
        content="Faveit is designed to empower creators to help them build their own personal brand.
         If you can do that, monetizing it will be the easy part."
      />
      <Accordion
        title="How do I get started"
        content="You'll need to create an account (So that your recipes don't get lost),
         then you'll customize your own page and start creating in our intuitive site builder."
      />
      <Accordion
        title="What value do I get as a user who isn't looking to become a food influencer??"
        content="You can use Faveit to discover new food and drinks at a convenience unheard of before.
         You'll also be able to discover things without making an effort. Normally when you want a new 
         recipe or a drink you'd have to search for something specific -- but now you can get notified whenever your
          favorite creators release something new and be able to trust that what they make is to your liking! . We believe
           in the 'Tiktokification era' where things move faster than ever and few people have the time and energy to invest into
            what they shall eat a certain day."
      />
    </div>
  </section>

  <section class="footer">
    <br />
    <h3 style="font-size: 2em;">Terms of service</h3>

    <div style="max-width: 50%; margin: 0 auto;">
      <p style="font-size: 1em;">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus
        aliquam recusandae reiciendis ea, voluptates id, molestiae sequi
        repellendus voluptatem corrupti modi expedita rerum perferendis pariatur
        quisquam, totam magni quis facilis nulla nesciunt vitae quod atque quam
        vero. Praesentium quaerat veniam rem sed aperiam eius accusamus quas,
        facere exercitationem perspiciatis minima!
      </p>
    </div>
  </section>
</main>


<style>
  @font-face {
    font-family: "Monofonto";
    src: url("/fonts/monofonto rg.otf") format("opentype");
  }

  h1,
  h2,
  h3,
  p,
  a {
    font-family: "Monofonto", fallback, sans-serif;
    color: #ffffff;
    margin: 0;
    padding: 0;
  }

  main {
    overflow-x: hidden;
  }

  p {
    font-size: 1.5em;
  }

  /* Section 1: */
  .section1 {
    flex-direction: row;
    justify-content: space-around;
    display: flex;
    align-items: center;
    height: 80rem;
    background: #394867;
  }

  .section1-illustration {
    margin-top: -20rem;
    margin-left: -10vw;
  }

  .text-chunk-section1 {
    margin-top: -20rem;
    width: calc(18vw + 13rem);
  }

  /* Section 1 END */

  /* ASIOUJDOIASJWEOIFSJIOFJSDFSDFWSEG */
  /* Section 2: */
  .section2 {
    min-height: 120rem;
    background: linear-gradient(60deg, #96dab3, #6ab187);
    position: relative;
  }

  .section2::after {
    content: "";
    position: absolute;
    width: 250%;
    bottom: 0;
    border-radius: 50% 30%;
    left: 0;
    overflow-x: hidden;
    border-top: 20rem solid transparent;
    background: #8ea8c3;
    transform: translate(-15%, 55%);
  }

  .image-container {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: clamp(80%, calc(65% + 1vw), 90%);
    margin: 0 auto;
    flex-wrap: wrap;
  }

  .image {
    height: clamp(18rem, calc(5rem + 35vw), calc(15rem + 10vw));
    width: clamp(18rem, calc(5rem + 35vw), calc(15rem + 10vw));
    border-radius: 1rem;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.25);
  }

  .image:hover {
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.45);
    transition: 0.05s ease-in-out;
  }

  /* Section 2 END */

  /* Section 3: */

  .section3 {
    height: calc(85rem + 10vw);
    text-align: center;
    background-color: #8ea8c3;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background: #8ea8c3;
  }
  
  .section3 p {
    margin: 0 auto;
    font-size: 1.5em;
    max-width: 35rem;
  }

  /* Includes image and text contents into a container */
  .section3-main {
    margin-top: 10rem;
    display: flex;
  }

  /* Only image contents within the main container */
  .section3-illustration {
    margin-left: 10vw;
    width: calc(30vw + 20rem);
    height: calc(30vw + 20rem);
  }

  /* Only text contents within the main container */
  .text-chunk-section3 {
    max-width: 50%;
    margin-right: 5rem;
    margin-top: 20rem;
  }

  .section3 form {
    padding: 5rem 10rem;
    border-radius: 0.5rem;
    margin: 0 auto;
  }

  .section3 .claimInput {
    padding: 1rem 2rem;
    font-size: calc(1.2em + 0.5vw);
    border: 1px solid #ccc;
    border-radius: 1rem;
    margin-top: clamp(15rem, calc(3rem + 10%), 5vw);
    margin-right: 0.5rem;
  }

  .section3 button {
    padding: 1rem 2rem;
    font-size: calc(1.2em + 0.5vw);
    background-color: #6ab187;
    color: white;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
  }

  .section3 button:hover {
    background-color: #6dbe8f;
    box-shadow: 0px 0px 4px 2px rgba(0, 51, 21, 0.253);
    transition: 0.1s ease-in-out;
  }

  /* Section 3 END */

  /* Section 4 START */

  .section4 {
    display: block;
    margin-top: 4rem;
    margin-bottom: 0;
  }

  /* Section 4 END */

  /* FOOTER START */
  .footer {
    background-color: #666666;
    font-size: 1em;
    min-height: 10rem;
    text-align: center;
  }

  /* FOOTER END */

  /* Media Queries: */

  @media screen and (max-width: 1200px) {
    .text-chunk-section3 {
      margin: 0 auto;
    }
    .section2 {
      height: 225rem;
    }
    .section3-illustration {
      margin: 0 auto;
    }
    .section3-main {
      flex-direction: column;
      justify-content: center;
    }
  }

  @media screen and (max-width: 800px) {
    .section1 {
      flex-direction: column;
      justify-content: flex-start;
      margin-top: 4rem;
      height: 65rem;
      margin-bottom: 0;
    }
    .section1-illustration {
      margin: 0 auto;
      margin-top: 2rem;
    }

    .text-chunk-section1 {
      margin-top: 0;
    }
    .section3 .claimInput {
      margin-top: 0rem;
    }
  }

</style>


<!-- 
Existing color 1: #212a3e
Existing color 2: #394867

Lighter blue: #567aa5
Even Lighter blue: #7a9dcb
Complementary warm color: #A57F60
Soft gray: #A9A9A9
Off-white: #F2F2F2
Darker gray: #666666
Contrast color (green): #6AB187
Accent color (coral): #FF6B6B -->