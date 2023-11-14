<script>
  import { Link } from "svelte-routing";
  import { backend_url } from "../lib/urls";

  let email = "";

  async function submitEmail(event) {
    event.preventDefault(); // prevent form from doing a default submission (page refresh)

    console.log('email: ', email);
    const response = await fetch(backend_url + "/api/passwordresetrequest/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      // Handle success, maybe close modal and clear the form
      email = ""; // Clear email after successful submission
    } else {
      // Handle error, maybe with an alert or a message in the UI
      alert("There was an error submitting your email.");
    }
  }
</script>

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
  </form>

  <div class="back-to-login">
    <Link to="/login">Back to Login</Link>
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
    margin-top: 1rem;
  }

  .back-to-login a {
    color: #4285f4;
    text-decoration: none;
  }

  .back-to-login a:hover {
    text-decoration: underline;
  }
</style>
