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
  // import CookingIllustration from '../assets/cooking_illustration.svelte';
  import Coffee_Illustration from "../assets/coffee_illustration.svg";
  import Example_Page from "../assets/examplepage.png";
  import { onMount } from "svelte";
  import Cooking from "../assets/cooking.jpg";

  // Svelte sucks balls at exporting because it turns everything into a god damn store with objects instead of what you variable you actually assigned to them
  import { backend_url, frontend_url } from "../lib/urls";

  let claimLink = "";

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
    dispatchEvent(new CustomEvent('set-color', { detail: '#212a3e' }));
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
      <h2 style="font-size: calc(2vw + 1.5rem); margin-bottom: 1rem;">
        Share All Your Delicious Dishes with a Single Link.
      </h2>
      <p style="font-size: calc(1em + 0.5vw); ">
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
    <p style="font-size: calc(2em + 1vw); font-weight: bold; margin-top: 3rem;">Get started in literally minutes</p>
    <br />
    <br />
    <div class="main">
      <form on:submit={handleSubmit}>
        <input
          type="text"
          class="claimInput"
          bind:value={claimLink}
          required
          placeholder="faveit/clusteredTomatoes"
        />
        <button type="submit">Claim</button>
      </form>
    </div>
    <br />

    <img
      src={Example_Page}
      alt="example page picture"
      style="height: calc(25vw + 10rem); width: calc(25vw + 10rem); margin: 0 auto; border-radius: 1rem;"
    />

  </section>
  <section class="section3">
    <br />
    <br />
    <br />

    <h3>Explore new foods</h3>
    <p>
      Faveit is a hub of hubs where you explore new food and drink with others
      that have similar preferences to you in order to more effectively find
      what you like: You can follow creators and be notified whenever they
      release a new recipe
    </p>
  </section>

  <section class="section4">
    <br />
    <br />

    <div style="text-align: center; min-height: 60rem; padding-bottom: 1rem;" class="section-4-container">
      <h3 style="font-size: 2em;">Q&A</h3>
      <br>
      <p >
        Faveit is a hub of hubs where you explore new food and drink with others
      </p>
      <br>
      <p >
        Faveit is a hub of hubs where you explore new food and drink with others
      </p>
      <br>
      <p >
        Faveit is a hub of hubs where you explore new food and drink with others
      </p>
      <br>
      <p >
        Faveit is a hub of hubs where you explore new food and drink with others
      </p>
      <br>

    </div>
  </section>

  <section class="footer">
    <br />
    <h3 style="font-size: 2em;">Terms of service</h3>

    <div style="max-width: 50%; margin: 0 auto;">
      <p style="font-size: 1em;">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus aliquam recusandae reiciendis ea, 
        voluptates id, molestiae sequi repellendus voluptatem corrupti modi expedita rerum perferendis pariatur quisquam, totam magni quis facilis 
        nulla nesciunt vitae quod atque quam vero. Praesentium quaerat veniam rem sed aperiam eius accusamus quas, facere exercitationem perspiciatis minima!
      </p>
    </div>
  </section>
</main>

<style>
@font-face {
  font-family: 'Monofonto';
  src: url('/fonts/monofonto rg.otf') format('opentype');
}
    
h1, h2, h3, p, a {
    font-family: 'Monofonto', fallback, sans-serif;
    
  }

  main {
    overflow-x: hidden;
  }
  h3 {
    color: #ffffff;
    margin: 0;
  }
  h2 {
    color: #ffffff;
    margin: 0;
  }
  p {
    color: #ffffff;
    padding: 0;
    margin: 0;
    font-size: 1.5em;
  }

  /* Section 1: */
  .section1 {
    flex-direction: row;
    justify-content: space-around;
    display: flex;
    align-items: center;
    height: 80rem;
  
    background: #212a3e;
  }

  .section1-illustration {
    margin-top: -20rem;
    margin-left: -10vw;
  }

  .text-chunk-section1 {
    margin-top: -20rem;
    width: calc(20vw + 10rem);
  }

  /* Section 1 END */

  /* Section 2: */
  .section2 {
    height: 90rem;
    text-align: center;
    background: linear-gradient(60deg, #96dab3, #6AB187);
    position: relative;
  }

  .section2::after {
  content: "";
  position: absolute;
  width: 150%;
  bottom: 0;
  border-radius: 150% 50%;
  left: 0;
  overflow-x: hidden;
  border-top: 10rem solid transparent;
  background: #FF6B6B;
  transform: translate(-15%, 35%);
}


  .section2 p {
    font-size: 1.2em;
  }

  .section2 .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 5rem;
  }

  .section2 form {
    display: flex;
    align-items: center;
    margin: 0 auto;
    padding: 5rem;
    max-width: 35rem;
    border-radius: 1rem;
  }

  .section2 .claimInput {
    padding: 1rem;
    font-size: 1.2em;
    border: 1px solid #ccc;
    border-radius: 1rem;
    margin-right: 0.5rem;
    width: 100%;
  }

  .section2 button {
    padding: 1rem 3rem;
    font-size: 1.2em;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
  }

  /* Section 2 END */

  /* Section 3: */
  .section3 {
    height: 60rem;
    text-align: center;
    background: #FF6B6B;
  }

  .section3 h3 {
    font-size: 3em;
  }

  .section3 p {
    margin: 0 auto;
    font-size: 1.5em;
    max-width: 35rem;
  }

  /* Section 3 END */

  .footer {
    background-color: #666666;
    font-size: 1em;
    min-height: 10rem;
    text-align: center;
  }


  /* Media Queries: */
  @media screen and (max-width: 800px) {
    .section1 {
      flex-direction: column;
      justify-content: flex-start;
      margin-top: 4rem;
      height: 50rem;
      margin-bottom: 0;
    }
    .section1-illustration {
      margin: 0 auto;
      margin-top: 2rem;
    }

    .text-chunk-section1 {
      margin-top: 0;
    }

    .section2 {
      height: 70rem;
    }

    .section2 form {
      flex-direction: column;
      margin-bottom: 1rem;
      max-width: fit-content;
    }
    .section2 button {
      margin-top: 0.5rem;
    }
  }
</style>
