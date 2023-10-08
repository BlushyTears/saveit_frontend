<script>
  import GenPage from "./routes/genpage.svelte";
  import Navbar from "./lib/navbar.svelte";

  let current;

  $: {
    let currentUrl = window.location.pathname;

    if (currentUrl.endsWith("/oauth")) {
      current = "oauth";
    } 
    else if (currentUrl.endsWith("/navbar")) {
      current = "navbar";
    } 
    else if (currentUrl.endsWith("/personal")) {
      current = "personal";
    }
    else if (currentUrl.endsWith("/editor")) {
      current = "editor";
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
  {:else if current === "navbar" || current === "home" || current === "personal" || current === "editor"}
    <Navbar />
  {/if}
</div>

<style>
  .app-container {
    width: 100%;
  }
</style>
