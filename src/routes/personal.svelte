<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { savedChanges, linkname, isEmailVerified } from "../lib/builderstore";
  import { getCookie } from "../lib/helpers";
  import { backend_url } from "../lib/urls";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import LoggedOutNotif from "../lib/notification.svelte";
  import LoadingSpinner from "../lib/loadspinner.svelte";
  import EditProfileModal from "../lib/editprofilemodal.svelte";
  import { userImage } from "../lib/builderstore";
  import { tick } from "svelte";

  let showSuccessBar = false;
  let ShowFailedBar = false;
  let showLoggedOutNotifBar = false;
  let newPassword = "";
  let isLoading = false;
  let linkName = localStorage.getItem("linkname");
  let notificationMsg = ""

  function showSuccessNotification(_msg) {
    notificationMsg = _msg;
    showSuccessBar = true;
  }

  function showFailedNotification(_msg) {
    notificationMsg = _msg;
    ShowFailedBar = true;
  }

  function showLoggedOutNotification(_msg) {
    notificationMsg = _msg;
    showLoggedOutNotifBar = true;
  }

  function navigateToPwRecovery(event) {
    event.preventDefault();
    navigate("/recoverpassword");
  }

  // image upload stuff:
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

      if (response.status === 401) {
        // If it is 401, remove the token from the local storage
        showLoggedOutNotification("Session expired");
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        throw new Error("Invalid or expired token. Token has been removed.");
      }

      if (response.ok) {
        localStorage.setItem("linkname", $linkname);
        showSuccessNotification("Linkname updated");
        console.log("Data sent successfully.");
      } else {
        showFailedNotification("Error");
        console.error("Error sending data:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
    isLoading = false;
  }

  async function verifyEmail(event) {
    console.error("Error sending data:");

    event.preventDefault();
    const token = localStorage.getItem("token");
    const csrfToken = getCookie("csrftoken");
    isLoading = true;

    try {
      const response = await fetch(backend_url + "/api/verifyemail/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 401) {
        // showLoggedOutNotification(); // Assuming this function shows some UI feedback
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        throw new Error("Invalid or expired token. Token has been removed.");
      }

      const responseData = await response.json();
      if (response.ok) {
        console.log("Data sent successfully.");
        // Provide some feedback to the user
        showSuccessNotification("Email verified");
        alert(
          responseData.detail || "Email verification initiated successfully."
        );
      } else {
        console.error("Error sending data:", response.statusText);
        // Provide some feedback to the user
        alert(responseData.detail || "There was an error verifying the email.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      isLoading = false; // Ensure you set this to false after the request completes
    }
  }

  onMount(() => {
    savedChanges.set(true);
  });
</script>

<br />
<main class="content">
  <SuccessNotif
    bind:showBar={showSuccessBar}
    color="#1daa2bcc"
    textShadow="#3ddb6a"
    message={notificationMsg}
  />
  <FailedNotif
    bind:showBar={ShowFailedBar}
    color="#b42727ce"
    textShadow="#e0113e"
    message={notificationMsg}
  />
  <LoggedOutNotif
    bind:showBar={showLoggedOutNotifBar}
    color="#a0a0a0b9"
    textShadow="#4f4f4f"
    message={notificationMsg}
  />

  <section class="body-section">
    <h2 style="color: white; font-size: 2em;">Select your linkname here:</h2>
    <br>

    <h3 style="color: white;">favedis.com/YourLinkName</h3>
    <form on:submit={submitInfo} class="login-form">
      <div class="input-group">
        <input
          type="text"
          id="link"
          bind:value={$linkname}
          required
          placeholder={linkName}
        />
        <button class="generic-btn" type="submit">Update</button>
        {#if isLoading}
          <div style="margin-top: 1.3rem;">
            <LoadingSpinner />
          </div>
        {/if}
      </div>
    </form>

  </section>
  <section class="body-section-2">
    <h2 style="color: white; margin: 0 auto; font-size: 2em;">Miscellaneous</h2>
    <br>
    <div class="image-section">
      {#if $userImage !== ""}
        <img src={$userImage} alt=" " />
      {/if}
      <div class="profile-edit-button">
        <EditProfileModal />
      </div>
    </div>
    <br>
    <div class="change-buttons">
    <br />
      {#if !$isEmailVerified}
        <button
          class="verify-btn"
          on:click={verifyEmail}>Verify E-mail</button
        >
        {:else}
        <button
        class="verified-btn"
        disabled>E-mail Verified</button>
      {/if}
      <button class="generic-btn" on:click={navigateToPwRecovery}>Change Password</button>

      <!--
        For future use if needed by users
        <button type="submit">Change E-mail</button> -->
    </div>
  </section>

</main>

<style>
@font-face {
  font-family: "Monofonto";
  src: url("../assets/monofontorg.otf") format("opentype");
}

main {
  height: 90vh;
  color: white;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 90%;
  max-width: calc(20rem + 30vw);
}

.body-section, .body-section-2 {
  background-color: #2e3757; /* Original blue shade */
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: calc(20rem + 30vw);
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

h2, h3 {
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input[type="text"] {
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  font-size: 1.2em;
  border-radius: 4px;
  border: none;
  background-color: #3f4868; /* Original input background color */
  color: white;
}

button.generic-btn {
  font-size: 1.3em;
  background-color: #293255;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.generic-btn:hover {
  background-color: #434e74;
}

button.verify-btn {
  font-size: 1.3em;
  background-color: #922929;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button.verify-btn:hover {
  background-color: #b62a2a;
}

.verified-btn {
  font-size: 1.3em;
  background-color: rgb(6, 177, 120);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}


.image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 0 auto; 
}

.image-section img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: block; /* Ensures the image is treated as a block-level element */
}

.profile-edit-button {
  display: flex;
  justify-content: center; /* Centers the button horizontally */
  width: 100%; /* Ensures the flex container takes full width */
}


.change-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .input-group, .login-form, .body-section, .body-section-2 {
    width: 100%;
    flex-direction: column;
  }
  
  /* Padding causes a bit of misalignment between input and the below button, so we ducktape a solution here */
  input[type="text"] {
    width: 99%;
  }

  .content {
    padding: 1rem;
  }

}

</style>
