<script>
    import BlogPostLayout from "../lib/bloglayout.svelte";

    // Your cooking blog post data
    export let previewMode = false;
</script>

<div class="post">
    {#if previewMode}
        <BlogPostLayout>
            <h3>🍳 Master the Art of Cooking Content: A 7-Step Guide for Food Enthusiasts! 🌶️</h3>
            <p>
                Discover the secrets to crafting mouth-watering cooking content that captivates your audience, step by step!
            </p>
        </BlogPostLayout>
    {:else}
    <BlogPostLayout>
        <h1>🍳 7 Essential Steps to Create Unforgettable Cooking Content! 🌶️</h1>
        <br>
        
        <h2>1. The Recipe Blueprint! 📜</h2>
        <p>
          Start by outlining your recipe in a clear, step-by-step format. Each step should be concise and easy to follow, guiding your readers through the cooking process seamlessly.
        </p>
        <br>

        <h2>2. Visual Delights! 📸</h2>
        <p>
          Use high-quality images to accompany each step of your recipe. Visuals not only make your content more engaging but also help readers understand the process better.
        </p>
        <br>

        <h2>3. The Story Behind the Dish! 📖</h2>
        <p>
          Share the story or inspiration behind your recipe. Whether it's a family heirloom dish or an experimental fusion, a backstory adds a personal touch and connects with your audience.
        </p>
        <br>

        <h2>4. Keep Them Guessing! 🔍</h2>
        <p>
          Introduce unexpected twists or unique ingredients to keep your readers curious. Tease these elements at the beginning to entice them to read through the entire post.
        </p>
        <br>

        <h2>5. Tips and Tricks! 💡</h2>
        <p>
          Offer helpful tips and tricks throughout your recipe. From kitchen hacks to ingredient substitutions, these insights add immense value to your content.
        </p>
        <br>

        <h2>6. Engage and Interact! 💬</h2>
        <p>
          Encourage reader interaction by asking for their variations, experiences, or questions about the recipe. Engagement fosters a sense of community and loyalty.
        </p>
        <br>

        <h2>7. A Call to Culinary Action! 🌟</h2>
        <p>
          Conclude with a call-to-action. Encourage readers to try the recipe, share their results, or sign up for more content. This step is key to building a returning audience.
        </p>
        <br>

        <p>
          Follow these seven steps to create captivating and delicious cooking content that keeps your audience coming back for more. Bon appétit! 🍽️🎉
        </p>

    </BlogPostLayout>
    {/if}
</div>


<style>
    .post {
    }
  
    h1{
      font-size: 2.5em;
      color: white;
    }
  
    h2,
    h3 {
      color: white;
      font-size: 1.6em;
    }
  </style>
  