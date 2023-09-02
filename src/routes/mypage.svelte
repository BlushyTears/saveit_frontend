<!-- Temp color theme:
    #37C84C light green
    #376AC8 light blue
    #C837B3 magenta
    #C89537 gold orange
    #964B00 brown
    #FFFFFF white
-->


<!-- A RANDOM GETQUEST FOR QUERY SERVER DIRECTLY = ACCOUNTABILITY FOR IF BACKEND IS OPERATIONAL YES YES -->
<script>

    import Modal from '../lib/modal.svelte';
    import PenIcon from '../assets/pen.png';
    import SaveIcon from '../assets/accept.png';

    let showModal = [false, false];

    let isEditing = false;
    let editedText = "Ellie's coffee n sweets paradise";

    // function to open a specific modal
    function openModal(index) {
        showModal[index] = true;
    }

    // function to close a specific modal
    function closeModal(index) {
    showModal[index] = false;
    }

    function startEditing() {
        isEditing = true;
    }

    function saveEdit() {
        isEditing = false;
    }

</script>

<div class="body">
    <div class="body-container">

        <div style="font-size: calc(1em + 1vw);" class="stats">
            <p style="margin-top: 0;">Page editor</p>
            <p style="margin-top: 0;">Followers: 1276</p>
        </div>

        <div class="button-component">
            <div class="title" style="display: flex; align-items: center;">
                <h1>
                    {#if isEditing}
                        <input bind:value={editedText} style="font-size: 1.5em; margin-right: 1rem;" />
                    {:else}
                        <span style="font-size: calc(0.8em + 2vw); margin-right: 1rem;">{editedText}</span>
                    {/if}
                </h1>
                <button
                    class="edit-button"
                    on:click={isEditing ? saveEdit : startEditing}
                    on:keydown={e => {
                        if (e.key === 'Enter' || e.key === 'Space') {
                            isEditing ? saveEdit() : startEditing();
                        }
                    }}
                    tabindex="0"
                    style="background: none; border: none; padding: 0; cursor: pointer;"
                >
                    <img
                        src={isEditing ? SaveIcon : PenIcon}
                        class="pen-icon"
                        alt="pen icon"
                        style="height: 4rem; width: 4rem;"
                    />
                </button>
            </div>
            
            <button class="recipe-link" on:click={() => openModal(0)}>
                <span class="emoji">🍪</span>
                <h2 class="modal-btn-text">Chocolate Chip Cookies</h2>
                </button>
        </div>
    </div>

    <div class="template-container">
        <Modal bind:showModal={showModal[0]} on:closeModal={() => closeModal(0)}>
        <!-- modal content example hardcoded -->
        <h1 class="modal-title" style="color: black;">Chocolate Chip Cookies 🍪</h1>

        <h2 style="color: black;">Ingredients:</h2>
        <ul>
            <li>1 cup of logic-inspired flour</li>
            <li>1/2 cup of procedural provisions sugar</li>
            <li>1 teaspoon of musical mode vanilla extract</li>
            <li>1/4 cup of structural substance butter (room temperature)</li>
            <li>2 large grammatical eggs</li>
            <li>A pinch of statistical mode salt</li>
        </ul>
        
        <br>
        <p>Your delightful Modal Cookies are now ready to be enjoyed! Store any leftovers in an airtight container to keep them fresh.</p>
        
        <p>These cookies offer a unique blend of logic-inspired flavors, musical mode sweetness, and structural substance textures, making them a truly exceptional treat for any cookie enthusiast!</p>
        
        </Modal>
    </div>
</div>

<style>

h1, h2 {
    color: #FFFFFF;
    margin: 0;
    padding: 0;
}

.body {
    /* Remove vertical scrolling by Subtracting navbar margin found in navbar.svelte */
    height: calc(100vh - 10.6rem);
    margin-top: 5rem;
    background-color: #37c84c;
}

.body-container {
    background-color: rgb(202, 202, 202);
    margin-left: 2%;
    margin-right: 2%;
    height: 96%;
    border-radius: 1rem;
}

.stats {
    font-size: 1.2em;
    border-radius: 5rem;
    padding: 2rem;
    display: flex;
    justify-content: space-between; /* Space items between the edges */
    align-items: center;
}

.stats h2:last-child {
    margin-left: auto; /* Push the second h2 to the right edge */
}

.pen-icon {
    box-sizing: border-box;
    padding: 0.5rem;
    border-radius: 0.1rem;
}

.pen-icon:hover {
    cursor: pointer;
    border: 1px solid rgb(77, 77, 77);
    transform: scale(1.05); /* Scale the image slightly on hover */
}

/* Button styling starts */

.button-component {
        font-family: 'Comme', sans-serif;
        margin: 0; 
        align-items: center;
        display: flex;
        flex-direction: column; /* Stacks the template-container divs vertically */
    }

    .recipe-link {
        font-family: 'Roboto Condensed', sans-serif;
        background-color: rgb(12, 218, 22);
        color: rgb(223, 223, 223);
        background-size: cover;
        cursor: pointer;
        border: none;
        display: flex;
        align-items: center;
        padding: 1rem;
        border-radius: 3rem;
        margin-top: 1rem;
        width: calc(60% + 5rem);
        font-size: 1.2em;
    }

    .recipe-link:hover {
        border: 2px solid rgb(7, 148, 14);;
    }

    .emoji {
        text-align: left;
        font-size: 1.5em;
        margin-left: 1vw;
    }

    .modal-btn-text {
        flex: 1;
        text-align: center;
        margin-right: 2vw;
    }

</style>


