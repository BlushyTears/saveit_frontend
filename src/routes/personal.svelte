<script>
  import { onMount } from "svelte";
  import {savedChanges} from '../lib/builderstore';

  let name = "";
  let link = "";
  let linkname = '';

  function submitInfo() {
    console.log("Submit info");
  }

  onMount(() => {
    // We dont have a way of assuming the user didn't wanna save changes if he does leave unsaved, so we set it true upon load instead
    savedChanges.set(true);
    linkname = localStorage.getItem('linkname');
  });
</script>

<br />
<br />

<div class="form-body">
  <div class="all-login-form">
    <h1 style="width: 90%; color: white;">
      Personal info, subscription, link etc etc
    </h1>
    <br />
    <br />
    <div class="login-form">
      <div style="display: flex;" class="login-title">
        <h3 style="color: white;">
          Update your link. Example: favedis.com/{linkname}
        </h3>

        <br />
      </div>
      <form style=" margin-top: 0.3rem; display: flex;" on:submit={submitInfo}>
        <input
          type="link"
          id="link"
          bind:value={link}
          required
          placeholder="pizzajoe"
        />
        <button class="update-btn" type="submit">Update</button>
      </form>
    </div>
    <h1 style="width: 90%; color: white;">Password change</h1>

    <h1 style="width: 90%; color: white;">Update e-mail</h1>
  </div>
</div>

<style>
  .form-body {
    display: flex;
    justify-content: center;
    width: 75%;
    margin: 0 auto;
    background-color: #27324bce;
  }
  .all-login-form {
    
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    margin-top: 5rem;
    border-radius: 5px;
  }

  .login-form {
    width: 90%;
  }

  .login-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .login-form input {
    width: 93%;
    padding: 0.8rem;
    margin-bottom: 0.3rem;
    border: none;
    background-color: rgb(236, 236, 236);
    border-radius: 0.5rem;
  }

  .update-btn {
    cursor: pointer;
    background-color: #bf15e9;
    color: white;
    padding: 0.8rem 1.2rem;
    font-size: 1.1em;
    border: none;
    border-radius: 2rem;
  }

  .update-btn:hover {
    background-color: #ad11d4;
  }
</style>
