<script>
    import { onDestroy } from 'svelte';
  
    export let postId; // Assuming postId is passed as a prop by the router
    let postComponent;
    let error = false;
  
    async function loadPost() {
      try {
        const importedPost = await import(`../blogposts/${postId}.svelte`);
        postComponent = importedPost.default;
      } catch (e) {
        console.error("Error loading post:", e);
        error = true;
      }
    }
  
    loadPost();
  
    onDestroy(() => {
      // Clean up or reset state if necessary
    });
  </script>
  
  {#if error}
    <h1>Not found</h1>
  {:else}
    {#if postComponent}
      <svelte:component this={postComponent} />
    {/if}
  {/if}
  