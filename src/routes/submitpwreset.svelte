<!-- src/routes/ResetPassword.svelte -->
<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { getCookie } from "../lib/helpers";
  import { backend_url } from "../lib/urls";

  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import Spinner from "../lib/loadspinner.svelte";

  let showSuccessBar = false;
  let showFailedBar = false;
  let isLoading = false;
  let notificationMsg = "";

  let password = "";
  let confirmPassword = "";
  let resetToken, uid;

  function showSuccessNotification(_msg) {
    notificationMsg = _msg;
    showSuccessBar = true;
  }

  function showFailedNotification(_msg) {
    notificationMsg = _msg;
    showFailedBar = true;
  }

  onMount(() => {
    // Split the userid and resettoken from the url and parse it to a new url for backend request
    const pathSegments = window.location.pathname.split("/");
    uid = pathSegments[pathSegments.length - 2];
    resetToken = pathSegments[pathSegments.length - 1];
  });

  async function resetPassword() {
    isLoading = true;
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("uid: ", uid, " resettoken: ", resetToken);

    const csrfToken = getCookie("csrftoken"); // Replace with your method to get CSRF token if needed
    const response = await fetch(
      backend_url + `/api/password-reset-confirm/${uid}/${resetToken}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          password: password,
        }),
      }
    );

    if (response.ok) {
      showSuccessNotification("Password recovery link sent, remember to check junk folder");
      navigate("/login"); // Navigate to login route after successful password reset
    } else {
      showFailedNotification("Error, our e-mail service seems to be down");
    }
    isLoading = false;
  }
</script>

<SuccessNotif bind:showBar={showSuccessBar} message={notificationMsg} color="#1daa2bcc" textShadow="#3ddb6a" />
<FailedNotif bind:showBar={showFailedBar} message={notificationMsg} color="#b42727ce" textShadow="#e0113e" />


<div class="reset-container">
  <form class="reset-form" on:submit|preventDefault={resetPassword}>
    <div class="input-group">
      <h3 style="font-size: 0.8em;">New Password:</h3>
      <input type="password" id="password" bind:value={password} required />
    </div>
    <div class="input-group">
      <h3 style="font-size: 0.8em;">Confirm Password:</h3>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        required
      />
    </div>
    <button type="submit">Reset Password</button>
    {#if isLoading}
    <div class='spinner-class'><Spinner /></div>
  {/if}
  </form>
</div>

<style>
  .reset-container {
    transform: translateY(-20%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 2rem;
  }

  .reset-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }

  .input-group {
    font-size: 2em;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .reset-form label {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .reset-form input {
    padding: 0.8rem;
    font-size: 1rem;
    width: 100%;
    border-radius: 4px;
  }

  .reset-form button {
    padding: 0.8rem;
    font-size: 1rem;
    width: 100%;
    border-radius: 4px;
    background-color: #4285f4;
    color: white;
    cursor: pointer;
    border: none;
  }

  .spinner-class {
    margin: 0 auto;
  }

  .reset-form button:hover {
    background-color: #357abf;
  }
</style>
