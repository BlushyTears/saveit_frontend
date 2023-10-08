<script>
  import CopyIcon from "../assets/copyicon.png";
  import Notification from "./notification.svelte";

  export let link = "fave.it/rottentomatoes";

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(link);
      copyNotification();
    } catch (err) {
      // Too lazy to add custom notification for fail since it'll probably never occur
      alert(`Could not copy text: ${err}`);
    }
  }

  let copyNotificationStatus = false;
  
  function copyNotification() {
    copyNotificationStatus = true;
  }

</script>

<Notification bind:showBar={copyNotificationStatus} message="Link copied!" color="#2dc23c" textShadow="#00ff48"/>

<div class="container">
  <input bind:value={link} type="text" placeholder="Your link here" readonly />
  <button class="copy-button" on:click={copyToClipboard}>
    <img src={CopyIcon} alt="Copy to clipboard" />
  </button>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
  }

  .copy-button {
    border: none;
    background: none;
    cursor: pointer;
  }

  input {
    color: white;
    background-color: #2a3552;
    font-size: 0.8em;
    width: calc(8vw + 3rem);
    border: none;
    padding: 0.7rem 1rem;
    border-radius: 3rem;
  }

  img {
    width: 3rem;
    height: 3rem;
  }
</style>
