<script>
  import { Router, Route, navigate } from "svelte-routing";
  import Home from "../routes/home.svelte";
  import Editor from "../routes/editor.svelte";
  import Login from "../routes/login.svelte";
  import Register from "../routes/register.svelte";
  import Recoverpw from "../routes/recoverpw.svelte";
  import Recoverusername from "../routes/recoverusername.svelte";
  import SubmitPwReset from "../routes/submitpwreset.svelte";
  import Personal from "../routes/personal.svelte";
  import NotFound from "../routes/notfound.svelte";
  import Spinner from "../lib/loadspinner.svelte";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import { currentSetting } from "./navbarStore.js";
  import { onMount } from "svelte";
  import { backend_url } from "../lib/urls";

  import FavedisLogo from '../assets/favedis.png';

  import { linkname, savedChanges } from "../lib/builderstore";

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

  async function logOutClick(event) {
  event.preventDefault();

  // Display a confirmation prompt to the user
  const shouldLogOut = window.confirm("Are you sure you want to log out?");
  
  if (!shouldLogOut) {
    // The user clicked Cancel, so do not proceed with logout
    return;
  }

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
      showSuccessNotification(); // If you're showing a notification
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      navigate("/");
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

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  async function handleMyPageNavigation(event) {
  event.preventDefault();
  const targetPath = $linkname || "/genpage";

  // Check if there are unsaved changes
  if (!$savedChanges) {
    const userConfirmation = window.confirm(
      "You have unsaved genpage changes. Are you sure you want to leave?"
    );
    if (!userConfirmation) {
      return;
    }
  }

  try {
    console.log("Fetched Path:", targetPath); // Debugging
    handleNavigation(targetPath);
    window.location.reload();
  } catch (err) {
    console.error("Error fetching the path:", err);
  }
}

  // Hamburger menu logic
  let showMenu = false;
  let menuElement; // Reference to the menu DOM element

  function handleNavigation(path) {
  // Check if the current path is not one of the specified routes where we want to warn the user
  const shouldWarnOnExit = ["/personal", "/editor", '/'].includes(path);

  // Only trigger the unsaved changes warning if we're on a path that should warn
  if (shouldWarnOnExit && !$savedChanges) {
    const userConfirmation = window.confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );
    if (!userConfirmation) {
      return; // Prevent navigation if the user cancels
    }
  }

  // Your existing settings update logic
  if (path === "/mypage") {
    currentSetting.set("mypage");
  } else if (path === "/oauth") {
    currentSetting.set("oauth");
  } else {
    currentSetting.set("navbar");
  }

  // Proceed with the navigation
  navigate(path);
}


  onMount(() => {
    let currentUrl = window.location.pathname;

    // Without these checkers, the user is navigated to /home even if url ends with /personal for instance

    if (currentUrl.startsWith("/resetpw/")) {
    const segments = currentUrl.split('/');
    if (segments.length >= 4) { // Check if the URL has the required segments
      const userId = segments[2];
      const token = segments[3];
      navigate(`/resetpw/${userId}/${token}`); // Navigate using the full dynamic path
    }
  }

    if (currentUrl.endsWith("/editor")) {
      navigate("/editor");
    } 
    else if (currentUrl.endsWith("/personal")) {
      navigate("/personal");
    } 
    else if (currentUrl.endsWith("/recoverusername")) {
      navigate("/recoverusername");
    } 
    else if (currentUrl.endsWith("/recoverpassword")) {
      navigate("/recoverpassword");
    } 
    else if (currentUrl.endsWith("/login")) {
      navigate("/login");
    } 
    else if (currentUrl.endsWith("/register")) {
      navigate("/register");
    } 


    document.addEventListener("navigate", handleNavigation);

    const closeMenuOnClickOutside = (event) => {
      if (menuElement && !menuElement.contains(event.target)) {
        showMenu = false;
      }
    };

    // When pressing outside of hamburger menu this code closes it
    document.addEventListener("click", closeMenuOnClickOutside);
  });

  function toggleMenu(event) {
    showMenu = !showMenu;
    event.stopPropagation(); // Prevent event from reaching the document
  }

  // Manually sets a color on top as the user navigates between diff routes (bad solution)
  let navbarBgColor = "#ffffff"; // default background color for navbar

  function setColor(event) {
    if (event.type === "set-color") {
      navbarBgColor = event.detail;
    }
  }
  document.addEventListener("set-color", setColor);
  window.addEventListener("set-color", setColor);
