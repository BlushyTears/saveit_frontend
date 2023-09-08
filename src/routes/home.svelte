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
    dispatchEvent(new CustomEvent("set-color", { detail: "#212a3e" }));
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


<main>
  <section class="section1">
    <div class="text-chunk-section1">
      <h2
        style="color: #FFD700; font-size: calc(2.3vw + 3em); margin-bottom: 1rem; line-height: calc(2.2vw + 2.6rem);"
      >
        Share All Your Delicious Dishes with a Single Link.
      </h2>
      <p style="color: #F2F2F2; font-size: calc(1em + 0.5vw); ">
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

    <div style="margin-left: 2vw; margin-right: 2vw; margin-top: 10vw; border-radius: 3rem 0 3rem 0; box-shadow: 0px 0px 20px 5px rgba(255, 255, 255, 0.35);">
      <h1 style="font-size: calc(1em + 3vw); color: #F2F2F2; padding: 1rem;">
        Example Layouts:
      </h1>
    </div>

    <div class="image-container">
      <img src={Example_Page} alt="example page picture" class="image" />
      <img src={Example_Page} alt="example page picture" class="image" />
      <img src={Example_Page} alt="example page picture" class="image" />
    </div>
  </section>
  <section class="section3">
    <br />
    <br />
    <br />

    <p
      style="color: #F2F2F2; font-size: calc(4em + 2vw); font-weight: bold; text-decoration: underline; max-width: 40rem; margin: 0 auto; margin-top: 5rem;"
    >
      Minutes Away from Getting Started.
    </p>
    <p>
      Faveit is a hub of hubs where you explore new food and drink with others
      that have similar preferences to you in order to more effectively find
      what you like: You can follow creators and be notified whenever they
      release a new recipe
    </p>

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
  </section>

  <section class="section4">
    <br />
    <br />

    <div
      style="text-align: center; min-height: 60rem; padding-bottom: 1rem;"
      class="section-4-container"
    >
      <h3 style="font-size: 2em;">Q&A</h3>
      <br />
      <p>
        Faveit is a hub of hubs where you explore new food and drink with others
      </p>
      <br />
      <p>
        Faveit is a hub of hubs where you explore new food and drink with others
      </p>
      <br />
      <p>
        Faveit is a hub of hubs where you explore new food and drink with others
      </p>
      <br />
      <p>
        Faveit is a hub of hubs where you explore new food and drink with others
      </p>
      <br />
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
    width: calc(18vw + 13rem);
  }

  /* Section 1 END */

  /* Section 2: */
  .section2 {
    height: 100rem;
    text-align: center;
    background: linear-gradient(60deg, #96dab3, #6ab187);
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
    background: #FF8888;
    transform: translate(-15%, 35%);
  }

  .section2 p {
    font-size: 1.2em;
  }

  .image-container {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: clamp(70%, calc(65% + 1vw), 80%);
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 0.5rem;
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
    height: 90rem;
    text-align: center;
    background: #FF8888;
  }

  .section3 h3 {
    font-size: 3em;
  }

  .section3 p {
    margin: 0 auto;
    font-size: 1.5em;
    max-width: 35rem;
  }

  .section3 .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 5rem;
  }

  .section3 form {
    display: flex;
    align-items: center;
    margin: 0 auto;
    padding: 5rem;
    max-width: 35rem;
    border-radius: 1rem;
  }

  .section3 .claimInput {
    padding: 1rem;
    font-size: 1.2em;
    border: 1px solid #ccc;
    border-radius: 1rem;
    margin-right: 0.5rem;
    width: 100%;
  }

  .section3 button {
    padding: 1rem 3rem;
    font-size: 1.2em;
    background-color: #6ab187;
    color: white;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
  }

  .section3 button:hover {
    background-color: #6dbe8f;
    box-shadow: 0px 0px 4px 2px rgba(0, 51, 21, 0.253);
    transition: 0.1s ease-in-out;
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
  }

  @media only screen and (min-width: 768px) {
    .image-container {
      flex-direction: row;
      justify-content: space-evenly;
    }
  }
</style>
