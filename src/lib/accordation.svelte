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
  .accordion-item {
    width: 70%;
    margin: 0 auto;
    border-bottom: 2px solid #212a3e;
    background-color: #212a3e;
    border-radius: 0 0 0.5rem 0.5rem;
    color: white;
  }
  .accordion-button {
    border-radius: 0 0 0.5rem 0.5rem;
    width: 100%;
    padding: 2rem;
    text-align: center;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 1.2em;
    outline: none;
  }

  .accordion-button:hover {
    background-color: #2c3a58;
  }
  .icon {
    font-size: 1.6em;
  }
  .content {
    font-size: 2em;

    padding: 1em;
    background: #394867; /* Slightly lighter than #212a3e */
    color: white;
  }
</style>
