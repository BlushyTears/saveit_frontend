<!-- 95% of the layout is static, but few things such as coloring, emojis, content, social links are exclusive and thus are to be generated -->

<!-- Layout.svelte is a hardcoded outcome example of a basic template skeleton.svelte with added customization -->
<!-- Page customization and content is stored in a bucket together -->

<!-- Below is an example of a layout.svelte file that was hardcoded -->

<script>
  import { Router, Link, Route, navigate } from "svelte-routing";
  import Modal from "../lib/modal.svelte";
  import ProfileImg from "../assets/profile.png";
  import { onDestroy, onMount } from "svelte";
  import {savedChanges} from '../lib/builderstore';

  // create an array of boolean variables, one for each modal (button that opens)
  let showModal = [false, false];

  const token = localStorage.getItem("token");
  function handleClick() {
    if (token !== null) {
      navigate("/home");
    } else {
      navigate("/editor");
    }
  }

  // function to open a specific modal
  function openModal(index) {
    showModal[index] = true;
  }

  // function to close a specific modal
  function closeModal(index) {
    showModal[index] = false;
  }

  onMount(() => {

    // We dont have a way of assuming the user didn't wanna save changes if he does leave unsaved, so we set it true upon load instead
    savedChanges.set(true);
    dispatchEvent(new CustomEvent("set-color", { detail: "#dc8d23" }));
  });

</script>

<main>
  <div class="button-component">
    <img
      class="profile-img"
      src={ProfileImg}
      alt="Unable to load profile image"
    />
    <h1 style="font-size: 1.5em;">Ellie's coffee n sweets paradise</h1>

    <!-- gotta use a loop to automate this later -->
    <button
      class="recipe-link"
      style="background-image: url();"
      on:click={() => openModal(0)}
    >
      <span class="emoji">🍪</span>
      <h2 class="modal-btn-text">Chocolate Chip Cookies</h2>
    </button>

    <button
      class="recipe-link"
      style="background-image: url();"
      on:click={() => openModal(1)}
    >
      <span class="emoji">☕</span>
      <h2 class="modal-btn-text">Salted caramel espresso shake</h2>
    </button>
  </div>

  <!-- need to use a loop to automate this later -->
  <div class="template-container">
    <Modal bind:showModal={showModal[0]} on:closeModal={() => closeModal(0)}>
      <!-- modal content example hardcoded -->
      <h1 class="modal-title">Chocolate Chip Cookies 🍪</h1>

      <h2>Ingredients:</h2>
      <ul>
        <li>1 cup of logic-inspired flour</li>
        <li>1/2 cup of procedural provisions sugar</li>
        <li>1 teaspoon of musical mode vanilla extract</li>
        <li>1/4 cup of structural substance butter (room temperature)</li>
        <li>2 large grammatical eggs</li>
        <li>A pinch of statistical mode salt</li>
      </ul>

      <h2>Instructions:</h2>
      <ol>
        <li>
          Preheat your oven to 350°F (175°C) and line a baking sheet with
          parchment paper.
        </li>
        <br />
        <li>
          In a mixing bowl, combine the logic-inspired flour, procedural
          provisions sugar, and the pinch of statistical mode salt. Mix them
          well together to ensure an even distribution.
        </li>
        <br />
        <li>
          Cream the structural substance butter in a separate large bowl using
          an electric mixer until it becomes light and fluffy.
        </li>
        <br />
        <li>
          Add the musical mode vanilla extract to the butter and continue mixing
          until fully incorporated.
        </li>
        <br />
        <li>
          Gradually beat in the large grammatical eggs, one at a time, ensuring
          each egg is well combined before adding the next.
        </li>
        <br />
        <li>
          Slowly add the dry ingredients from the first mixing bowl to the wet
          ingredients in the large bowl. Mix them together until you have a
          smooth and coherent cookie dough.
        </li>
        <br />
        <li>
          Take small portions of the dough and shape them into cookies. You can
          use your hands to form round shapes or use cookie cutters for more
          structured modal cookies.
        </li>
        <br />
        <li>
          Place the cookies on the prepared baking sheet, leaving some space
          between each cookie.
        </li>
        <br />
        <li>
          Bake the cookies in the preheated oven for approximately 10-12 minutes
          or until the edges turn golden brown.
        </li>
        <br />
        <li>
          Once baked, remove the cookies from the oven and let them cool on a
          wire rack.
        </li>
      </ol>

      <br />
      <p>
        Your delightful Modal Cookies are now ready to be enjoyed! Store any
        leftovers in an airtight container to keep them fresh.
      </p>

      <p>
        These cookies offer a unique blend of logic-inspired flavors, musical
        mode sweetness, and structural substance textures, making them a truly
        exceptional treat for any cookie enthusiast!
      </p>
    </Modal>
  </div>

  <div class="template-container">
    <Modal bind:showModal={showModal[1]} on:closeModal={() => closeModal(1)}>
      <!-- modal content example 2 -->
      <h1 class="modal-title">Salted caramel espresso shake ☕</h1>

      <h2>Ingredients:</h2>
      <ul>
        <li>1 cup of strong brewed coffee, chilled</li>
        <li>1/2 cup of milk</li>
        <li>2 tablespoons of salted caramel sauce</li>
        <li>1 tablespoon of granulated sugar</li>
        <li>1/4 teaspoon of vanilla extract</li>
        <li>Ice cubes</li>
        <li>Whipped cream (optional, for topping)</li>
        <li>Additional salted caramel sauce (optional, for drizzling)</li>
      </ul>

      <h2>Instructions:</h2>
      <ol>
        <li>
          Brew a cup of strong coffee and let it cool in the refrigerator until
          chilled.
        </li>
        <br />
        <li>
          In a blender, combine the chilled coffee, milk, salted caramel sauce,
          granulated sugar, and vanilla extract.
        </li>
        <br />
        <li>Blend the mixture until it becomes smooth and well-combined.</li>
        <br />
        <li>Fill a glass with ice cubes to your preference.</li>
        <br />
        <li>
          Pour the blended salted caramel coffee mixture over the ice cubes.
        </li>
        <br />
        <li>
          If desired, top the latte with whipped cream for an extra indulgent
          treat.
        </li>
        <br />
        <li>
          For a finishing touch, drizzle some additional salted caramel sauce
          over the whipped cream.
        </li>
      </ol>

      <br />
      <p>
        Your delightful Salted Caramel Iced Latte is now ready to be enjoyed!
        Sip and savor the perfect balance of sweet and salty flavors in this
        refreshing coffee beverage.
      </p>
    </Modal>
  </div>
  <div class="footer">
    <a href={token !== null ? '/home' : '/editor'} class="nav-link" on:click={handleClick}>
      <img class="logo" alt="Logo" />
    </a>
  </div>
