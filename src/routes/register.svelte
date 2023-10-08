<script>
  import Home from "../routes/home.svelte";
  import Layout from "./mypage.svelte";
  import Login from "../routes/login.svelte";
  import Register from "../routes/register.svelte";
  import GLogo from "../assets/glogo.png";


  import { backend_url, frontend_url } from "../lib/urls";

  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";

  let isLoading = false;

  // function handleSubmit(event) {
  //     event.preventDefault();
  //     if (password !== confirmPassword) {
  //         alert("Passwords do not match.");
  //         return;
  //     }
  //     // Here you can implement your registration logic
  //     alert("Registration successful!");
  // }

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

<div class="register-form">
  <h2 style="color: white;">Register Form</h2>
  <form style=" margin-top: 0.5rem;" on:submit={handleSubmit}>
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
    <div class="btn-container">
      <button class="register-btn" type="submit">Register</button>
      <button class="google-login-btn" on:click={loginWithGoogle}>
        <img src={GLogo} alt="Google Icon" class="google-icon" />
        Google Register
      </button>
    </div>
  </form>


  
</div>

<style>
  .register-form {
    /* Poorly hardcoded height cause i couldn't find a better way */
    height: 61rem;
    max-width: 500px;
    margin-left: 25%;
    border: none;
    border-radius: 5px;
    margin-top: 5rem;
  }
  .register-form input {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 10px;
    border: none;
    background-color: rgb(236, 236, 236);
    border-radius: 0.5rem;
  }
  .register-btn {
    border: none;
    font-size: 1.7em;
    background-color: #bf15e9;
    color: #fff;
    border-radius: 2rem;
    cursor: pointer;
    border-bottom: 2px solid #ac1ecf;
  }

  .register-btn:hover {
    background-color: #ad11d4;
    cursor: pointer;
  }

  .google-login-btn {
    font-size: 1.3em;
    color: #fff;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    background-color: #4285F4;
    border-bottom: 2px solid #3670ce;
    display: flex;
    padding: 0.5rem;
    align-items: center;  /* Vertically aligns items to the center */
    justify-content: center;  /* Horizontally aligns items to the center */
    /* ... your other styles ... */
}

.google-login-btn:hover {
    background-color: #3c78d8;
}

  .btn-container {
  display: flex;
}

.google-icon {
  background-color: #ffffff;
  border-radius: 2rem;
    margin-right: 0.5rem;  /* Adjust as needed */
}

/* If you want the buttons to have the same width, you can add this: */
.register-form button {
  flex: 1; /* This makes each button take up equal space */
}

  @media screen and (max-width: 768px) {
    .register-form {
      max-width: 65vw;
      margin: 0 auto;
      margin-top: 5rem;
    }
  }
</style>
