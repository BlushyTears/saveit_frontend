<script>
  import { onMount } from "svelte";
  import { time_ranges_to_array } from "svelte/internal";

  import Spinner from "../lib/loadspinner.svelte";
  import SuccessNotif from '../lib/notification.svelte';
  import FailedNotif from '../lib/notification.svelte';
  import { backend_url, frontend_url } from "../lib/urls";
  import GLogo from "../assets/glogo.png";
  import CoffeeWoman from "../assets/coffeewoman.jpg";

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
        showSuccessNotification(); // If you're showing a notification
        setTimeout(() => {
          window.location.reload();
        }, 1000); 
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
    <div class="login-title">
      <h2 style="color: white; font-size: 2.2em; margin-bottom: 1rem;">Login Form</h2>
      {#if isLoading}
        <Spinner />
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
        <br>
        <button class="google-login-btn" on:click={loginWithGoogle}>
            <img src={GLogo} alt="Google Icon" class="google-icon"/>
        </button>
    </div>

    </form>
  </div>
  <div class="coffee-woman-div">
    <img src={CoffeeWoman} alt="Coffee Woman" class="coffee-woman"/>
  </div>
</div>


<style>
.all-login-form {
  margin-top: -9rem;
  margin-left: 12vw;
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
  background-color: #4285F4;
  border-radius: 2rem;
  cursor: pointer;
}

.coffee-woman-div {
  flex-basis: 50%;
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  height: 60%;
}

.coffee-woman {
  border-radius: 5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 99%;
  height: auto;
  object-fit: cover;
}

/* Media Queries */
@media screen and (max-width: 1484px) {
  .all-login-form {
    margin-left: 0;
  }
}

/* Media Queries */
@media screen and (max-width: 1384px) {
  .all-login-form {
    margin-left: 0;
    margin-top: 2rem;
  }
  .coffee-woman-div {
    flex: 0 0 80%;
    max-width: 90%;
  }
  .login-form {
    margin-right: 1rem;
  }
  .coffee-woman-div {
    height: 70vh; /* Adjusted height for smaller screens */
  }

  .coffee-woman {
    box-shadow: none;
    /* Scaling the image to make it bigger */
    transform: scale(1.5) translate(-35%, -35%); /* Zooming in and shifting the image higher up */
  }
}

@media screen and (max-width: 1384px) {

.coffee-woman-div {
  height: 60vh; /* Adjusted height for smaller screens */
}

.coffee-woman {
  /* Scaling the image to make it bigger */
  transform: scale(1.4) translate(-50%, -45%); /* Zooming in and shifting the image higher up */
}
}

@media screen and (max-width: 868px) {
  .login-form,
  .coffee-woman-div {
    flex: 0 0 90%;
    max-width: 100%;
  }

  .login-form {
    margin-right: 0;
    margin-bottom: 2rem;
  }

  .coffee-woman-div {
    height: 70vh; /* Adjusted height for smaller screens */
  }

  .coffee-woman {
    /* Scaling the image to make it bigger */
    transform: scale(2) translate(-35%, -30%); /* Zooming in and shifting the image higher up */
  }
}

@media screen and (max-width: 668px) {
  .login-form {
    padding: 1rem;
  }

  .login-form input,
  .login-form button {
    padding: 0.6rem;
    font-size: 1em;
  }

  .coffee-woman-div {
    flex: 0 0 90%;
  }

  .login-form {
    margin-right: 0;
    margin-bottom: 2rem;
  }

  .coffee-woman {
    /* Scaling the image to make it bigger */
    transform: scale(2) translate(-45%, -45%); /* Zooming in and shifting the image higher up */
  }
}

</style>
