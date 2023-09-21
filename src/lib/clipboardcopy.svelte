<script>
  import CopyIcon from "../assets/copyicon.png";

  export let link = "fave.it/rottentomatoes";

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard");
    } catch (err) {
      alert(`Could not copy text: ${err}`);
    }
  }
</script>

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
