<script>
    import { Router, Link, Route } from "svelte-routing";
    import Home from "../routes/home.svelte";
    import Layout from "../routes/layout.svelte";
    import MyPage from "../routes/mypage.svelte";
    import Login from "../routes/login.svelte";
    import Register from "../routes/register.svelte";
    import NotFound from "../routes/notfound.svelte";

    import { showNavbar } from './navbarStore.js';
    import Mypage from "../routes/mypage.svelte";

    export let url = "/";
    let isLoggedIn = localStorage.getItem('token') !== null;

    // function logOutClick() {
    //   localStorage.removeItem('token');
    //   setTimeout(delayedAction, 50);
    // }

    const token = localStorage.getItem('token');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async function logOutClick(event) {
    event.preventDefault();

    const csrfToken = getCookie('csrftoken');

    try {
      const response = await fetch('https://saveit.fly.dev/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User logged out successfully:', data);
        localStorage.removeItem('token');  // Remove the token from local storage
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData);
      }
    } catch (error) {
      console.error('Other error during logout:', error);
    }
  }
</script>

{#if showNavbar}
   <nav>
    <Router {url}>
        <div class="navbar-wrapper">
          <nav class="navbar">

              <Link to="/" class="nav-link"><a>Home</a></Link>

              <div class="nav-links-right">

              {#if isLoggedIn}
                <Link to="/mypage" class="nav-link"><a>My page</a></Link>
                <Link to="/" class="nav-link" on:click={logOutClick}><a>Log out</a></Link>
              {/if}

              {#if !isLoggedIn}
                <Link to="/register" class="nav-link"><a>Register</a></Link>
                <Link to="/login" class="nav-link"><a>Login</a></Link>
              {/if}

              <a href="/layout" class="nav-link">
                Layout
              </a>

              <!-- <a class="nav-link" on:click={toggleLayout}><a>Layout</a></a> -->
              </div>
          </nav>
        </div>
    
        <div>
          <Route path="/" component={Home} />
          <Route path="/mypage" component={Mypage} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/layout" component={Layout} />
          <Route component={NotFound}/>
        </div>
    </Router>
   </nav>
 {/if}

<style>
.navbar-wrapper {
  position: sticky;
  top: 2rem;
  z-index: 1000; /* Ensure the navbar is above other content */
}

.navbar {
  background-color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  text-decoration: none;
  width: 60%;
  padding: 1.3rem;
  border-radius: 6rem;
  margin: 0 auto;
}

.nav-links-right {
  margin-left: 1rem;
  display: flex;
  align-items: center;
}

a {
    font-size: 1.3em;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin: 0; /* Remove default margin */
}

a:hover {
    color: gray;
}
</style>