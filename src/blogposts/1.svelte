<script>
  import BlogPostLayout from "../lib/bloglayout.svelte";

  // Your blog post data
  export let previewMode = false;
</script>

{#if previewMode}
  <BlogPostLayout>
    <h2>Favedis: Share Your Recipes with Just One Link</h2>

    <p>
      Imagine having a single, easily accessible link that leads to a treasure
      trove of your favorite recipes, fitness plans, and even...
    </p>
  </BlogPostLayout>
{:else}
  <BlogPostLayout>
    <h2>Introduction to Favedis</h2>

    <p>
      Imagine having a single, easily accessible link that leads to a treasure
      trove of your favorite recipes, fitness plans, and even gaming strategies.
      That's exactly what Favedis offers. It's more than just a recipe sharing
      tool; it's a platform that simplifies the way you distribute and access
      diverse types of information.
    </p>

    <br />

    <h3>Why Choose Favedis?</h3>
    <p>
      With its user-friendly interface, Favedis allows you to curate and
      organize content efficiently. Whether you're a chef looking to share your
      culinary creations, a fitness enthusiast eager to distribute workout
      plans, or a gamer wanting to provide walkthroughs, Favedis caters to all
      your needs. Its customizable layout ensures that your content is presented
      in an appealing and accessible manner.
    </p>

    <br />

    <h3>How It Works</h3>
    <p>
      Getting started with Favedis is straightforward. Create your account,
      upload your content, and generate your unique link. Share this link across
      your social media platforms, emails, or even in your digital business
      card. The simplicity of having one link consolidates your content, making
      it easier for your audience to find and follow your work.
    </p>

    <br />

    <h3>Expanding Your Reach</h3>
    <p>
      Favedis isn't just about sharing content; it's about building a community.
      Engage with your followers through comments, feedback, and suggestions.
      Utilize Favedis' analytics tools to understand your audience better and
      tailor your content to meet their interests.
    </p>

    <br />

    <h3>Join the Favedis Community</h3>
    <p>
      Whether you're a professional in your field or someone passionate about
      sharing your hobbies and interests, Favedis is the platform for you. Join
      our growing community and discover the ease and impact of sharing with
      Favedis.
    </p>

    <br />

    <p>
      Experience the future of content sharing with Favedis. Share more than
      just recipes; share your passion, knowledge, and expertise with just one
      link.
    </p>
  </BlogPostLayout>
{/if}

<style>
  h2,
  h3 {
    color: white;
    font-size: 1.5em;
  }
</style>
