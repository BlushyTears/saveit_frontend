<script>
  import { Link, navigate } from "svelte-routing";
  import { backend_url } from "../lib/urls";

  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import Spinner from "../lib/loadspinner.svelte";

  let email = "";
  let showSuccessBar = false;
  let showFailedBar = false;
  let isLoading = false;
    
  function showSuccessNotification() {
    showSuccessBar = true;
  }
  
  function showFailedNotification() {
    showFailedBar = true;
  }

  function navigateToLogin() {
    navigate('/login');
  }

  async function handleSubmit(event) {
    isLoading = true;
    event.preventDefault(); // prevent form from doing a default submission

    const response = await fetch(backend_url + "/api/recoverusername/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (response.ok) {
      showSuccessNotification();
    } else {
      showFailedNotification();
    }
    isLoading = false;

  }
</script>

  
<SuccessNotif bind:showBar={showSuccessBar} message="Username sent" color="#2dc23c" textShadow="#00ff48" />
<FailedNotif bind:showBar={showFailedBar} message="Error" color="#9e9e9e" textShadow="#828282" />

<div class="forgot-container">
  <p class="info-text">
    To retrieve your username, please enter the email address associated with
    your account. We'll send you an email with your username.
  </p>

  <form class="forgot-form" on:submit={handleSubmit}>
    <input
      type="email"
      bind:value={email}
      placeholder="Enter your email"
      required
    />
    <button type="submit">Send Username</button>
    {#if isLoading}
      <div class='spinner-class'><Spinner /></div>
    {/if}
  </form>
  

  <div class="back-to-login">
    <button on:click={navigateToLogin}>Back to Login</button>
  </div>
</div>

<style>
  .forgot-container {
    transform: translateY(-20%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 2rem;
  }

  .info-text {
    font-size: 1.1rem;
    text-align: center;
    margin-bottom: 2rem;
    max-width: 400px;
  }

  .forgot-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }

  .spinner-class {
    margin: 0 auto;
  }

  .forgot-form input,
  .forgot-form button {
    padding: 0.8rem;
    font-size: 1rem;
    width: 100%;
    border-radius: 4px;
  }

  .forgot-form button {
    background-color: #4285f4;
    color: white;
    cursor: pointer;
    border: none;
  }

  .forgot-form button:hover {
    background-color: #357abf;
  }

  .back-to-login {
    color: white;
    margin-top: 1rem;
  }

  .back-to-login button {
    text-decoration: underline;
    font-size: 1.2em;
    border: none;
    background: none;
    cursor: pointer;
    color: rgb(177, 177, 177);
  }

  .back-to-login button:hover {
    color: rgb(233, 233, 233);
  }

  p {
    color: white;
  }
  

</style>
