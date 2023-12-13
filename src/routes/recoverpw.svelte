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
  let notificationMsg = ""

  function showSuccessNotification(_msg) {
    notificationMsg = _msg;
    showSuccessBar = true;
  }

  function showFailedNotification(_msg) {
    notificationMsg = _msg;
    showFailedBar = true;
  }

  function navigateToLogin() {
    navigate("/login");
  }

  async function submitEmail(event) {
    event.preventDefault(); // prevent form from doing a default submission (page refresh)
    isLoading = true;
    console.log("email: ", email);
    const response = await fetch(backend_url + "/api/passwordresetrequest/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      showSuccessNotification("Recovery E-mail sent, remember to check junk folder");
    } else {
      showFailedNotification();
      alert("There was an error submitting your email.");
    }
    isLoading = false;
  }
</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message={notificationMsg}
  color="#1daa2bcc"
  textShadow="#3ddb6a"
/>
<FailedNotif
  bind:showBar={showFailedBar}
  message={notificationMsg}
  color="#b42727ce"
  textShadow="#e0113e"
/>

<div class="recover-container">
  <p class="info-text" style="color: white;">
    To recover your password, please enter the email address associated with
    your account. We'll send you a link to reset your password.
  </p>

  <form class="recover-form" on:submit={submitEmail}>
    <input
      type="email"
      bind:value={email}
      placeholder="Enter your email"
      required
    />
    <button type="submit">Send Reset Link</button>
    {#if isLoading}
      <div class="spinner-class"><Spinner /></div>
    {/if}
  </form>

  <div class="back-to-login">
    <button on:click={navigateToLogin}>Back to Login</button>
  </div>
</div>

<style>
  .recover-container {
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
    margin-bottom: 1rem;
    max-width: 400px;
  }

  .recover-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }

  .spinner-class {
    margin: 0 auto;
  }

  .recover-form input,
  .recover-form button {
    padding: 0.8rem;
    font-size: 1rem;
    width: 100%;
    border-radius: 4px;
  }

  .recover-form button {
    background-color: #4285f4;
    color: white;
    cursor: pointer;
    border: none;
  }

  .recover-form button:hover {
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
