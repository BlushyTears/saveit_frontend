<script>
  export let title = "";
  export let content = "";
  let isOpen = false;

  const toggleAccordion = () => {
    isOpen = !isOpen;
  };
</script>

<div class="accordion-item">
  <button on:click={toggleAccordion} class="accordion-button">
    {title}
    <span class="icon">{isOpen ? "-" : "+"}</span>
  </button>
  {#if isOpen}
    <div class="content">
      <p>{content}</p>
    </div>
  {/if}
</div>

<style>
  p {
    margin: 0 auto;
    padding: 1rem 0;
  }
  .accordion-item {
    width: 70%;
    margin: 0 auto;
    background-color: #212a3e;
    border-radius: 0 0 0.5rem 0.5rem;
    color: white;
  }
  .accordion-button {
    border-radius: 0 0 0.5rem 0.5rem;
    width: 100%;
    padding: 2rem;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 1.5em;
    outline: none;
  }

  .accordion-button:hover {
    background-color: #2c3a58;
  }
  .icon {
    float: right;
    font-size: 1.6em;
  }
  .content {
    font-size: 1.5em;
    padding: 1em;
    background: #394867; /* Slightly lighter than #212a3e */
    color: white;
  }
</style>
