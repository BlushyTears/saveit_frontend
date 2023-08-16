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

    let isLoggedIn = localStorage.getItem('token') !== null;

    function logOutClick() {
      localStorage.removeItem('token');
    }

    // Sometimes the navbar sticks in layout.svelte or router doesn't route back to home.svelte
    // because the Store values do not manage to update before the router sometimes
    // (usually happens by removing the /layout part of the url and going back a few times) so a quick refresh is a ducktaped solution
    function delayedAction() {
      window.location.reload();
    }
    function handleNavbarClick() {
        showNavbar.set(false); 
        setTimeout(delayedAction, 50);
    }

    export let url = "/";
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

            <Link to="/layout" class="nav-link" on:click={handleNavbarClick}>
                <a>Layout</a>
            </Link>

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