<script>
  import { onMount } from "svelte";
  import { savedChanges } from "../lib/builderstore";
  import { linkname } from "../lib/builderstore";
  import { getCookie } from "../lib/helpers";
  import { backend_url } from "../lib/urls";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import LoadingSpinner from "../lib/loadspinner.svelte";

  let showSuccessBar = false;
  let ShowFailedBar = false;

  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    ShowFailedBar = true;
  }

  let isLoading = false;

  async function submitInfo(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const csrfToken = getCookie("csrftoken");
    isLoading = true;

    // Add the first_name to the request body
    const bodyData = {
      first_name: $linkname,
    };

    try {
      const response = await fetch(backend_url + "/api/updatename/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(bodyData), // Send the first_name in the request body
      });

      if (response.ok) {
        console.log("Data sent successfully.");
      } else {
        console.error("Error sending data:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }
  isLoading = false;

  onMount(() => {
    savedChanges.set(true);
  });
</script>

<SuccessNotif
  bind:showBar={showSuccessBar}
  message="Link changed!"
  color="#2dc23c"
  textShadow="#00ff48"
/>
<FailedNotif
  bind:showBar={ShowFailedBar}
  message="Link change fail."
  color="#c22d2d"
  textShadow="#ff0037"
/>

<br />
<br />

<div class="form-body">
  <div class="all-login-form">
    <h1 style="width: 90%; color: white;">
      Personal info, subscription, link, etc.
    </h1>
    <br />
    <br />
    <div class="login-form">
      <div style="display: flex;" class="login-title">
        <h3 style="color: white;">
          Update your link. Example: favedis.com/clusteredtomatoes
        </h3>

        <br />
      </div>
      <form style="margin-top: 0.3rem; display: flex;" on:submit={submitInfo}>
        <input
          type="text"
          id="link"
          bind:value={$linkname}
          required
          placeholder="pizzajoe"
        />
        <button class="update-btn" type="submit">Update</button>
      </form>
    </div>
    <h1 style="width: 90%; color: white;">Password change</h1>

    <h1 style="width: 90%; color: white;">Update e-mail</h1>
  </div>
</div>

<style>
  .form-body {
    display: flex;
    justify-content: center;
    width: 75%;
    margin: 0 auto;
    background-color: #27324bce;
  }
  .all-login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    margin-top: 5rem;
    border-radius: 5px;
  }

  .login-form {
    width: 90%;
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

  .update-btn {
    cursor: pointer;
    background-color: #bf15e9;
    color: white;
    padding: 0.8rem 1.2rem;
    font-size: 1.1em;
    border: none;
    border-radius: 2rem;
  }

  .update-btn:hover {
    background-color: #ad11d4;
  }
</style>
