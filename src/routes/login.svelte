<script>
    import { onMount } from 'svelte';
    import Spinner from '../lib/loadspinner.svelte';

    import { backend_url, frontend_url } from '../lib/urls';

    let isLoading = false;

    let username = '';
    let password = '';

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async function handleSubmit(event) {
    event.preventDefault();

    isLoading = true;

    const csrfToken = getCookie('csrftoken');

    const loginData = {
      username,
      password
    };

    try {
      const response = await fetch(backend_url + "/api/login/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // Assuming the response returns the token
        localStorage.setItem('token', token);
        console.log('Login successful:', data);
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        console.error("Error:", response);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
    isLoading = false;
  }

  function loginWithGoogle() {
    // Redirect to Google's OAuth 2.0 login
    const googleClientId = "620668731459-uog676i4dtjvrllhar4tcmqpon6a74pj.apps.googleusercontent.com";
    const redirectUri = frontend_url; // Replace with your callback URL
    const scope = "email profile openid";
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }

</script>

<div class="all-login-form">
  <div class="login-form">
    <div style="display: flex;" class="login-title">
      <h2>Login Form</h2> 
      {#if isLoading}
        <Spinner />
      {/if}
    </div>
    <form on:submit={handleSubmit}>
      <input type="text" id="username" bind:value={username} required placeholder="Username">
      <input type="password" id="password" bind:value={password} required placeholder="Password">
      <button type="submit">Login</button>
    </form>
  </div>
      <button class="google-login-btn" on:click={loginWithGoogle}>Login with Google</button>
</div>

<style>
  .all-login-form {
    display: flex; /* Use flexbox for layout */
    flex-direction: column; /* Stack elements vertically */
    align-items: center;
    height: 61rem; 
    max-width: 400px;
    margin: 0 auto;
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
    display: block; /* Display block to take full width */
    width: 100%;
    padding: 0.5rem 1.2rem;
    font-size: 1.1em;
    background-color: #bf15e9;
    color: #fff;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
  }
  .login-form button:hover {
      background-color: #8b0aac;
  }

  .google-login-btn {
    width: 100%;
    margin-top: 0.3rem;
    padding: 0.5rem 1.2rem;
    font-size: 1.1em;
    background-color: aqua;
    color: #fff;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
  }

  .google-login-btn:hover {
    background-color: rgb(0, 172, 172);
  }

</style>