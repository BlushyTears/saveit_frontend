<script>
  import { Link } from "svelte-routing";
  import { backend_url } from "../lib/urls";

  let email = "";

  async function handleSubmit(event) {
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
      console.log("You can now close this window.");
    } else {
      console.error("Failed to send username. Please try again.");
    }
  }
</script>

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
  </form>

  <div class="back-to-login">
    <Link to="/login">Back to Login</Link>
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
