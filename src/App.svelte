<script>
  import GenPage from "./routes/genpage.svelte";
  import Navbar from "./lib/navbar.svelte";
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
