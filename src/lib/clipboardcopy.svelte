<script>
  import CopyIcon from "../assets/copyicon.png";
  import Notification from "./notification.svelte";
  import { linkname } from "./builderstore";

  let linkName = localStorage.getItem("linkname");
  let copyNotificationStatus = false;
  let notificationMsg = "";

  function copyNotification(_msg) {
    notificationMsg = _msg;
    copyNotificationStatus = true;
  }

  const maxLinkLength = 20; // Maximum length of the displayed link
  let fullLink = `favedis.com/${linkName}`;
  let truncatedLink = fullLink;

  // Check if the link needs truncation
  if (truncatedLink.length > maxLinkLength) {
    truncatedLink = truncatedLink.substring(0, maxLinkLength) + "...";
  }

  export let link = truncatedLink;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(fullLink); // Copy the full link, not the truncated one
      copyNotification("Link copied");
    } catch (err) {
      // Too lazy to add custom notification for fail since it'll probably never occur
      alert(`Could not copy text: ${err}`);
    }
  }
</script>

<Notification
  bind:showBar={copyNotificationStatus}
  message={notificationMsg}
  color="#1daa2bcc"
  textShadow="#3ddb6a"
/>

<div class="container">
  <input bind:value={link} type="text" readonly />
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
    width: calc(10vw + 3rem);
    border: none;
    padding: 0.7rem 1rem;
    border-radius: 3rem;
  }

  img {
    margin-left: -3.2rem;
    margin-top: 0.2rem;
    width: 3.2rem;
    height: 3.2rem;
  }
</style>
