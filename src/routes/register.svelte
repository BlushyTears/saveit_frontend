
<script>
    import Home from "../routes/home.svelte";
    import Layout from "../routes/layout.svelte";
    import Login from "../routes/login.svelte";
    import Register from "../routes/register.svelte";

    import { backend_url, frontend_url } from '../lib/urls';

    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';

    // function handleSubmit(event) {
    //     event.preventDefault();
    //     if (password !== confirmPassword) {
    //         alert("Passwords do not match.");
    //         return;
    //     }
    //     // Here you can implement your registration logic
    //     alert("Registration successful!");
    // }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async function handleSubmit(event) {
    event.preventDefault();

    const csrfToken = getCookie('csrftoken');

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    console.log("userdata: ", userData); 

    try {
      const response = await fetch(backend_url + '/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered successfully:', data);
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

</script>

<div class="register-form">
    <h2>Register Form</h2>
    <form on:submit={handleSubmit}>
      <input type="text" id="username" bind:value={username} required placeholder="Username">
      <input type="text" id="email" bind:value={email} required placeholder="Email">
      <input type="password" id="password" bind:value={password} required placeholder="Password">
      <input type="password" id="confirm_password" bind:value={confirmPassword} required placeholder="Confirm Password">
      <button type="submit">Register</button>
    </form>
</div>

<style>
    .register-form {
        /* Poorly hardcoded height cause i couldn't find a better way */
        height: 61rem;
        max-width: 400px;
        margin-left: 25%;
        border: none;
        border-radius: 5px;
        margin-top: 5rem;
    }
    .register-form input {
        width: 100%;
        padding: 0.8rem;
        margin-bottom: 10px;
        border: none;
        background-color: rgb(236, 236, 236);
        border-radius: 0.5rem;
    }
    .register-form button {
        padding: 0.5rem 2rem;
        font-size: 1.1em;
        background-color: #bf15e9;
        color: #fff;
        border: none;
        border-radius: 2rem;
        cursor: pointer;
    }
    .register-form button:hover {
        background-color: #8b0aac;
        cursor: pointer;
    }


@media screen and (max-width: 768px) {
  .register-form {
    max-width: 65vw;
    margin: 0 auto;
    margin-top: 5rem;
  }
}

</style>