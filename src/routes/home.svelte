<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import section1_illustration from "../assets/section1_illustration.svg";
  import Barista_illustration from "../assets/barista_illustration.svg";
  import Cooking_illustration from "../assets/cooking_illustration.svg";
  import Teamwork_illustration from "../assets/teamwork_illustration.svg";

  import Example_Page1 from "../assets/examplepage2.webp";
  import Example_Page3 from "../assets/examplepage5.webp";
  import Example_Page2 from "../assets/examplepage11.webp";

  import Accordion from "../lib/accordation.svelte";
  import Carusel from "../lib/carusel.svelte";
  import LoadingSpinner from "../lib/loadspinner.svelte";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import LoggedOutNotif from "../lib/notification.svelte";
  import { savedChanges } from "../lib/builderstore";
  import { backend_url } from "../lib/urls";
  import { fade, fly } from "svelte/transition";
  import { linkname, userImage, isEmailVerified } from "../lib/builderstore";
  import { getCookie } from "../lib/helpers";
  import TwitterLogo from "../assets/twitter_logo.png";
  import YoutubeLogo from "../assets/youtube_logo.png";
  import InstagramLogo from "../assets/instagram_logo.png";
  
  let showLoggedOutNotifBar = false;
  let showSuccessBar = false;
  let showFailedBar = false;
  let notificationMsg = "";

  function showSuccessNotification(_msg) {
    notificationMsg = _msg;
    showSuccessBar = true;
  }

  function showFailedNotification(_msg) {
    notificationMsg = _msg;
    showFailedBar = true;
  }

  function showLoggedOutNotification(_msg) {
    notificationMsg = _msg;
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

  function navigateToPrivacyPolicy(event) {
    event.preventDefault();
    navigate("/policy");
  }

  function navigateToGuestEditor(event) {
    event.preventDefault();
    navigate("/guesteditor");
  }

  function navigateToTOS(event) {
    event.preventDefault();
    navigate("/tos");
  }

  export async function fetchData() {
    const token = localStorage.getItem("token");
    const csrfToken = getCookie(); // Ensure you have a function to get the CSRF token
    if (token) {
      loading = true;
      try {
        const response = await fetch(backend_url + "/api/getuserdetails/", {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 401) {
          showLoggedOutNotification("Session expired");
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

        if (localStorage.getItem("linkname") != data.first_name) {
          localStorage.removeItem("linkname");
          localStorage.setItem("linkname", data.first_name);
        }

        userImage.set(data.profile_image_url);

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

  // This onMount checks if the user is logged in upon redirection
  onMount(() => {
    savedChanges.set(true);
    fetchData();

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Check if the user is already authenticated
    const isAuthenticated = localStorage.getItem("token");

    if (isAuthenticated) {
      // The user is already authenticated, no need to proceed with Google OAuth
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
          showSuccessNotification("Logged in");
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

    setTimeout(animateHeadline, randomInterval(1000, 5000));
    setTimeout(animateDescription, randomInterval(1000, 5000));

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const csrfToken = getCookie("csrftoken");
    const verifyUrl =
      backend_url +
      "/api/verify-email-token/?token=" +
      encodeURIComponent(token);

    if (token) {
      loading = true;
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
          showSuccessNotification("E-mail verified");
          isEmailVerified.set(true);
        } else {
          isEmailVerified.set(false);
          showFailedNotification("Error");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    }
  });

  let loading = false;

  // Animations section 2
  let originalHeadline = "Minutes Away from Getting Started";
  let newHeadline = "Build your own customized creator page";
  let headline = originalHeadline;

  let originalDescription =
    "Favedis is a linksharing site for sharing information such as cooking, drinks and more with 1 simple link in bio";
  let newDescription =
    "Using our powerful editor you can customize your own bio page to your liking and express your creativity";
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
      description = isOriginalDescription
        ? newDescription
        : originalDescription;
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
</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message={notificationMsg}
  color="#1daa2bcc"
  textShadow="#3ddb6a"
/>
<FailedNotif
  bind:showBar={showFailedBar}
  message={notificationMsg}
  color="#b42727ce"
  textShadow="#e0113e"
/>

<LoggedOutNotif
  bind:showBar={showLoggedOutNotifBar}
  message={notificationMsg}
  color="#a0a0a0b9"
  textShadow="#4f4f4f"
/>

{#if loading}
  <div class="loading-overlay">
    <p></p>
    <!-- Don't remove this p tag, or else the loading screen doesn't appear -->
  </div>
{:else}
  <main>
    <section class="section1">
      <div class="text-chunk-section1">
        <h2
          style="color: #FFD700; font-size: calc(2vw + 3em); margin-bottom: 1rem; line-height: calc(2.2vw + 2.6rem);"
        >
          Share Your Amazing Content With A Single Link In Bio.
        </h2>
        <p
          style="color: #F2F2F2; font-size: calc(1em + 0.3vw); text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.10);"
        >
          Our goal is for you to get your powerful link in bio set up fast!
           Build a following, monetize your links and become part of a wider network.
        </p>
      </div>

      <div class="section1-illustration">

        <br />
        <br />

        <div class="image-container">
          <a href="https://www.favedis.com/worldtravel">
            <img class="image1" src={Example_Page1} alt="Worldtravel's Favedis page" />
          </a>
          <a href="https://www.favedis.com/jake">
            <img class="image2" src={Example_Page2} alt="Jake's Favedis page" />
          </a>
          <a href="https://www.favedis.com/masterchef">
            <img class="image3" src={Example_Page3} alt="Masterchef's Favedis page" />
          </a>
        </div>
      </div>
    </section>

  <div style="background: #394867; margin-left: 0;" class="formBtnClaim">
      <button class="guestEditorBtn" on:click={navigateToGuestEditor}
      >Try Our Guest Editor</button>
  </div>

    <section class="section2">
      <div class="section2-main">
        <img
          class="section2-illustration"
          src={Cooking_illustration}
          alt="Cooking Illustration"
        />
        <div class="text-chunk-section2">
          <h2 style="color: white; font-size: calc(3em + 2vw);">
            Share your bio link within a minute.
          </h2>
          <br />
          <p style="color: white; font-size: calc(1.4em + 0.5vw);">
            Share your workout routies, Runescape money-making guides, travel guides and anything that's hard to put in a 60-second video replaced with a bio link.
          </p>
          <br />
          <div>
            <form on:submit={handleSubmit} class="formBtnClaim">
              <input
                type="text"
                class="claimInput"
                bind:value={claimLink}
                required
                placeholder="favedis.com/YourLinkHere"
              />
              <br />
              <button class="claimButton">Claim</button>
            </form>
          </div>
        </div>
      </div>
      <br />
    </section>

    <section class="section3">
      <div class="section3-main">
        <div class="text-chunk-section3">
          <h2 style="color: white; font-size: calc(3em + 2vw);">
            Join our Community
          </h2>
          <p style="color: white; font-size: calc(1.4em + 0.5vw);">
            Favedis isn't just for creators to share their bio links. Casual users can also discover new content from popular creators!
          </p>
          <br />
          <button class="getStartedBtn" on:click={handleSubmit}
            >Sign up now</button
          >
        </div>
        <img
          class="section3-illustration"
          src={Teamwork_illustration}
          alt="Teamwork Illustration"
        />
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
          <h2
            class:animateOut={animateHeadlineOut}
            class:animateIn={animateHeadlineIn}
            style="color: #F2F2F2; font-size: calc(3em + 2vw); font-weight: bold;"
          >
            {headline}
          </h2>
          <p
            class:animateOut={animateDescriptionOut}
            class:animateIn={animateDescriptionIn}
            style="font-size: calc(1.4em + 0.5vw); color: white;"
          >
            {description}
          </p>
          <br />
          <button class="getStartedBtn" on:click={handleSubmit}
            >Register here</button
          >
        </div>
      </div>
    </section>

    <section class="section5">
      <!-- Don't remove this "<br>" blindly -->
      <br />

      <div
        style=" background-color: #3f537c; margin-left: 10vw; margin-right: 10vw; margin-top: calc(5vw + 15rem); border-radius: 3rem 0 3rem 0; box-shadow: 0px 0px 10px 4px rgba(255, 255, 255, 0.1); text-align: center;"
      >
        <h1
          style="font-weight: 300; font-size: calc(3em + 2vw); color: #F2F2F2; padding: 0.5rem 1rem;"
        >
          Examples Pages
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
          title="What is the core concept behind Favedis?"
          content="Favedis serves as a centralized platform where users can explore a diverse range of foods and beverages. It aims to bring culinary enthusiasts and creators together in a community-oriented space. In some ways it can be seen as an alternative to popular bio linking services."
        />
        <Accordion
          title="Is there an opportunity for creators to monetize their content?"
          content="Absolutely. Favedis is engineered to provide creators with the tools to establish and grow their personal brands. With a strong brand presence, opportunities for monetization become significantly more achievable."
        />
        <Accordion
          title="How can I begin my journey on Favedis?"
          content="To get started, you will need to create an account to ensure the security and accessibility of your recipes. Once registered, you can personalize your profile page and begin crafting content using our user-friendly site builder."
        />
        <Accordion
          title="What benefits does Favedis offer to users who are not aspiring food influencers?"
          content="Favedis provides unparalleled convenience for users interested in discovering new culinary delights. Instead of actively searching for recipes or drinks, you can receive notifications when your favorite creators publish new content. This tailored experience allows you to enjoy new dishes and beverages that align with your taste preferences, all with minimal effort. The platform is designed for today’s fast-paced lifestyle, encapsulating what we refer to as the 'TikTokification era.'"
        />
        <Accordion
          title="How would Favedis compare to other similar link-based sites"
          content="Favedis is unique in that we are the first ever information-based linksharing site. Other sites like linktree are more for sharing social media links, whilst we tapped into information sharing. You can still put your social media links such as Tiktok, Twitter and more on our site if you want."
        />
        <Accordion
          title="Where does Favedis originate from?"
          content="Favedis, originally was Saveit, then Faveit or Fave it, then it transformed gradually from Fave dis to Favedis. Mostly it's because a bit more playful but the domain name was also cheaper."
        />
      </div>
    </section>

    <section class="footer">
      <br />
      <div>
        <button class="hrefBtn" on:click={navigateToPrivacyPolicy}
          >Privacy Policy</button
        >
      </div>
      <div>
        <button class="hrefBtn" on:click={navigateToTOS}
          >Terms of Service</button
        >
      </div>
      <br />

      <div class="socials-div">
        <p>Follow us:</p>
        <a
          href="https://twitter.com/favedis1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={TwitterLogo}
            style="height: 1.8rem; width: auto;"
            alt="Twitter biolink"
          />
        </a>

        <a
        href="https://www.youtube.com/channel/UCyuhXWik6C5nb9uh_2lcExw"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={YoutubeLogo}
          style="height: 1.8rem; width: auto;"
          alt="Youtube biolink"
        />
      </a>

      <a
      href="https://www.instagram.com/favedis1/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={InstagramLogo}
        style="height: 1.8rem; width: auto;"
        alt="Youtube biolink"
      />
    </a>
      </div>
      
      <br />

      <p>Contact: support@favedis.com</p>
    </section>
  </main>
{/if}

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
    font-size: 2.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  .loading-overlay p {
    position: relative;
    margin: 0;
    padding: 10px;
    width: fit-content;
    color: white;
    background: transparent;
    border-radius: 1px;
    overflow: hidden;
    display: flex; /* Add flex display */
    justify-content: center; /* Center content horizontally */
    align-items: center; /* Center content vertically */
  }
  .loading-overlay p::before {
    content: "";
    position: absolute;
    top: -99%;
    left: -99%; /* Adjust position */
    width: 300%;
    height: 300%; /* Adjust size */
    background-image: conic-gradient(
      rgb(196, 196, 196) 20deg,
      transparent 120deg
    );
    border-radius: 5px;
    animation: rotate 1.5s linear infinite;
    z-index: -1;
  }

  .loading-overlay p::after {
    content: "Fetching data";
    width: 90%;
    height: 5rem;
    padding: 2rem;
    background-color: #394867;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
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
    margin-top: -30rem;
    margin-left: -5vw;
  }

  .text-chunk-section1 {
    margin-top: -20rem;
    width: calc(18vw + 13rem);
  }

  .image-container {
    position: relative;
    margin: 0 auto;
    height: calc(10vw + 10rem); /* Adjust as needed */
    width: calc(33vw + 5rem); /* Adjust based on your image sizes */
  }

  .image-container img {
    border: 1px solid rgb(92, 92, 92);
    box-shadow: 14px 14px 14px 14px rgba(0, 0, 0, 0.03);
    position: absolute;
    max-width: 80%;
    height: auto;
    cursor: pointer;
    transition: 0.1s;
  }

  .image-container img:hover {
    transform: translateY(-0.5rem);
  }

  .image1 {
    left: 0;
    z-index: 1;
  }

  .image2 {
    left: calc(1vw + 4rem);
    z-index: 2;
  }

  .image3 {
    left: calc(2vw + 8rem);
    z-index: 3;
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

  .guestEditorBtn {
    padding: 1rem 2rem;
    font-size: calc(1.3em + 0.7vw);
    background-color: #8f8f8f;
    color: white;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
  }

  .guestEditorBtn:hover {
    background-color: #7a7a7a;
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
    margin-top: 13rem;
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
    margin-top: 9rem;
  }

  .section3 p {
    margin: 0 auto;
    font-size: 1.5em;
    max-width: 35rem;
  }

  /* Only image contents within the main container */
  .section3-illustration {
    margin-top: 5rem;
    width: calc(50rem);
    height: calc(50rem);
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

  .hrefBtn {
    color: white;
    font-size: 1.4em;
    padding: 0.3rem;
    border: none;
    background: none;
    cursor: pointer;
  }

  .hrefBtn:hover {
    color: rgb(201, 201, 201);
  }

  .socials-div {
    gap: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .socials-div img:hover {
    transition: transform 0.15s;
    transform: scale(1.1);
  }

  .socials-div p {
    margin-right: 10px;
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
    }

    .text-chunk-section2 {
      max-width: 80%;
      margin-top: 0;
    }
  }

  @media screen and (max-width: 1400px) {
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
  @media screen and (max-width: 1400px) {
    .section6 {
      padding: 2rem;
    }

    .section-4-container {
      min-height: auto;
      padding: 2rem 1rem;
    }
  }

  @media screen and (max-width: 1200px) {
    .section1::after {
      padding-right: 1rem;
      padding-left: 1rem;
      margin-top: -5rem;
      width: 80%;
      height: 63%;
      box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.2);
    }

    .section1-illustration {
      padding-top: 10rem;
      width: 90%;
      margin: 0 auto;
      margin-top: 2rem;
    }

    .guestEditorBtn {
      padding: 1rem 1.5rem;
      font-size: calc(1.2em + 0.5vw);
    }

    .image-container {
      /* We use a hard-coded centering solution due to image overlaps otherwise causing misalignment */
      margin-right: calc(5.5rem + 8vw);
    }

    .section1 {
      flex-direction: column;
      justify-content: flex-start;
      margin-top: 10rem;
      height: 65rem;
    }

    .text-chunk-section1 {
      margin-top: 0;
    }

    .section2-main {
      min-height: 85rem;
    }

    .section2 {
      min-height: 95rem;
      height: auto;
    }

    .section2-illustration {
      width: 90%;
    }

    .text-chunk-section2 {
      font-size: calc(1em + 1vw);
    }

    .section3 {
      height: auto;
    }

    .text-chunk-section3 {
      font-size: calc(1em + 1vw);
      margin-top: -5rem;
    }

    .section3-main {
      min-height: 65rem;
    }

    .section3-illustration {
      margin-top: -10rem;
    }

    .text-chunk-section3 {
      margin-top: -18rem;
    }

    .section5::after {
      border-top: 10rem solid transparent;
      transform: translate(-15%, -5rem);
    }

    .section6 h3 {
      font-size: 2em;
    }
  }

  @media screen and (max-width: 800px) {
    .section-4-container {
      min-height: auto;
      padding: 2rem 1rem;
    }
    .section6 {
      padding: 2rem;
    }
  }
</style>
