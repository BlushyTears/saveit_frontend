<script>
  import Home from "../routes/home.svelte";
  import Layout from "./mypage.svelte";
  import Login from "../routes/login.svelte";
  import Register from "../routes/register.svelte";
  import GLogo from "../assets/glogo.png";
  import WelcomeParty from "../assets/welcomeparty.jpg";
  import Spinner from "../lib/loadspinner.svelte";
  import { backend_url, frontend_url } from "../lib/urls";
  import SuccessNotif from '../lib/notification.svelte';
  import FailedNotif from '../lib/notification.svelte';

  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";

  let isLoading = false;
  
  let showSuccessBar = false;
  let ShowFailedBar = false;
  
  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    ShowFailedBar = true;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  async function handleSubmit(event) {
    event.preventDefault();

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

    console.log("userdata: ", userData);

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
        console.log("User registered successfully:", data);
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
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

<SuccessNotif bind:showBar={showSuccessBar} message="Registered!" color="#2dc23c" textShadow="#00ff48"/>
<FailedNotif bind:showBar={ShowFailedBar} message="Register fail." color="#c22d2d" textShadow="#ff0037"/>

<div class="all-register-form">
  <div class="register-box">
    <div class="register-title">
      <h2 style="color: white; font-size: 2.2em; margin-bottom: 1rem;">Register Form</h2>
      {#if isLoading}
        <Spinner />
      {/if}
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
        <h2 style="color: white;">Or</h2>
        <br>
        <button class="google-login-btn" on:click={loginWithGoogle}>
            <img src={GLogo} alt="Google Icon" class="google-icon"/>
        </button>
      </div>
    </form>
  </div>
  <div class="welcome-party-div">
    <img src={WelcomeParty} alt="Coffee Woman" class="welcome-party"/>
  </div>
</div>

<style>
.all-register-form {
  margin-top: -15rem;
  margin-left: 12vw;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(110vh + 15.6rem);
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
  margin-right: 10rem;
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
  color: #fff;
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
  background-color: #4285F4;
  border-radius: 2rem;
  cursor: pointer;
}

.welcome-party-div {
  flex-basis: 50%;
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  height: 60%;
}

.welcome-party {
  border-radius: 5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 99%;
  height: auto;
  object-fit: cover;
}

@media screen and (min-width: 2000px) {

  .register-box {
    flex: 0 0 600px; /* Increasing width */
  }

  .welcome-party-div {
    flex-basis: 40%; /* Taking less space */
    max-width: 40%;
  }
}


/* Tablets Landscape */
@media screen and (max-width: 1384px) {
  .all-register-form {
    margin-left: 0;
    margin-top: 2rem;
  }
  
  .welcome-party-div {
    flex: 0 0 80%;
    max-width: 90%;
    height: 70vh;
  }

  .welcome-party {
    transform: scale(1.2) translate(-35%, -35%);
  }
}

/* Tablets Portrait */
@media screen and (max-width: 1024px) {
  .welcome-party-div {
    height: 60vh;
  }

  .welcome-party {
    transform: scale(1.4) translate(-50%, -35%);
  }
}

/* Mobile Landscape */
@media screen and (max-width: 868px) {
  .register-box,
  .welcome-party-div {
    flex: 0 0 90%;
    max-width: 100%;
  }

  .register-box {
    margin-right: 0;
    margin-bottom: 2rem;
  }

  .welcome-party-div {
    height: 70vh;
  }

  .welcome-party {
    transform: scale(2) translate(-35%, -40%);
  }
}

/* Mobile Portrait */
@media screen and (max-width: 668px) {
  .register-box {
    padding: 1rem;
  }

  .register-box input,
  .register-box button {
    padding: 0.6rem;
    font-size: 1em;
  }

  .welcome-party-div {
    flex: 0 0 90%;
  }
  .welcome-party-div {
    height: 80vh;
  }

  .register-box {
    margin-right: 0;
    margin-bottom: 2rem;
  }

  .welcome-party {
    transform: scale(2) translate(-35%, -60%);
    border-radius: 0;
  }
}

@media screen and (max-width: 468px) {

  .welcome-party {
    transform: scale(2) translate(-35%, -90%);
  }
}
</style>
