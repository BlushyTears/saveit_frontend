<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "../routes/home.svelte";
  import Mypage from "../routes/mypage.svelte";
  import Editor from "../routes/editor.svelte";
  import Login from "../routes/login.svelte";
  import Register from "../routes/register.svelte";
  import NotFound from "../routes/notfound.svelte";
  import Spinner from "../lib/loadspinner.svelte";
  import SuccessNotif from '../lib/notification.svelte';
  import FailedNotif from '../lib/notification.svelte';
  import { currentSetting } from "./navbarStore.js";
  import { onMount } from "svelte";
  import { backend_url } from "../lib/urls";

  let showSuccessBar = false;
  let ShowFailedBar = false;
  
  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    ShowFailedBar = true;
  }

  export let url = "/";
  let isLoggedIn = localStorage.getItem("token") !== null;
  let isLoading = false;

  // Check if navbar is active or no
  let current;
  currentSetting.subscribe((value) => {
    current = value;
  });

  const token = localStorage.getItem("token");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  async function logOutClick(event) {
    event.preventDefault();

    isLoading = true;

    const csrfToken = getCookie("csrftoken");

    try {
      const response = await fetch(backend_url + "/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User logged out successfully:", data);
        showSuccessNotification(); // If you're showing a notification
        setTimeout(() => {
          window.location.reload();
        }, 1500); 
      } else {
        const errorData = await response.json();
        showFailedNotification(); // If you're showing a notification
        setTimeout(() => {
          window.location.reload();
        }, 3500); 
        console.error("Logout failed on server:", errorData);
      }
    } catch (error) {
      showFailedNotification(); // If you're showing a notification
        setTimeout(() => {
          window.location.reload();
        }, 3500); 
      console.error("Other error during logout:", error);
    }
    localStorage.removeItem("token"); // Remove the token from local storage
  }

  // Hamburger menu logic
  let showMenu = false;
  let menuElement; // Reference to the menu DOM element

  onMount(() => {
    const closeMenuOnClickOutside = (event) => {
      if (menuElement && !menuElement.contains(event.target)) {
        showMenu = false;
      }
    };

    document.addEventListener("click", closeMenuOnClickOutside);

    return () => {
      // Cleanup
      document.removeEventListener("click", closeMenuOnClickOutside);
    };
  });

  function toggleMenu(event) {
    showMenu = !showMenu;
    event.stopPropagation(); // Prevent event from reaching the document
  }

  // Manually sets a color on top as the user navigates between diff routes (bad solution)
  let navbarBgColor = "#ffffff";  // default background color for navbar

  function setColor(event) {
    if (event.type === 'set-color') {
      navbarBgColor = event.detail;
    }
  }
  document.addEventListener('set-color', setColor);
  window.addEventListener('set-color', setColor);
</script>

{#if current === "navbar"}
  <nav style="background-color: {navbarBgColor};" class="navbar-container">
    <Router {url}>
      <div class="navbar-wrapper">
        <nav class="navbar">
          <Link to="/" class="nav-link"><a>Home</a></Link>

          <button
            class="hamburger-menu"
            on:click={toggleMenu}
            on:keydown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleMenu();
            }}
          >
            <div />
            <div />
            <div />
          </button>

          <div
            class="nav-links-right {showMenu ? 'show' : ''}"
            bind:this={menuElement}
          >
            {#if isLoggedIn}
              <Link to="/editor" class="nav-link"><a>Editor</a></Link>
              <Link to="/" class="nav-link" on:click={logOutClick}
                ><a>Log out</a></Link
              >
            {/if}

            {#if !isLoggedIn}
              <Link to="/register" class="nav-link"><a>Register</a></Link>
              <Link to="/login" class="nav-link"><a>Login</a></Link>
            {/if}

            <a href="/mypage" class="nav-link"> My page </a>

            <!-- <a class="nav-link" on:click={toggleLayout}><a>Layout</a></a> -->
          </div>
        </nav>
        {#if isLoading}
          <div
            style="display: flex; justify-content: center; margin-top: 1rem;"
            class="spinner"
          >
            <Spinner />
          </div>
        {/if}
      </div>

      <div>
        <Route path="/" component={Home}/>
        <Route path="/editor" component={Editor} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/mypage" component={Mypage} />
        <Route component={NotFound} />
      </div>
    </Router>
  </nav>
{/if}

<SuccessNotif bind:showBar={showSuccessBar} message="Success!" color="#2dc23c" textShadow="#00ff48"/>
<FailedNotif bind:showBar={ShowFailedBar} message="Error" color="#c22d2d" textShadow="#ff0037"/>

<!-- 
Existing main color 1: #212a3e
Existing main color 2: #394867

Lighter blue: #567aa5
Even Lighter blue: #7a9dcb
Complementary warm color: #A57F60
Soft gray: #A9A9A9
Off-white: #F2F2F2
Darker gray: #666666
Contrast color (green): #6AB187
Accent color (coral): #FF6B6B -->

<style>
  .navbar-container {
    margin: 0;
  }

  .navbar-wrapper {
    margin: 0 auto;
    position: sticky;
    top: 1rem;
    z-index: 1000; /* Ensure the navbar is above other content */
  }

  .navbar {
    box-shadow: 0px 0px 18px 2px rgba(0, 0, 0, 0.15);
    background-color: #2a3552;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    text-decoration: none;
    width: calc(5rem + 40%);
    height: 3rem;
    padding: 1.3rem;
    border-radius: 6rem;
    margin: 0 auto;
  }

  .nav-links-right {
    margin-left: 2rem;
    display: flex;
    align-items: center;
  }

  a {
    font-size: 1.3em;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    line-height: 2.5rem;
    margin: 0; /* Remove default margin */
  }

  a:hover {
    color: #A9A9A9;
  }

  /* Hamburger menu styling: */

  .hamburger-menu {
    display: none;
    flex-direction: column;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0);
    border: none;
  }

  .hamburger-menu div {
    width: 25px;
    height: 2px;
    background-color: black;
    margin: 2px 0;
  }

  /* Media query for small screens */
  @media screen and (max-width: 800px) {
    .nav-links-right {
      box-shadow: 0px 0px 18px 2px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      min-width: 25%;
      text-align: center;
      position: absolute;
      top: 102%;
      left: 45%;
      border-radius: 4rem;
      padding: 1rem 0.5rem;
      background-color: #2a3552;
    }

    .nav-links-right.show {
      display: flex;
    }

    .hamburger-menu {
      display: flex;
    }
  }
</style>