</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message="Success!"
  color="#2dc23c"
  textShadow="#00ff48"
/>
<FailedNotif
  bind:showBar={ShowFailedBar}
  message="Error"
  color="#c22d2d"
  textShadow="#ff0037"
/>

{#if current === "navbar"}
  <nav style="background-color: {navbarBgColor};" class="navbar-container">
    <Router {url}>
      <div class="navbar-wrapper">
        <nav class="navbar">
          <a
            href="javascript:void(0);"
            on:click|preventDefault={() => handleNavigation("/")}
            on:keydown={(e) => {
              if (e.key === "Enter") handleNavigation("/");
            }}
            tabindex="0"
            role="button"
            class="nav-link"
          >
          <img src={FavedisLogo} alt="FaveDis Logo" class="main-logo" />
        </a>

          <button
            class="hamburger-menu"
            on:click={toggleMenu}
            on:keydown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleMenu();
            }}
          >
            <!-- Empty divs needed for hamburger menu to appear when scaling down screen -->
            <div />
            <div />
            <div />
          </button>

          <div
            class="nav-links-right {showMenu ? 'show' : ''}"
            bind:this={menuElement}
          >
            {#if isLoggedIn}
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click|preventDefault={() => handleNavigation("/personal")}
                on:keydown={(e) => {
                  if (e.key === "Enter") handleNavigation("/personal");
                }}
                tabindex="0"
                role="button"
                class="nav-link"
              >
                Personal
              </a>

              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click|preventDefault={() => handleNavigation("/editor")}
                on:keydown={(e) => {
                  if (e.key === "Enter") handleNavigation("/editor");
                }}
                tabindex="0"
                role="button"
                class="nav-link"
              >
                Editor
              </a>

              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click|preventDefault={logOutClick}
                on:keydown={(e) => {
                  if (e.key === "Enter") logOutClick();
                }}
                tabindex="0"
                role="button"
                class="nav-link"
              >
                Log out
              </a>

              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click|preventDefault={handleMyPageNavigation}
                on:keydown={(e) => {
                  if (e.key === "Enter") handleMyPageNavigation(e);
                }}
                tabindex="0"
                role="button"
                class="nav-link"
              >
                My page
              </a>
            {/if}

            {#if !isLoggedIn}
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click|preventDefault={() => handleNavigation("/register")}
                on:keydown={(e) => {
                  if (e.key === "Enter") handleNavigation("/register");
                }}
                tabindex="0"
                role="button"
                class="nav-link"
              >
                Register
              </a>

                            <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click|preventDefault={() => handleNavigation("/login")}
                on:keydown={(e) => {
                  if (e.key === "Enter") handleNavigation("/login");
                }}
                tabindex="0"
                role="button"
                class="nav-link"
              >
                Login
              </a>
            {/if}
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
        <Route path="/" component={Home} />
        <Route path="/personal" component={Personal} />
        <Route path="/editor" component={Editor} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/recoverusername" component={Recoverusername} />
        <Route path="/recoverpassword" component={Recoverpw} />
        <Route path="resetpw/:userId/:token" component={SubmitPwReset} />
        <Route component={NotFound} />
      </div>
    </Router>
  </nav>
{/if}

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

  .main-logo {
    margin-top: 0.5rem;
    width: 9rem;  /* Adjust this value to your preference */
    height: auto;
    vertical-align: middle;
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
    padding: 1.8rem;
    border-radius: 6rem;
    margin: 0 auto;
    position: relative; /* Added this line */
  }

  .nav-links-right {
    cursor: pointer;
    margin-left: 2rem;
    display: flex;
    align-items: center;
  }

  a {
    font-size: 1.5em;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    line-height: 2.5rem;
    margin: 0;
  }

  a:hover {
    color: #a9a9a9;
  }

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
  @media screen and (max-width: 1400px) {
    .nav-links-right {
      box-shadow: 0px 0px 18px 2px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      min-width: 10%;
      text-align: center;
      position: absolute;
      top: 100%;
      right: 0; /* Adjusted from 'left' to 'right' */
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
