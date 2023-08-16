<script>
    let username = '';
    let password = '';

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async function handleSubmit(event) {
    event.preventDefault();

    const csrfToken = getCookie('csrftoken');

    const loginData = {
      username,
      password
    };

    try {
      const response = await fetch('https://saveit.fly.dev/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // Assuming the response returns the token
        localStorage.setItem('token', token);
        console.log('Login successful:', data);
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  
</script>

<div class="login-form">
    <h2>Login Form</h2>
    <form on:submit={handleSubmit}>
      <input type="text" id="username" bind:value={username} required placeholder="Username">
      <input type="password" id="password" bind:value={password} required placeholder="Password">
      <button type="submit">Login</button>
    </form>
  </div>

<style>
    .login-form {
        /* Poorly hardcoded height cause i couldn't find a better way */
        height: 61rem; 
        max-width: 400px;
        margin: 0 auto;
        margin-left: 25%;
        margin-top: 5rem;
        border: none;
        border-radius: 5px;
    }

    .login-form input {
        width: 100%;
        padding: 0.8rem;
        margin-bottom: 10px;
        border: none;
        background-color: rgb(236, 236, 236);
        border-radius: 0.5rem;
    }

    .login-form button {
        padding: 0.5rem 2rem;
        font-size: 1.1em;
        background-color: #bf15e9;
        color: #fff;
        border: none;
        border-radius: 2rem;
        cursor: pointer;
    }
    .login-form button:hover {
        background-color: #8b0aac;
        cursor: pointer;
    }
</style>