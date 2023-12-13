<script>
  import { onMount } from "svelte";

  // IMPORTANT: We have to manually add the prefix of each post here since svelte/js refuses to dynamically load posts
  const postFilenames = ["2", "1"]; 

  let posts = [];
  let error = false;

  onMount(async () => {
    try {
      const importedPosts = await Promise.all(
        postFilenames.map((name) => import(`../blogposts/${name}.svelte`))
      );
      posts = importedPosts.map((importedPost, index) => ({
        component: importedPost.default,
        id: postFilenames[index],
      }));
    } catch (e) {
      error = true;
      console.error("Error loading posts:", e);
    }
  });
</script>

<body>
  {#if error}
  <p>Failed to load posts.</p>
{:else}
  <section>
    {#each posts as { component: Post, id }}
    <div class="post-container">
      <Post previewMode={true} />
      <button class="post-button" on:click={() => (window.location.href = `/blog/${id}`)}>
        Go to Post
      </button>
    </div>
  {/each}
  </section>
{/if}

</body>

<style>
  body {
    background-color: #394867;
    height: 120vh;
  }

  section {
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto; /* Changed to auto for flexible height */
  }

  .post-container {
    text-align: center;
    margin-bottom: 2rem;
    border: 1px solid #585858;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: 80%;
    max-width: 700px; /* Maximum width */
    padding: 0rem 3rem;
    background-color: #3e4b6d;
    position: relative; /* For absolute positioning of the button */
    height: auto; /* Make height adjust to content */
    min-height: 38rem; /* Minimum height to maintain layout */
  }

  .post-button {
    position: absolute; /* Absolute positioning */
    right: 3rem; /* Aligned with container padding */
    bottom: 1rem; /* Positioned at the bottom */
    padding: 0.8rem 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .post-button:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    .post-container {
      width: 90%; /* Increase width on smaller screens */
      padding: 0rem 1rem; /* Adjust padding for smaller screens */
    }

    .post-button {
      right: 1rem; /* Align with adjusted container padding */
    }
  }
</style>
