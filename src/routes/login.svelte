<script>
  import { onMount } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import { time_ranges_to_array } from "svelte/internal";

  import LoadingSpinner from "../lib/loadspinner.svelte";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import { backend_url, frontend_url } from "../lib/urls";
  import GLogo from "../assets/glogo.png";

  import { getCookie } from "../lib/helpers";

  const googleClientId = "620668731459-uog676i4dtjvrllhar4tcmqpon6a74pj.apps.googleusercontent.com";
  let showSuccessBar = false;
  let ShowFailedBar = false;
  let isLoading = false;
  let username = "";
  let password = "";

  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    ShowFailedBar = true;
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
        showSuccessNotification(); // If you're showing a notification
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        navigate("/");
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
    const redirectUri = frontend_url;
    const scope = "email profile openid";
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }
</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message="Login success!"
  color="#2dc23c"
  textShadow="#00ff48"
/>
<FailedNotif
  bind:showBar={ShowFailedBar}
  message="Login fail."
  color="#c22d2d"
  textShadow="#ff0037"
/>

<div class="all-login-form">
  <div class="login-form">
    <div class="login-title">
      <h2 style="color: white; font-size: 2.2em; margin-bottom: 1rem;">
        Login Form
      </h2>
      {#if isLoading}
        <LoadingSpinner />
      {/if}
    </div>
    <form on:submit={loginBtn}>
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

      <div class="centered-content">
        <button type="submit" style="font-size: 2em;">Login</button>
        <h2 style="color: white;">Or</h2>
        <br />
        <button class="google-login-btn" on:click={loginWithGoogle}>
          <img src={GLogo} alt="Google Icon" class="google-icon" />
        </button>
        <div class="centered-content">
          <!-- Adding the Forgot password link -->
          <Link to="/recoverpassword" style="color: white; text-decoration: none; margin-top: 1rem;">Forgot Password?</Link>
          <Link to="/recoverusername" style="color: white; text-decoration: none; margin-top: 1rem;">Forgot Username?</Link>
          <Link to="/register" style="color: white; text-decoration: none; margin-top: 1rem; text-align: center;">Don't have an account? Register here</Link>
      </div>
      </div>
    </form>
  </div>
</div>

<style>
.all-login-form {
    margin-top: -9rem;
    margin-right: 40vw;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh + 5.6rem);
    padding: 2rem;
    flex-wrap: wrap;
}

  .centered-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-form {
    flex: 0 0 450px;
    padding: 2rem;
    background: #212a3e3a;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-right: 2rem;
  }

  .login-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
  }

  .login-form input,
  .login-form button {
    display: block;
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.5em;
  }

  .login-form input {
    width: 93%;
    background-color: rgb(236, 236, 236);
  }

  .login-form button {
    background-color: #212a3e3a;
    color: #fff;
    cursor: pointer;
  }

  .login-form button:hover {
    background-color: #151f355b;
    transition: 0.1s ease-in-out;
  }

  .google-login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4285f4;
    border-radius: 2rem;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    .all-login-form {
        margin-top: 0;
        margin-right: 0;
    }

    .login-form {
        flex: 0 0 100%; /* Full width on small screens */
        margin-right: 0;
        padding: 1rem;
    }

    .login-form input,
    .login-form button {
        font-size: 1em; /* Smaller font size */
        margin: 0 auto;
        margin-bottom: 1rem;
    }

    .login-title h2 {
        font-size: 1.5em; /* Smaller title */
    }

    /* Adjust other elements as needed for smaller screens */
}

</style>
