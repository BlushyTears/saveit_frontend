<script>
  import { onMount } from "svelte";
  import { time_ranges_to_array } from "svelte/internal";

  import Spinner from "../lib/loadspinner.svelte";
  import SuccessNotif from '../lib/notification.svelte';
  import FailedNotif from '../lib/notification.svelte';
  import { backend_url, frontend_url } from "../lib/urls";
  import GLogo from "../assets/glogo.png";

  import {first_name} from '../lib/builderstore';

  let showSuccessBar = false;
  let ShowFailedBar = false;
  
  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    ShowFailedBar = true;
  }

  let isLoading = false;

  let username = "";
  let password = "";

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

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  async function loginBtn(event) {
    event.preventDefault();

    isLoading = true;

    const csrfToken = getCookie("csrftoken");

    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch(backend_url + "/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // Assuming the response returns the token
        localStorage.setItem("token", token);
        console.log("Login successful:", data);
        let $first_name = await getUserFirstName();
        showSuccessNotification(); // If you're showing a notification
        setTimeout(() => {
          window.location.reload();
        }, 1500); 
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        showFailedNotification();
        console.error("Error:", response);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    isLoading = false;
  }

  function loginWithGoogle() {
    isLoading = true;
    // Redirect to Google's OAuth 2.0 login
    const googleClientId =
      "620668731459-uog676i4dtjvrllhar4tcmqpon6a74pj.apps.googleusercontent.com";
    const redirectUri = frontend_url;
    const scope = "email profile openid";
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }
</script>

<SuccessNotif bind:showBar={showSuccessBar} message="Login success!" color="#2dc23c" textShadow="#00ff48"/>
<FailedNotif bind:showBar={ShowFailedBar} message="Login fail." color="#c22d2d" textShadow="#ff0037"/>


<div class="all-login-form">
  <div class="login-form">
    <div style="display: flex;" class="login-title">
      <h2 style="color: white;">Login Form</h2>
      {#if isLoading}
        <Spinner />
      {/if}
      <br />
    </div>
    <form style=" margin-top: 0.3rem;" on:submit={loginBtn}>
      <input
        type="text"
        id="username"
        bind:value={username}
        required
        placeholder="Username"
      />
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  </div>
  <button class="google-login-btn" on:click={loginWithGoogle}>
    <img src={GLogo} alt="Google Icon" class="google-icon" />
    Login with Google
  </button>
  
</div>

<style>
  .all-login-form {
    display: flex; /* Use flexbox for layout */
    flex-direction: column; /* Stack elements vertically */
    align-items: center;
    height: 61rem;
    max-width: 400px;
    margin-left: 25%;
    margin-top: 5rem;
    border-radius: 5px;
  }

  .login-form {
    width: 100%;
  }

  .login-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .login-form input {
    width: 93%;
    padding: 0.8rem;
    margin-bottom: 0.3rem;
    border: none;
    background-color: rgb(236, 236, 236);
    border-radius: 0.5rem;
  }

  .login-form button {
    border: none;
    display: block; /* Display block to take full width */
    width: 100%;
    padding: 0.8rem 1.2rem;
    font-size: 1.1em;
    background-color: #bf15e9;
    color: #fff;
    border-bottom: 2px solid #ac1ecf;
    border-radius: 2rem;
    cursor: pointer;
  }
  .login-form button:hover {
    background-color: #ad11d4;
  }

  .google-login-btn {
    border: none;
    display: flex;
    align-items: center; /* Vertically center align items */
    justify-content: center;
    width: 100%;
    margin-top: 0.3rem;
    padding: 0.5rem;
    font-size: 1.1em;
    background-color: #4285F4;
    color: #fff;
    border-radius: 2rem;
    cursor: pointer;
    border-bottom: 2px solid #3670ce; /* This adds a white border */
  }

  .google-login-btn:hover {
    background-color: #3c78d8;
  }

  .google-icon {
    background-color: #ffffff;
    border-radius: 2rem;
    margin-right: 0.5rem; /* Space between the icon and the text */
}

  @media screen and (max-width: 568px) {
    .all-login-form {
      max-width: 65vw;
      margin: 0 auto;
      margin-top: 5rem;
    }
  }
</style>
