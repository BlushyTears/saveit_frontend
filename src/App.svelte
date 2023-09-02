<!-- Temp color theme:
    #37C84C light green
    #376AC8 light blue
    #C837B3 magenta
    #C89537 gold orange
    #964B00 brown
    #FFFFFF white
-->

<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/home.svelte";
  import Layout from "./routes/layout.svelte";
  import Oauth from "./routes/oauth.svelte";
  import Login from "./routes/login.svelte";
  import Register from "./routes/register.svelte";

  import Navbar from "./lib/navbar.svelte";
  import { onMount } from "svelte";

  import { currentSetting } from './lib/navbarStore.js';

  let current; 
  currentSetting.subscribe(value => {
    current = value;
  });

  onMount(() => {
    let currentUrl = window.location.href;

    if (currentUrl.endsWith('/layout')) {
      currentSetting.set('layout');
    } else if (currentUrl.endsWith('/oauth')) {
      currentSetting.set('oauth');
    } else {
      // Set to navbar or any other default behavior
      currentSetting.set('navbar');
    }
  });

</script>

<div class="app-container">

{#if current === 'layout'}
  <Layout />
{:else if current === 'oauth'}
  <Oauth />
{:else if current === 'navbar'}
  <Navbar />
{/if}

</div>

<style>

.app-container {
  width: 100%;
  background-color: #e9e9e9;
}

</style>