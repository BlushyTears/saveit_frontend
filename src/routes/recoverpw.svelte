<script>
  import { Link } from "svelte-routing";
</script>

<div class="recover-container">
  <p class="info-text">
    To recover your password, please enter the email address associated with
    your account. We'll send you a link to reset your password.
  </p>

  <form class="recover-form">
    <input type="email" placeholder="Enter your email" required />
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
    margin-bottom: 2rem;
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
