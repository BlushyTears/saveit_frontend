<!-- src/routes/ResetPassword.svelte -->
<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getCookie } from "../lib/helpers";
    import { backend_url } from "../lib/urls";

    let password = '';
    let confirmPassword = '';
    let resetToken, uid;
  
    onMount(() => {
      // Split the userid and resettoken from the url and parse it to a new url for backend request
      const pathSegments = window.location.pathname.split('/');
      uid = pathSegments[pathSegments.length - 2];
      resetToken = pathSegments[pathSegments.length - 1];
    });
  
    async function resetPassword() {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      console.log('uid: ', uid, ' resettoken: ', resetToken);
  
      const csrfToken = getCookie("csrftoken"); // Replace with your method to get CSRF token if needed
      const response = await fetch(backend_url + `/api/password-reset-confirm/${uid}/${resetToken}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          password: password,
        })
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Password reset successful!');
        navigate('/login'); // Navigate to login route after successful password reset
      } else {
        alert(`Error: ${result.detail}`);
      }
    }
  
  </script>
  
  <div class="reset-container">
    <form class="reset-form" on:submit|preventDefault={resetPassword}>
      <div class="input-group">
        <label for="password">New Password:</label>
        <input type="password" id="password" bind:value={password} required>
      </div>
      <div class="input-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" bind:value={confirmPassword} required>
      </div>
      <button type="submit">Reset Password</button>
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
  
    .reset-form button:hover {
      background-color: #357abf;
    }
  </style>
  