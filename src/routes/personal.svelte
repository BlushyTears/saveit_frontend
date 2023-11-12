<script lang="ts">
  import { onMount } from "svelte";
  import { savedChanges, linkname, isEmailVerified } from "../lib/builderstore";
  import { getCookie } from "../lib/helpers";
  import { backend_url } from "../lib/urls";
  import SuccessNotif from "../lib/notification.svelte";
  import FailedNotif from "../lib/notification.svelte";
  import LoggedOutNotif from "../lib/notification.svelte";
  import LoadingSpinner from "../lib/loadspinner.svelte";
  import EditProfileModal from "../lib/editprofilemodal.svelte";
  import Editprofilemodal2 from "../lib/editprofilemodal2.svelte";
  import { userImage } from "../lib/builderstore";
  import { tick } from "svelte";

  let showSuccessBar = false;
  let ShowFailedBar = false;
  let showLoggedOutNotifBar = false;
  let emailToVerify = "";
  let newPassword = "";
  let newEmail = "";
  let isLoading = false;

  function showSuccessNotification() {
    showSuccessBar = true;
  }

  function showFailedNotification() {
    ShowFailedBar = true;
  }

  function showLoggedOutNotification() {
    showLoggedOutNotifBar = true;
  }

  // Sample function to handle password change
  function changePassword(event) {
    event.preventDefault();
    // Implement logic for changing password
    console.log("Changing password to:", newPassword);
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
        showLoggedOutNotification();
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        throw new Error("Invalid or expired token. Token has been removed.");
      }

      if (response.ok) {
        console.log("Data sent successfully.");
      } else {
        console.error("Error sending data:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
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
            alert(responseData.detail || "Email verification initiated successfully.");
        } else {
            console.error("Error sending data:", response.statusText);
            // Provide some feedback to the user
            alert(responseData.detail || "There was an error verifying the email.");
        }
    } catch (error) {
        console.error("Error sending data:", error);
        alert("An error occurred. Please try again later.");
    } finally {
        isLoading = false;  // Ensure you set this to false after the request completes
    }
}

    onMount( () => {
    savedChanges.set(true);
  });
</script>

<svelte:head>
  <link href="/node_modules/cropperjs/dist/cropper.css" rel="stylesheet" />
</svelte:head>


<br>
<main class="content">
  <SuccessNotif bind:showBar={showSuccessBar} message="Link changed!" />
  <FailedNotif bind:showBar={ShowFailedBar} message="Link change fail." />
  <LoggedOutNotif
    bind:showBar={showLoggedOutNotifBar}
    message="Session expired, please log in again"
  />

  <section class="body-section">
    <form on:submit={submitInfo} class="login-form">
      <div class="input-group">
        <h2 class="favedis-header">favedis.com/</h2>
        <input
          type="text"
          id="link"
          bind:value={$linkname}
          required
          placeholder="Enter your linkname"
        />
        <button type="submit">Update</button>
      </div>
    </form>
    <div class="image-section">
      {#if $userImage !== ""}
        <img src={$userImage} alt="User Image" />
      {/if}
      <div class="profile-edit-button">
        <Editprofilemodal2 />
      </div>
    </div>
    <div class="change-buttons">
      <button type="submit">Change Password</button>
      {#if !$isEmailVerified}
      <button style="background-color: #7c1e1e;" on:click={verifyEmail}>Verify E-mail</button>
      {/if}
      <!--
        For future use if needed by users
        <button type="submit">Change E-mail</button> -->
    </div>
  </section>
</main>

<style>
  /* Base styling */
  * {
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    height: 95vh;
    color: white;
    max-width: 1200px;
    margin: 0 auto;
  }

  .body-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #2e3757;
    border-radius: 5px;
    padding: 2rem;
    width: 100%;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .image-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .profile-edit-button {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .input-group {
    display: flex;
    gap: 1rem;
    width: 70%;
  }

  .favedis-header,
  h2 {
    color: white;
    margin-top: 0.5rem;
  }

  input {
    min-height: 3rem; 
    padding-left: 10px;
    border-radius: 1rem;
    border: none;
    flex: 1;
    background-color: #3f4868;
    color: white;
  }

  button {
    border-radius: 2rem;
    cursor: pointer;
    margin: 0 auto;
    border: none;
    width: 50%;
    padding: 1rem;
    background-color: #7c1e1e;
    background-color: #293255;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    color: white;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #434e74;
  }

  .image-section img {
    border-radius: 50%;
    width: 150px;
    height: 150px;
  }

  .change-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .body-section {
      flex-direction: column;
    }

    .content {
      padding: 1rem;
    }

    .input-group {
      flex-direction: column;
      gap: 1rem;
    }

    .change-buttons {
      gap: 0.5rem;
    }
  }
</style>
