<script lang="ts">
  // bad practice to directly import and hard code because it makes this component not reusable but its too annoying to do properly with 2way bindings
  import { buttonColors } from "../lib/builderstore";

  export let nameType: string = "Type";
  export let index: number;
  export let subIndex: number;

  let colorDisplay: HTMLElement;
  let hiddenInput: HTMLInputElement;

  let safeAlphaValue = 0;
  $: safeAlphaValue = buttonColors && $buttonColors[index] && $buttonColors[index][subIndex] ? $buttonColors[index][subIndex][nameType.toLowerCase()].alpha : 0;

  $: if (buttonColors && $buttonColors[index] && $buttonColors[index][subIndex]) {
    const selected = $buttonColors[index][subIndex][nameType.toLowerCase()];
    if (selected && selected.color && selected.alpha != null && colorDisplay) {
      colorDisplay.style.backgroundColor = `rgba(${parseInt(selected.color.substring(1, 3), 16)}, ${parseInt(selected.color.substring(3, 5), 16)}, ${parseInt(selected.color.substring(5, 7), 16)}, ${selected.alpha})`;
      hiddenInput.value = selected.color; // Set color input value
    }
  }

  function handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const selectedColor = input.value;
    buttonColors.update((colors) => {
      const newColors = JSON.parse(JSON.stringify(colors));
      if (newColors[index] && newColors[index][subIndex]) {
        newColors[index][subIndex][nameType.toLowerCase()].color = selectedColor;
      }
      return newColors;
    });
  }

  function handleAlphaChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const alpha = parseFloat(input.value);
    buttonColors.update((colors) => {
      const newColors = JSON.parse(JSON.stringify(colors));
      if (newColors[index] && newColors[index][subIndex]) {
        newColors[index][subIndex][nameType.toLowerCase()].alpha = alpha;
      }
      return newColors;
    });
  }

  function triggerColorPicker() {
    hiddenInput.click();
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      triggerColorPicker();
    }
  }
</script>

<div class="color-container">
  <div class="flex-container"
    on:click={triggerColorPicker}
    on:keydown={handleKeyDown}
    tabindex="0"
    role="button"
    aria-label="Open color picker">
    <div bind:this={colorDisplay} class="colorDisplay"></div>
  </div>

  <input type="range" min="0" max="1" step="0.01" value={safeAlphaValue} class="alpha-slider" on:input={handleAlphaChange} />
  <input bind:this={hiddenInput} type="color" class="colorPicker hidden" on:input={handleChange} />
</div>

<style>
  .color-container {
    align-items: center;
  }
  .flex-container {
  margin-top: 1rem;
    
    display: inline-flex;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    padding: 0.3rem 0.3rem;
    border-radius: 0.5rem;
    align-items: center;
    cursor: pointer;
  }

  .flex-container:hover {
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
    transition: 0.1s;
  }

  .colorDisplay {
    
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 1rem;
    cursor: pointer;
  }

  
  .hidden {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }

  /* Sliders needs a lot of extra specific css code because browser support for them suck */
.alpha-slider {
  background: none;
  width: calc(1vw + 4rem);
  border-radius: 1rem;
  -webkit-appearance: none;
  appearance: none;
}

.alpha-slider::-webkit-slider-thumb {
  border-radius: 1rem;
  -webkit-appearance: none;
  width: 20px;
  height: 1.2rem;
  background: #F2F2F2;
  cursor: pointer;
}

.alpha-slider::-moz-range-thumb {
  border-radius: 1rem;
  width: 30px;
  height: 1.2rem;
  background: #F2F2F2;
  cursor: pointer;
}

.alpha-slider::-webkit-slider-runnable-track {
  border-radius: 1rem;
  cursor: pointer;
  height: 1.2rem;
  background: #394867;
}

.alpha-slider::-moz-range-track {
  border-radius: 1rem;
  height: 1.2rem;
  cursor: pointer;
  background: #394867;
}
</style>



