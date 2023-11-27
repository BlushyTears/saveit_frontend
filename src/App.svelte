<script>
  import { onMount } from "svelte";
  import GenPage from "./routes/genpage.svelte";
  import Navbar from "./lib/navbar.svelte";
  import { savedChanges } from "./lib/builderstore";
  import { backend_url } from "./lib/urls";
  import { fade, fly } from "svelte/transition";
  import {userImage, isEmailVerified} from "./lib/builderstore";
  import { getCookie } from "./lib/helpers";
  import { setImage } from "./lib/builderstore";
  import SuccessNotif from "./lib/notification.svelte";
  import LoggedOutNotif from "./lib/notification.svelte";

  import { inject } from "@vercel/analytics";

  inject();

  // This below is a workaround because svelte routing is pretty bad with anything non-spa routing related
  // A potential solution is to import the navbar in each route individually except for genpage
  const pathToCurrent = {
    "/oauth": "oauth",
    "/navbar": "navbar",
    "/personal": "home",
    "/recoverusername": "home",
    "/recoverpassword": "home",
    "/resetpw": "home",
    "/editor": "home",
    "/register": "home",
    "/login": "home",
    "/policy": "home",
    "/tos": "home",
    "/": "home",
  };

  let current;
  $: {
    let currentUrl = window.location.pathname;
    let matchedPath = Object.keys(pathToCurrent).find((path) =>
      currentUrl.endsWith(path)
    );
    current = matchedPath ? pathToCurrent[matchedPath] : "genpage";
  }

  let showLoggedOutNotifBar = false;

  function showLoggedOutNotification() {
    showLoggedOutNotifBar = true;
  }

  let loading = false;
  // Get the user's name upon login here, since we want to make sure the store linkname has a value once they nav to /mypage
  // (Normally kinda random to do something like this, hence the note)
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

        if (localStorage.getItem("linkname") != data.first_name) {
          localStorage.setItem("linkname", data.first_name);
        }

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

  onMount(async () => {
    fetchData();
  });

</script>

<LoggedOutNotif
  bind:showBar={showLoggedOutNotifBar}
  message="Session expired, please log in again"
  color="#9e9e9e"
  textShadow="#828282"
/>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favedis.svg" />
</svelte:head>

<div class="app-container">
  {#if current === "genpage"}
    <GenPage />
  {:else if current === "navbar" || current === "home"}
    <Navbar />
  {/if}
</div>

<style>
  .app-container {
    width: 100%;
  }
</style>
