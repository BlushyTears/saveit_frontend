<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Coffee_illustration from "../assets/coffee_illustration.svg";
  import Barista_illustration from "../assets/barista_illustration.svg";
  import Cooking_illustration from "../assets/cooking_illustration.svg";
  import Teamwork_illustration from "../assets/teamwork_illustration.svg";
  import Accordion from "../lib/accordation.svelte";
  import Carusel from "../lib/carusel.svelte";
  import LoadingSpinner from "../lib/loadspinner.svelte";
  import SuccessNotif from "../lib/notification.svelte";
  import LoggedOutNotif from "../lib/notification.svelte";
  import { savedChanges } from "../lib/builderstore";
  import { backend_url } from "../lib/urls";
  import { fade, fly } from 'svelte/transition';
  import { linkname, userImage, isEmailVerified } from "../lib/builderstore";
  import { getCookie } from "../lib/helpers";
  import { setImage } from "../lib/builderstore";

  let showSuccessBar = false;

  function showSuccessNotification() {
    showSuccessBar = true;
  }

  let showLoggedOutNotifBar = false;

  function showLoggedOutNotification() {
    showLoggedOutNotifBar = true;
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

  function takeToRegister(event) {
    event.preventDefault();
    navigate("/register");
  }


  // This onMount checks if the user is logged in upon redirection
  onMount(() => {
    savedChanges.set(true);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Check if the user is already authenticated
    const isAuthenticated = localStorage.getItem("token");

    if (isAuthenticated) {
      // The user is already authenticated, no need to proceed with Google OAuth
      fetchData();
    } else if (code) {
      // User has a Google auth code, proceed with google login
      fetch(backend_url + "/api/googleauth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => {
          // First check if the status code is 401 (Unauthorized)
          // Then, check for other non-OK responses
          if (!res.ok) {
            throw new Error(
              `Failed to exchange code for access token: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          showSuccessNotification();
          localStorage.setItem("token", data); // Make sure to store the token correctly
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((error) => {
          localStorage.removeItem("token");
          console.error("An error occurred:", error);
        });
    } else {
      // Handle the case when neither code nor authentication token is available
      console.log("No authentication code or token found.");
    }
    dispatchEvent(new CustomEvent("set-color", { detail: "#394867" }));
  });

  onMount(async () => {
    savedChanges.set(true);

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const csrfToken = getCookie("csrftoken");
    const verifyUrl =
      backend_url +
      "/api/verify-email-token/?token=" +
      encodeURIComponent(token);

    if (token) {
      try {
        const response = await fetch(verifyUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include CSRF token if needed here, remove it if not necessary for GET
            "X-CSRFToken": csrfToken,
          },
        });

        // Check if the response has content to parse
        const result = response.headers
          .get("content-type")
          ?.includes("application/json")
          ? await response.json()
          : null;

        if (response.ok) {
          // Assuming the API returns a success message and email verification status
          console.log(result.message); // Email verified successfully or some message
          isEmailVerified.set(true); // Update the writable store value
        } else {
          // Handle errors, such as invalid or expired token
          console.error(result.detail);
          isEmailVerified.set(false); // Set to false or handle as appropriate
        }
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    }
  });

  let loading = false;
  // Get the user's name upon login here, since we want to make sure the store $linkname has a value once they nav to /mypage
  // (Normally kinda random to do something like this, hence the note)
  export async function fetchData() {
    const token = localStorage.getItem("token");
    const csrfToken = getCookie(); // Ensure you have a function to get the CSRF token
    if (token) {
      loading = true;
      try {
        const response = await fetch(backend_url + "/api/getname/", {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 401) {
          showLoggedOutNotification();
          localStorage.removeItem("token");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          throw new Error("Invalid or expired token. Token has been removed.");
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // Update the name store
        linkname.set(data.first_name);

        // Update the image store if image data is present
        if (data.image_data && data.image_data.length > 0) {
          userImage.set(`data:image/png;base64,${data.image_data}`);
        }

        // Update the email verified store
        isEmailVerified.set(data.email_verified);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      } finally {
        loading = false;
      }
    } else {
      // Handle scenario when there is no token
      loading = false;
    }
  }

  // Animations section 2
  let originalHeadline = "Minutes Away from Getting Started.";
  let newHeadline = "Build your own customized creator page";
  let headline = originalHeadline;

  let originalDescription = "Faveit is a linksharing site for sharing information such as cooking, drinks and more.";
  let newDescription = "Using our powerful editor you can customize your own page to your liking and express your creativity";
  let description = originalDescription;

  let animateHeadlineOut = false;
  let animateHeadlineIn = false;
  let animateDescriptionOut = false;
  let animateDescriptionIn = false;

  let isOriginalHeadline = true;
  let isOriginalDescription = true;

  function updateHeadline() {
    animateHeadlineOut = true;

    setTimeout(() => {
      headline = isOriginalHeadline ? newHeadline : originalHeadline;
      isOriginalHeadline = !isOriginalHeadline;
      animateHeadlineOut = false;
      animateHeadlineIn = true;

      setTimeout(() => {
        animateHeadlineIn = false;
      }, 1000);
    }, 1000);
  }

  function updateDescription() {
    animateDescriptionOut = true;

    setTimeout(() => {
      description = isOriginalDescription ? newDescription : originalDescription;
      isOriginalDescription = !isOriginalDescription;
      animateDescriptionOut = false;
      animateDescriptionIn = true;

      setTimeout(() => {
        animateDescriptionIn = false;
      }, 1000);
    }, 2000);
  }

  function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function animateHeadline() {
    updateHeadline();
    setTimeout(animateHeadline, randomInterval(7000, 12000)); // Random interval
  }

  function animateDescription() {
    updateDescription();
    setTimeout(animateDescription, randomInterval(10000, 15000)); // Random interval
  }

  onMount(() => {
    setTimeout(animateHeadline, randomInterval(1000, 5000));
    setTimeout(animateDescription, randomInterval(1000, 5000));
  });

</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message="Login succeeded!"
  color="#2dc23c"
  textShadow="#00ff48"
/>

<LoggedOutNotif
  bind:showBar={showLoggedOutNotifBar}
  message="Session expired, please log in again"
  color="#9e9e9e"
  textShadow="#828282"
/>

{#if loading}
  <div class="loading-overlay">
    <p style="margin-right: 0.8rem; margin-top: -5rem;">Fetching data</p>
    <div class="load-spinner-div" style="margin-top: -3.5rem;">
      <LoadingSpinner />
    </div>
  </div>
{:else}
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
        src={Coffee_illustration}
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
          placeholder="favedis.com/YourLinkHere"
        />
        <button class="claimButton">Claim</button>
      </form>
    </div>

    <section class="section2">
      <div class="section2-main">
        <img class="section2-illustration" src={Cooking_illustration} alt="Cooking Illustration" />
        <div class="text-chunk-section2">
          <h2 style="color: white; font-size: calc(3em + 2vw);">Master the Art of Cooking</h2>
          <p style="color: white; font-size: calc(1.4em + 0.5vw);">
            Elevate your culinary skills with our easy-to-follow recipes and expert tips. Perfect for cooks of all levels!
          </p>
      <br>
      <button class="getStartedBtn" on:click={handleSubmit}>Get started for free</button>
        </div>
      </div>
      <br>
    </section>

    
    <section class="section3">
      <div class="section3-main">
        <div class="text-chunk-section3">
          <h2 style="color: white; font-size: calc(3em + 2vw);">Join Our Foodie Community</h2>
          <p style="color: white; font-size: calc(1.4em + 0.5vw);">
            Connect with fellow food enthusiasts, share your culinary adventures, and get inspired!
          </p>
          <br>
          <button class="getStartedBtn" on:click={handleSubmit}>Sign up now</button>
        </div>
        <img class="section3-illustration" src={Teamwork_illustration} alt="Teamwork Illustration" />
      </div>
    </section>

<section class="section4">
  <div class="section4-main">
    <br />
    <img
      class="section4-illustration"
      src={Barista_illustration}
      alt="Coffee Illustration"
    />
    <div class="text-chunk-section4">
      <h2 class:animateOut={animateHeadlineOut} class:animateIn={animateHeadlineIn} style="color: #F2F2F2; font-size: calc(3em + 2vw); font-weight: bold;">
        {headline}
      </h2>
      <p class:animateOut={animateDescriptionOut} class:animateIn={animateDescriptionIn} style="font-size: calc(1.4em + 0.5vw); color: white;">
        {description}
      </p>
      <br>
      <button class="getStartedBtn" on:click={handleSubmit}>Register here</button>
    </div>
  </div>
</section>

    <section class="section5">
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

    <section class="section6">
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
      <h3 style="font-size: 2em; color: white;">
        Terms of Service for Favedis
      </h3>
      <br />

      <div style="max-width: 70%; margin: 0 auto;">
        <p style="font-size: 1em;">
          1. Acceptance of Terms<br />
          By accessing and using this website, users agree to comply with and be
          bound by these terms and conditions.
        </p>
        <br />
        <p style="font-size: 1em;">
          2. Changes to Terms<br />
          We reserve the right to modify or replace these terms at any time. Users
          will be notified of significant changes.
        </p>
        <br />
        <p style="font-size: 1em;">
          3. Use of the Website & User-Generated Content<br />
          Users can create, edit, and share recipes. Users grant Favedis a non-exclusive,
          royalty-free, worldwide license to use, display, and distribute content
          they submit. Prohibited behaviors include posting copyrighted content without
          permission, offensive or harmful content, etc. We reserve the right to
          remove or edit any content at our own discretion.
        </p>
        <br />
        <p style="font-size: 1em;">
          4. Intellectual Property<br />
          All website content, excluding user-generated content, is owned by Favedis
          and protected by copyright laws. Users retain rights to the content they
          create but grant the website the rights mentioned above.
        </p>
        <br />
        <p style="font-size: 1em;">
          5. No Warranty & Limitation of Liability<br />
          The website and its services are provided "as is." We do not guarantee
          the accuracy, completeness, or timeliness of any content. We are not responsible
          for any data loss or corruption, and users are advised to back up their
          recipes/content. To the fullest extent permissible by law, Favedis disclaims
          all warranties and will not be liable for any damages of any kind arising
          from the use of this site.
        </p>
        <br />
        <p style="font-size: 1em;">
          6. Termination<br />
          Conditions under which you can terminate a user's access. Users can terminate
          their account at any time.
        </p>
        <br />
        <p style="font-size: 1em;">
          7. No Refund Policy<br />
          If users choose to purchase any services or features, they acknowledge
          and agree that all sales are final and no refunds will be granted.
        </p>
        <br />
        <p style="font-size: 1em;">
          8. Governing Law<br />
          This ToS and any disputes arising out of it will be governed by the laws
          of the European Union, without regard to its conflict of laws rules.
        </p>
        <br />
        <p style="font-size: 1em;">
          9. Indemnification<br />
          Users agree to defend, indemnify, and hold harmless Favedis and its employees
          from any claims or damages, including legal fees, resulting from their
          use of the website or breach of these terms.
        </p>
        <br />
        <hr />
        <br />

        <p style="font-size: 1em;">Contact: favedis1@gmail.com</p>
        <br />
        <br />
        <br />
      </div>
    </section>
  </main>
{/if}

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

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #394867;
    z-index: 1000;
    font-size: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  /* Section 1: */
/* Section 1 Modified: */
.section1 {
  position: relative;
  flex-direction: row;
  justify-content: space-around;
  display: flex;
  align-items: center;
  height: 80rem;
  background: #394867;
}

/* New ::after element for Section 1 */
.section1::after {
  content: "";
  position: absolute;
  margin-left: 7vw;
  margin-top: 4rem;
  left: 0; /* Starts from the left */
  top: 0;
  width: 40%; /* Adjust the width as needed */
  height: 65%; /* Full height of the section */
  background: #39486700; /* Semi-transparent black cover */
  box-shadow: 14px 14px 14px 14px rgba(0, 0, 0, 0.2);
  z-index: 0; /* To ensure it's above the text */
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

  /* Section 2 START */

  .section2 {
    height: calc(65rem + 10vw);
    background: linear-gradient(180deg, #e49a3f, #ff8c00);
  }

  .section2 p {
    margin: 0 auto;
    font-size: 1.5em;
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
    width: calc(20vw + 20rem);
    height: calc(20vw + 20rem);
    margin-top: 10rem;
    margin-left: 15vw;
  }

  /* Only text contents within the main container */
  .text-chunk-section2 {
  height: 27rem;
  padding: 5rem;
  margin-right: 10vw;
  margin-left: 5vw;
  padding-top: 5rem;
  max-width: 30%;
  margin-top: 15rem;
}


  /* Section 2 END */

  /* Section 3 */
  .section3-main {
    position: relative;
    min-height: 75rem;
    display: flex;
    text-align: center;
  }

  /* Only text contents within the main container */
  .text-chunk-section3 {
    height: 35rem;
    padding: 5rem;
    margin-left: 10vw;
    margin-right: 5vw;
    padding-top: 5rem;
    max-width: 30%;
    margin-top: 15rem;
  }

  .section3 p {
    margin: 0 auto;
    font-size: 1.5em;
    max-width: 35rem;
  }

  /* Only image contents within the main container */
  .section3-illustration {
    margin-top: 15rem;
    width: calc(20vw + 20rem);
    height: calc(20vw + 20rem);
  }

  /* Section 3 END */

  /* Section 4 START */
  .section4 {
    height: calc(65rem + 10vw);
    background-color: #ff8c00;
  }

  .section4 p {
    margin: 0 auto;
    font-size: 1.5em;
    max-width: 35rem;
  }

  /* Includes image and text contents into a container */
  .section4-main {
    /* This adds empty space between section 1 and two 
    otherwise hard to detect why there's space there */
    margin-top: 5rem;
    display: flex;
    text-align: center;
  }

  /* Only image contents within the main container */
  .section4-illustration {
    margin-top: 5rem;
    margin-left: 17vw;
    width: calc(20vw + 20rem);
    height: calc(20vw + 20rem);
  }

  /* Only text contents within the main container */
  .text-chunk-section4 {
    max-width: 30%;
    margin-top: 21rem;
  }

  /* Section 4 Animations */
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animateOut {
    animation: slideOut 1s forwards;
  }

  .animateIn {
    animation: slideIn 1s forwards;
  }

  /* Section 4 END */

  /* Section 5: */
  .section5::after {
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

  .section5 {
    min-height: calc(30vw + 70rem);
    background: linear-gradient(180deg, #758ab6, #394867);
    position: relative;
  }

  /* Section 5 END */

  /* Section 6 START */

  .section6 {
    display: block;
    margin-top: 4rem;
    margin-bottom: 0;
  }

  /* Section 6 END */

  /* FOOTER START */
  .footer {
    color: white;
    background-color: #666666;
    font-size: 1em;
    min-height: 15rem;
    text-align: center;
  }

  /* FOOTER END */


  /* Misc START */

  .getStartedBtn {
    padding: 1rem 3rem;
    font-size: calc(1em + 0.3vw);
    border: none;
    border-radius: 1rem;
    background-color: rgb(231, 134, 207);
    color: white;
    cursor: pointer;
  }

  .getStartedBtn:hover {
    transition: 0.3s;
    background-color: rgb(204, 114, 181);
  }
  /* Misc END */

  /* Media Queries: */
  @media screen and (max-width: 1200px) {
    .section4 {
      height: 75rem;
    }
    .text-chunk-section4 {
      margin: 0 auto;
    }
    .section4-illustration {
      margin: 0 auto;
    }
    .section4-main {
      flex-direction: column;
      justify-content: center;
    }

    .text-chunk-section4 {
      max-width: 80%;
    }

    .section5 {
      min-height: 80rem;
    }

    .section5::after {
      transform: translate(-15%, -5rem);
      border-top: 15rem solid transparent;
    }
  }

  @media screen and (max-width: 1200px) {
  .section2-main {
    flex-direction: column;
    align-items: center;
  }

  .section2-illustration {
    margin-top: 2rem;
    margin-left: 0;
    width: 80%;
  }

  .text-chunk-section2 {
    margin-top: 2rem;
    margin-left: 0;
    max-width: 80%;
  }
}

@media screen and (max-width: 1200px) {
  .section3-main {
    min-height: auto;
    flex-direction: column-reverse;
    align-items: center;
  }

  .section3-illustration {
    margin-left: 0;
    width: 80%;
  }

  .text-chunk-section3 {
    margin-left: 0;
    max-width: 80%;
  }
}
@media screen and (max-width: 1200px) {
  .section6 {
    padding: 2rem;
  }

  .section-4-container {
    min-height: auto;
    padding: 2rem 1rem;
  }
}

@media screen and (max-width: 900px) {
  .section1::after {
    margin-left: 10vw;
    margin-top: -5rem; 
    width: 80%; 
    height: 63%; 
    box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.2);
  }
  
  .section3 {
    height: auto;
  }

  .section1-illustration {
    padding-top: 5rem;
    width: 90%;
  }

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

  .text-chunk-section3 {
    font-size: calc(1em + 1vw);
    margin-top: 2rem;
  }

  .section2-main {
    min-height: 85rem;
  }

  .section3-main {
    min-height: 65rem;
  }

  .section2 {
    height: auto;
  }

  .section2-illustration {
    width: 90%;
  }

  .text-chunk-section2 {
    font-size: calc(1em + 1vw);
  }

  .section5::after {
    border-top: 10rem solid transparent;
    transform: translate(-15%, -5rem);
  }

  .section6 h3 {
    font-size: 2em;
  }
}

</style>
