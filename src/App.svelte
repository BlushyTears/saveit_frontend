<script>
  import { onMount } from "svelte";
  import GenPage from "./routes/genpage.svelte";
  import Navbar from "./lib/navbar.svelte";

  import { inject } from '@vercel/analytics';
 
  inject();

  let current;

  // This below is a workaround because svelte routing is pretty bad with anything non-spa routing related
  // Sveltekit would've been nice here
  $: {
    let currentUrl = window.location.pathname;

    if (currentUrl.endsWith("/oauth")) {
      current = "oauth";
    } 
    else if (currentUrl.endsWith("/navbar")) {
      current = "navbar";
    } 
    else if (currentUrl.endsWith("/personal")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/recoverusername")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/recoverpassword")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/resetpw")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/editor")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/register")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/login")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/policy")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/tos")) {
      current = "home";
    }
    else if (currentUrl.endsWith("/")) {
      current = "home";
    } else {
      current = "genpage";
    }
}

</script>

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
