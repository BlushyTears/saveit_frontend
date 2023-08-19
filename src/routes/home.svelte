<!-- Temp color theme:
    #37C84C light green
    #376AC8 light blue
    #C837B3 magenta
    #C89537 gold orange
    #964B00 brown
    #FFFFFF white
-->

<script>
    // import CookingIllustration from '../assets/cooking_illustration.svelte';
    import Coffee_Illustration from '../assets/coffee_illustration.svg';

    let claimLink = '';

    function handleSubmit(event) {
        event.preventDefault();
    }

</script>
<main>
    <section class="section1">
        <div class="text-chunk-section1">
            <h2 style="font-size: calc(2vw + 1.5rem);">Share All Your Delicious Dishes with a Single Link.</h2>
            <p style="font-size: calc(1em + 0.5vw);">Amplify your brand and expand your reach through the power of sharing your cherished recipes. Cultivate your passion while simultaneously building a thriving audience for the days ahead.</p>
        </div>
        <img class="section1-illustration" src={Coffee_Illustration} alt="Coffee Illustration" style="width: calc(15vw + 15rem); height: calc(15vw + 15rem);" width="500" height="500">
    </section>
    <section class="section2">
        <br>
        <h3 style="">Get started in literally minutes</h3>
        <p>Making an account is seamless: No time wasted. Creating your personalized page to grow a userbase is just a few clicks away.</p>

        <div class="main">
            <form on:submit={handleSubmit}>
                <input type="text" class="claimInput" bind:value={claimLink} required placeholder="faveit/clusteredTomatoes">
                <button type="submit">Claim</button>
            </form>
        </div>

    </section>
    <section class="section3">
        <h3>Explore new foods</h3>
        <p>Faveit is a hub of hubs where you explore new food and drink with others that have similar preferences to you in order to more effectively find what you like: You can follow creators and be notified whenever they release a new recipe</p>
    </section>
</main>

<style>
    h3 {
        color: #FFFFFF;
    }
    h2 {
        color: #FFFFFF;
        margin: 0;
        margin-bottom: 2rem;
    }
    p {
        color: #FFFFFF;
        padding: 0;
        margin: 0;
        font-size: 1.5em;
    }

    /* Section 1: */
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

    .text-chunk-section1 {
        width: calc(20vw + 10rem);
        margin-bottom: 5rem;
    }

    /* Section 1 END */

    /* Section 2: */
    .section2 {
        height: 80rem;
        text-align: center;
        background-color: #C837B3;
    }

    .section2 h3 {
        margin-top: 5rem;
        font-size: 3em;
    }

    .section2 p {
        font-size: 1.2em;
    }

    .section2 .main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 20rem;
    }

    .section2 form {
        display: flex;
        align-items: center;
        margin: 0 auto;
        padding: 5rem;
        max-width: 35rem;
        border-radius: 1rem;
    }

    .section2 .claimInput {
        padding: 1rem;
        font-size: 1.2em;
        border: 1px solid #ccc;
        border-radius: 1rem;
        margin-right: 0.5rem;
        width: 100%;
    }

    .section2 button {
        padding: 1rem 3rem;
        font-size: 1.2em;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 2rem;
        cursor: pointer;
    }

    /* Section 2 END */

    /* Section 3: */
    .section3 {
        height: 60rem;
        text-align: center;
        background-color: #37C84C;
    }

    .section3 h3 {
        margin-top: 5rem;
        font-size: 3em;
    }

    .section3 p {
        margin: 0 auto;
        font-size: 1.5em;
        max-width: 35rem;
    }

    /* Section 3 END */


    /* Media Queries: */
    @media screen and (max-width: 800px) {
        .section1 {
            flex-direction: column;
            justify-content: space-between;
        }
        .section1-illustration {
            margin: 0 auto;
        }

        .section2 form {
            flex-direction: column;
            max-width: fit-content;
        }
        .section2 button {
            margin-top: 0.5rem;
        }
    }
</style>