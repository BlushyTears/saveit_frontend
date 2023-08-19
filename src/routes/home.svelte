<!-- Temp color theme:
    #37C84C light green
    #376AC8 light blue
    #C837B3 magenta
    #C89537 gold orange
-->

<script>
    // import CookingIllustration from '../assets/cooking_illustration.svelte';
    import Coffee_Illustration from '../assets/coffee_illustration.svg';
</script>
<main>
    <section class="section1">
        <div class="text-chunk">
            <h2 style="font-size: calc(2vw + 1.5rem);">Share All Your Delicious Dishes with a Single Link.</h2>
            <p style="font-size: calc(1em + 0.5vw);">Amplify your brand and expand your reach through the power of sharing your cherished recipes. Cultivate your passion while simultaneously building a thriving audience for the days ahead.</p>
        </div>
        <img class="section1-illustration" src={Coffee_Illustration} alt="Coffee Illustration" style="width: calc(15vw + 15rem); height: calc(15vw + 15rem);" width="500" height="500">
    </section>
    <section class="section2">
        <h3>Become a food connoisseur</h3>
        <p>*Turn your hobby into a profession</p>
        <p>*Customize your own personal page to your liking.</p>
        <p>*Stay up to date with new recipes from your favorite creators</p>
    </section>
    <section class="section3">
        <p>Omato is a way for you to express your food and drink interests with others that have similar preferences to you. In order to more effectively find what you like you can follow creators and be notified whenever they release a new recipe</p>
    </section>
</main>

<style>

    h2 {
        margin: 0;
        margin-bottom: 2.5rem;
    }
    p {
        padding: 0;
        margin: 0;
    }
    section {
    }

    .section1 {
        flex-direction: row;
        justify-content: space-around;
        display: flex;
        align-items: center;
        background-color: #37C84C;
        margin-top: 15rem;
        margin-bottom: 25rem;
    }

    .section1-illustration {
        margin-left: -10vw;
    }

    .text-chunk {
        width: calc(20vw + 10rem);
        margin-bottom: 5rem;
    }

    @media screen and (max-width: 800px) {
        .section1 {
            flex-direction: column;
            justify-content: space-between;
        }
        .section1-illustration {
            margin: 0 auto;
        }
    }

    .section2 {
        height: 80rem;
        text-align: center;
        background-color: #C837B3;
    }

    .section3 {
        height: 60rem;
        text-align: center;
        background-color: #37C84C;
    }
</style>