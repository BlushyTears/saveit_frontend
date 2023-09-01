<script>
    import { Router, Link, Route } from "svelte-routing";
    import Home from "../routes/home.svelte";
    import Layout from "../routes/layout.svelte";
    import Oauth from "../routes/oauth.svelte";
    import MyPage from "../routes/mypage.svelte";
    import Login from "../routes/login.svelte";
    import Register from "../routes/register.svelte";
    import NotFound from "../routes/notfound.svelte";

    import Spinner from '../lib/loadspinner.svelte';

    import { currentSetting } from './navbarStore.js';
    import Mypage from "../routes/mypage.svelte";

    import { backend_url, frontend_url } from '../lib/urls';

    export let url = "/";
    let isLoggedIn = localStorage.getItem('token') !== null;
    let isLoading = false;

    // Check if navbar is active or no
    let current; 
    currentSetting.subscribe(value => {
      current = value;
    });

    const token = localStorage.getItem('token');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async function logOutClick(event) {
    event.preventDefault();

    isLoading = true;

    const csrfToken = getCookie('csrftoken');

    try {
      const response = await fetch(backend_url + '/home/api/logout/', {
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
      } else {
        const errorData = await response.json();
        console.error('Logout failed on server:', errorData);
      }
    } catch (error) {
      console.error('Other error during logout:', error);
    }
    localStorage.removeItem('token');  // Remove the token from local storage
    window.location.reload();
  }
</script>

{#if current === 'navbar'}
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
          {#if isLoading}
          <div style="display: flex; justify-content: center; margin-top: 1rem;" class="spinner">
            <Spinner />
          </div>
          {/if}
        </div>
    
        <div>
          <Route path="/" component={Home} />
          <Route path="/mypage" component={Mypage} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/layout" component={Layout} />
          <Route path="/oauth" component={Oauth} />
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
  height: 3rem;
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