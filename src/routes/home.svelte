<!-- Temp color theme:
    #37C84C light green
    #376AC8 light blue
    #C837B3 magenta
    #C89537 gold orange
-->

<script>
    import CookingIllustration from '../assets/cooking_illustration.svelte';
</script>

<main>
    <section class="section1">
        <div class="text-chunk">
            <h2 style="font-size: calc(2vw + 1rem);">All the food you want to share with one link.</h2>

            <p>Build a brand by gaining exposure through sharing your favorite recipes</p>
        </div>
        <div style="margin-left: 30%; width: 1rem; height: 1rem;" class="svg-container"><CookingIllustration /></div>
    </section>
    <section class="section2">
        <h3>Become a food connoisseur</h3>
        <p>*Turn your hobby into a profession</p>
        <p>*Customize your own personal page to your liking.</p>
        <p>*Stay up to date with new recipes from your favorite creators</p>
    </section>
    <section class="section3">
        <p>Omato is a way for you to express your food and drink interests with others that have similar preferences to you. In order to more effectively find what you like you can follow creators and be notified whenever they released a new recipe</p>
    </section>
</main>

<style>
    p {
        padding: 0;
        margin: 0;
    }
    section {
        margin-top: 15rem;
        height: 60rem;
    }

    .section1 {
        max-width: 35rem;
        display: flex;
        background-color: #37C84C;
        margin-left: 20%;
    }
    .section2 {
        text-align: center;
        background-color: #376AC8;
    }

    .section3 {
        text-align: center;
        background-color: #C837B3;
    }
</style>