<script>
  import GLogo from "../assets/glogo.png";
  import Spinner from "../lib/loadspinner.svelte";
  import { backend_url, frontend_url } from "../lib/urls";
  import { Link, navigate } from "svelte-routing";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";

  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";

  let isLoading = false;

  let showSuccessBar = false;
  let ShowFailedBar = false;
  let notificationMsg = ""

  function showSuccessNotification(_msg) {
    notificationMsg = _msg;
    showSuccessBar = true;
  }

  function showFailedNotification(_msg) {
    notificationMsg = _msg;
    ShowFailedBar = true;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    const csrfToken = getCookie("csrftoken");

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch(backend_url + "/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        showSuccessNotification("Registered!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        showFailedNotification("Failed, make sure your passwords match");
      }
    } catch (error) {
      showFailedNotification("Error");
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

<SuccessNotif
  bind:showBar={showSuccessBar}
  message={notificationMsg}
  color="#1daa2bcc"
  textShadow="#3ddb6a"
/>
<FailedNotif
  bind:showBar={ShowFailedBar}
  message={notificationMsg}
  color="#b42727ce"
  textShadow="#e0113e"
/>

<div class="all-register-form">
  <div class="register-box">
    <div class="register-title">
      <div class="register-container">
        <h2 class="register-heading">
          Register Form
        </h2>
        {#if isLoading}
          <Spinner />
        {/if}
      </div>
      
    </div>
    <form on:submit={handleSubmit}>
      <input
        type="text"
        id="username"
        bind:value={username}
        required
        placeholder="Username"
      />
      <input
        type="text"
        id="email"
        bind:value={email}
        required
        placeholder="Email"
      />
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        placeholder="Password"
      />
      <input
        type="password"
        id="confirm_password"
        bind:value={confirmPassword}
        required
        placeholder="Confirm Password"
      />

      <div class="centered-content">
        <button type="submit" style="font-size: 2em;">Register</button>
        <Link to="/login" style="text-decoration: none;" > <p class="redirect-link">Already have an account? Login here</p></Link>
        <!-- Temporarly remove google btn since verification is pending -->
        <!-- <h2 style="color: white;">Or</h2>
        <br />
        <button class="google-login-btn" on:click={loginWithGoogle}>
          <img src={GLogo} alt="Google Icon" class="google-icon" />
        </button> -->
      </div>
    </form>
  </div>

</div>

<style>
.all-register-form {
    margin-top: -10rem;
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

.register-box {
    flex: 0 0 450px;
    padding: 2rem;
    background: #212a3e3a;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-right: 2rem;
}

.register-heading {
    color: white;
    font-size: 2em;
    margin-bottom: 1rem;
}

.register-box input,
.register-box button {
    display: block;
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.5em;
}

.register-box input {
    width: 93%;
    background-color: rgb(236, 236, 236);
}

.register-box button {
    background-color: #212a3e3a;
    color: white;
    cursor: pointer;
}

.register-box button:hover {
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

.redirect-link {
    color: white;
    text-decoration: none;
  }

  .redirect-link:hover {
    color: rgb(212, 212, 212);
  }

@media (max-width: 600px) {
    .all-register-form {
        margin-top: 0;
        margin-left: 0;
    }

    .register-box {
        flex: 0 0 100%; /* Full width on small screens */
        margin-right: 0;
        padding: 1rem;
    }

    .register-box input,
    .register-box button {
        font-size: 1em; /* Smaller font size */
        width: 80%;
        margin: 0 auto;
        margin-bottom: 1rem;
    }

    .register-heading {
        font-size: 1.5em; /* Smaller title */
    }

    /* Adjust other elements as needed for smaller screens */
}

</style>