</main>

<style>
  /* Roboto and roboto condensed fonts respectively */
  @font-face {
    font-family: "Monofonto";
    src: url("/fonts/monofonto rg.otf") format("opentype");
  }

  h1,
  h2,
  h3,
  p,
  a {
    font-family: "Monofonto", fallback, sans-serif;
  }

  main {
  background: #dc8d23;
  min-height: 90rem;
  overflow-y: hidden;
}

  .profile-img {
    border-radius: 50%;
    height: 10rem;
    width: 10rem;
  }

  .logo {
    height: 5rem;
    width: 5rem;
  }

  .button-component {
    margin: 0;
    align-items: center;
    display: flex;
    flex-direction: column; /* Stacks the template-container divs vertically */
  }

  .recipe-link {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgb(223, 223, 223);
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
      1px 1px 0 #000;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    border-radius: 3rem;
    margin-top: 1rem;
    width: calc(60% + 5rem);
    font-size: 1.2em;
  }

  .recipe-link:hover {
    border-bottom: 4px solid rgba(0, 0, 0, 0); /* Set the border style as you like */
  }

  .recipe-link-2:hover {
    border-bottom: 4px solid rgba(0, 0, 0, 0); /* Set the border style as you like */
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

  .footer {
    text-align: center;
    position: fixed; /* Use fixed positioning to keep it at the bottom */
    left: 0; /* Align the left edge of the footer with the left edge of the screen */
    right: 0; /* Align the right edge of the footer with the right edge of the screen */
    bottom: 0;
  }

  /* A bad way of removing the footer in the unlikely event that the user shrinks screenheight */
  /* Solution: Calculate how many buttons a page has and calculate that height instead of hardcoding to e.g 600px */
  @media screen and (max-height: 700px) {
    .footer {
      display: none;
    }
  }
</style>
