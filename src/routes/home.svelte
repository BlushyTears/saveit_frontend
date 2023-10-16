<script>
  import { Router, Link, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Coffee_Illustration from "../assets/coffee_illustration.svg";
  import Barista_illustration from "../assets/barista_illustration.svg";
  import Accordion from "../lib/accordation.svelte";
  import Carusel from "../lib/carusel.svelte";
  import SuccessNotif from "../lib/notification.svelte";
  import { savedChanges } from "../lib/builderstore";
  import { backend_url } from "../lib/urls";

  import { linkname } from "../lib/builderstore";
  import { getCookie } from "../lib/helpers";

  let showSuccessBar = false;

  function showSuccessNotification() {
    showSuccessBar = true;
  }

  let claimLink = "";
  const token = localStorage.getItem("token");
  function handleSubmit(event) {
    event.preventDefault();
    if (token !== null) {
      navigate("/personal");
    } else {
      navigate("/login");
    }
  }

  onMount(() => {
    dispatchEvent(new CustomEvent("set-color", { detail: "#394867" }));
  });

  // This onMount checks if the user is logged in upon redirection
  onMount(() => {
    // We dont have a way of assuming the user didn't wanna save changes if he does leave unsaved, so we set it true upon load instead
    savedChanges.set(true);

    // DispatchEvent changes color upon load
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Try to run fetchData and get username if user is logged in
    fetchData();

    // In case the user has multiple google accounts, we need to give it a unique name
    // Note: if(code) means user has a google auth code for logging in
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
              `Failed to exchange code for access token: ${res.status} ${res.statusText}`
            );
          }
          console.log("response here: ", res);
          return res.json();
        })
        .then((data) => {
          localStorage.setItem("token", data);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((error) => {
          // Show failed notif here, once the error that's always triggered upon succeeded google login is resolved
          console.error("An error occurred:", error);
        });
    }
  });

  // Get the user's name upon login here, since we want to make sure the store $linkname has a value once they nav to /mypage
  // (Normally kinda random to do something like this, hence the note)
  async function fetchData() {
    const token = localStorage.getItem("token");
    const csrfToken = getCookie();
    if (token) {
      try {
        const response = await fetch(backend_url + "/api/getname/", {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("data from username: ", data.data); // Handle or use the data as required
        $linkname = data.data;
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    }
  }
</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message="Login succeeded!"
  color="#2dc23c"
  textShadow="#00ff48"
/>

<main>
  <section class="section1">
    <div class="text-chunk-section1">
      <h2
        style="color: #FFD700; font-size: calc(2vw + 3em); margin-bottom: 1rem; line-height: calc(2.2vw + 2.6rem);"
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
  <div>
    <form on:submit={handleSubmit} class="formBtnClaim">
      <input
        type="text"
        class="claimInput"
        bind:value={claimLink}
        required
        placeholder="favedis/clusteredTomatoes"
      />
      <button class="claimButton" type="submit">Claim</button>
    </form>
  </div>

  <section class="section2">
    <div class="section2-main">
      <br />
      <img
        class="section2-illustration"
        src={Barista_illustration}
        alt="Coffee Illustration"
      />

      <div class="text-chunk-section2">
        <h2
          style="color: #F2F2F2; font-size: calc(3em + 2vw); font-weight: bold;"
        >
          Minutes Away from Getting Started.
        </h2>
        <br />

        <p style="font-size: calc(1.4em + 0.5vw); color: white;">
          Faveit is a hub of hubs where you explore new food and drink with
          others that have similar preferences to you in order to more
          effectively find what you like: You can follow creators and be
          notified whenever they release a new recipe
        </p>
      </div>
    </div>
  </section>

  <section class="section3">
    <!-- Don't remove this "<br>" blindly lol -->
    <br />

    <div
      style=" background-color: #3f537c; margin-left: 10vw; margin-right: 10vw; margin-top: calc(5vw + 15rem); border-radius: 3rem 0 3rem 0; box-shadow: 0px 0px 10px 4px rgba(255, 255, 255, 0.1); text-align: center;"
    >
      <h1
        style="font-weight: 300; font-size: calc(2.5em + 2vw); color: #F2F2F2; padding: 0.4rem;"
      >
        Example Layouts
      </h1>
    </div>
    <br />
    <br />
    <br />
    <Carusel />
  </section>

  <section class="section4">
    <br />

    <div
      style="text-align: center; min-height: 60rem; padding-bottom: 1rem;"
      class="section-4-container"
    >
      <h3
        style="letter-spacing: 0.3rem; font-size: 3em; background-color: #212a3e; width: calc(7rem + 4vw); margin: 0 auto; padding: 1rem; color: white;"
      >
        Q&A
      </h3>
      <Accordion
        title="What is the core concept behind Faveit?"
        content="Faveit serves as a centralized platform where users can explore a diverse range of foods and beverages. It aims to bring culinary enthusiasts and creators together in a community-oriented space."
      />
      <Accordion
        title="Is there an opportunity for creators to monetize their content?"
        content="Absolutely. Faveit is engineered to provide creators with the tools to establish and grow their personal brands. With a strong brand presence, opportunities for monetization become significantly more achievable."
      />
      <Accordion
        title="How can I begin my journey on Faveit?"
        content="To get started, you will need to create an account to ensure the security and accessibility of your recipes. Once registered, you can personalize your profile page and begin crafting content using our user-friendly site builder."
      />
      <Accordion
        title="What benefits does Faveit offer to users who are not aspiring food influencers?"
        content="Faveit provides unparalleled convenience for users interested in discovering new culinary delights. Instead of actively searching for recipes or drinks, you can receive notifications when your favorite creators publish new content. This tailored experience allows you to enjoy new dishes and beverages that align with your taste preferences, all with minimal effort. The platform is designed for today’s fast-paced lifestyle, encapsulating what we refer to as the 'TikTokification era.'"
      />
    </div>
  </section>

  <section class="footer">
    <br />
    <h3 style="font-size: 2em; color: white;">Terms of Service for Favedis</h3>

    <div style="max-width: 70%; margin: 0 auto;">
      <p style="font-size: 1em;">
        1. Acceptance of Terms By accessing and using this website, users agree
        to comply with and be bound by these terms and conditions.
        <br />
        <br />
        2. Changes to Terms We reserve the right to modify or replace these terms
        at any time. Users will be notified of significant changes.
        <br />
        <br />
        3. Use of the Website & User-Generated Content Users can create, edit, and
        share recipes. Users grant Favedis a non-exclusive, royalty-free, worldwide
        license to use, display, and distribute content they submit. Prohibited behaviors:
        posting copyrighted content without permission, offensive or harmful content,
        etc. We reserve the right to remove or edit any content at our own discretion.
        <br />
        <br />
        4. Intellectual Property All website content, excluding user-generated content,
        is owned by Favedis and protected by copyright laws. Users retain rights
        to the content they create but grant the website the rights mentioned above.
        <br />
        <br />
        5. No Warranty & Limitation of Liability The website and its services are
        provided "as is." We do not guarantee the accuracy, completeness, or timeliness
        of any content. We are not responsible for any data loss or corruption, and
        users are advised to back up their recipes/content. To the fullest extent
        permissible by law, Favedis disclaims all warranties and will not be liable
        for any damages of any kind arising from the use of this site.
        <br />
        <br />
        6. Termination Conditions under which you can terminate a user's access.
        Users can terminate their account at any time.
        <br />
        <br />
        7. No Refund Policy If users choose to purchase any services or features,
        they acknowledge and agree that all sales are final and no refunds will be
        granted.
        <br />
        <br />
        8. Governing Law This ToS and any disputes arising out of it will be governed
        by the laws of the European Union, without regard to its conflict of laws
        rules.
        <br />
        <br />
        9. Indemnification Users agree to defend, indemnify, and hold harmless Favedis
        and its employees from any claims or damages, including legal fees, resulting
        from their use of the website or breach of these terms.
        <br />
        <br />
        10. Contact Information
      </p>
      <br />
      <br />
    </div>
  </section>
</main>

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

<style>
  @font-face {
    font-family: "Monofonto";
    src: url("../assets/monofontorg.otf") format("opentype");
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

  /* Claim link button css */
  .formBtnClaim {
    display: flex;
    justify-content: center;
    border-radius: 0.5rem;
  }

  .claimInput {
    width: calc(3rem + 20vw);
    padding: 1rem 2rem;
    font-size: calc(1.2em + 0.5vw);
    border: 1px solid #ccc;
    border-radius: 1rem;
  }

  .claimButton {
    margin-left: 0.2rem;
    padding: 1rem 2rem;
    font-size: calc(1.2em + 0.5vw);
    background-color: #3c9961;
    color: white;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
  }

  .claimButton:hover {
    background-color: #2fb966;
    transition: 0.1s ease-in-out;
  }

  /* Section 1 END */

  /* Section 2: */

  .section2 {
    height: calc(65rem + 10vw);
    background-color: #ff8c00;
  }

  /* Curvy boii */
  .section3::after {
    content: "";
    position: absolute;
    width: 150%;
    top: 0;
    border-radius: 150% 150%;
    left: 0;
    overflow-x: hidden;
    border-top: 20rem solid transparent;
    background: #ff8c00;
    transform: translate(-15%, -10rem);
  }

  .section2 p {
    margin: 0 auto;
    font-size: 1.5em;
    max-width: 35rem;
  }

  /* Includes image and text contents into a container */
  .section2-main {
    /* This adds empty space between section 1 and two 
    otherwise hard to detect why there's space there */
    margin-top: 5rem;
    display: flex;
    text-align: center;
  }

  /* Only image contents within the main container */
  .section2-illustration {
    margin-top: 15rem;
    margin-left: 17vw;
    width: calc(20vw + 20rem);
    height: calc(20vw + 20rem);
  }

  /* Only text contents within the main container */
  .text-chunk-section2 {
    max-width: 30%;
    margin-top: 21rem;
  }

  /* Section 2 END */

  /* ASIOUJDOIASJWEOIFSJIOFJSDFSDFWSEG */
  /* Section 2: */
  .section3 {
    min-height: calc(30vw + 70rem);
    background: linear-gradient(180deg, #758ab6, #394867);
    position: relative;
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
    color: white;
    background-color: #666666;
    font-size: 1em;
    min-height: 15rem;
    text-align: center;
  }

  /* FOOTER END */

  /* Media Queries: */

  @media screen and (max-width: 1200px) {
    .section2 {
      height: 75rem;
    }
    .text-chunk-section2 {
      margin: 0 auto;
    }
    .section2-illustration {
      margin: 0 auto;
    }
    .section2-main {
      flex-direction: column;
      justify-content: center;
    }

    .text-chunk-section2 {
      max-width: 80%;
    }

    .section3 {
      min-height: 80rem;
    }

    .section3::after {
      transform: translate(-15%, -5rem);
      border-top: 15rem solid transparent;
    }
  }

  @media screen and (max-width: 800px) {
    .section1 {
      flex-direction: column;
      justify-content: flex-start;
      margin-top: 4rem;
      height: 65rem;
    }
    .section1-illustration {
      margin: 0 auto;
      margin-top: 2rem;
    }
    .text-chunk-section1 {
      margin-top: 0;
    }

    .section3::after {
      border-top: 10rem solid transparent;
      transform: translate(-15%, -5rem);
    }
  }
</style>
