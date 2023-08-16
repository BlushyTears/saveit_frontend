<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/home.svelte";
  import Layout from "./routes/layout.svelte";
  import Login from "./routes/login.svelte";
  import Register from "./routes/register.svelte";

  import Navbar from "./lib/navbar.svelte";

  import { showNavbar } from './lib/navbarStore.js';

  import { onMount } from "svelte";

  let shouldShowNavbar; 
  showNavbar.subscribe(value => {
    shouldShowNavbar = value;
  });

  onMount(() => {
    let currentUrl = window.location.href;
    shouldShowNavbar = !currentUrl.endsWith('/layout');
  });

</script>

<div class="app-container">

{#if shouldShowNavbar == false}
  <Layout/>
{:else}
  <Navbar />
{/if}

</div>

<style>

.app-container {
  background-color: #37C84C;
}

</style>