<script>
  import { Router, Route, navigate } from "svelte-routing";
  import Home from "../routes/home.svelte";
  import Genpage from "../routes/mypage.svelte";
  import Editor from "../routes/editor.svelte";
  import Login from "../routes/login.svelte";
  import Register from "../routes/register.svelte";
  import Personal from "../routes/personal.svelte";
  import NotFound from "../routes/notfound.svelte";
  import Spinner from "../lib/loadspinner.svelte";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import { currentSetting } from "./navbarStore.js";
  import { onMount } from "svelte";
  import { backend_url } from "../lib/urls";

  import { savedChanges } from "../lib/builderstore";

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

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  async function getUserFirstName(event) {
    const token = localStorage.getItem("token");
    const csrfToken = getCookie("csrftoken");

    if (!token || !csrfToken) {
      console.error("Token or CSRF token not available.");
      return;
    }

    try {
      const response = await fetch(backend_url + "/api/getname/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      let firstName = data.data;
      console.log(firstName);
      // Process or return the data here as needed.
      return firstName;
    } catch (error) {
      console.error(
        "There was a problem fetching the user's first name:",
        error
      );
    }
  }

  async function handleMyPageNavigation(event) {
    event.preventDefault();
    try {
        console.log("Before fetching user first name");
        const path = await getUserFirstName();
        console.log("After fetching user first name");
        console.log('Fetched Path:', path); // Debugging
        handleNavigation(path || '/genpage');
        window.location.reload();
    } catch (err) {
        console.error("Error fetching the path:", err);
    }
}

  // Hamburger menu logic
  let showMenu = false;
  let menuElement; // Reference to the menu DOM element

  function handleNavigation(path) {
    if (!$savedChanges) {
      console.log(url);
      const userConfirmation = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!userConfirmation) {
        return; // If the user clicks "Cancel", we exit the function early without navigating
      }
    }
    console.log("Navigating to:", path);

    if (path === "/mypage") {
      currentSetting.set("mypage");
    } else if (path === "/oauth") {
      currentSetting.set("oauth");
    } else {
      currentSetting.set("navbar");
    }
    navigate(path);
  }

  onMount(() => {
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
            Home
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
              <a
                href="javascript:void(0);"
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

              <a
                href="javascript:void(0);"
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

              <a
                href="javascript:void(0);"
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
            {/if}

            {#if !isLoggedIn}
              <a
                href="javascript:void(0);"
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

              <a
                href="javascript:void(0);"
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

            <a 
              href="javascript:void(0);" 
              on:click|preventDefault={handleMyPageNavigation}
              on:keydown={(e) => {
                  if (e.key === "Enter") handleMyPageNavigation(e);
              }}
              tabindex="0" 
              role="button" 
              class="nav-link">
              My page
            </a>
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
        <Route path="/genpage" component={Genpage} />
        <Route component={NotFound} />
      </div>
    </Router>
  </nav>
{/if}

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
  position: relative; /* Added this line */
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
@media screen and (max-width: 1100px) {
  .nav-links-right {
    box-shadow: 0px 0px 18px 2px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    min-width: 10%;
    text-align: center;
    position: absolute;
    top: 100%;
    right: 0;   /* Adjusted from 'left' to 'right' */
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
