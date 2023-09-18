<script lang="ts">
  import { buttonColors } from "../lib/builderstore";

  export let nameType: string = "Type";
  export let index: number;
  export let subIndex: number;

  let colorDisplay: HTMLElement;
  let hiddenInput: HTMLInputElement;

  $: if (buttonColors && $buttonColors[index] && $buttonColors[index][subIndex]) {
    const selected = $buttonColors[index][subIndex][nameType.toLowerCase()];
    if (selected && selected.color && selected.alpha != null && colorDisplay) {
      colorDisplay.style.backgroundColor = `rgba(${parseInt(selected.color.substring(1, 3), 16)}, ${parseInt(selected.color.substring(3, 5), 16)}, ${parseInt(selected.color.substring(5, 7), 16)}, ${selected.alpha})`;
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
    <label for="color">{nameType}</label>
    <div bind:this={colorDisplay} class="colorDisplay"></div>
  </div>

  <input type="range" min="0" max="1" step="0.01" value={$buttonColors[index][subIndex][nameType.toLowerCase()].alpha} class="alpha-slider" on:input={handleAlphaChange} />
  <input bind:this={hiddenInput} type="color" class="colorPicker hidden" on:input={handleChange} />
</div>


<style>
  .color-container {
    align-items: center;
  }
  .flex-container {
    display: inline-flex;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    padding: 0.3rem 0.6rem;
    border-radius: 0.5rem;
    align-items: center;
    cursor: pointer;
  }

  .colorDisplay {
    width: 1.2rem;
    height: 2.2rem;
    border-radius: 1rem;
    cursor: pointer;
  }
  
  .hidden {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }

  label {
    cursor: pointer;
    margin-right: 0.2rem;
    font-size: 1.3em;
  }

  /* Sliders needs a lot of extra specific css code because browser support for them suck */
.alpha-slider {
  margin-top: 1rem;
  background: none;
  width: calc(1vw + 6rem);
  border-radius: 1rem;
  -webkit-appearance: none;
  appearance: none;
}

.alpha-slider::-webkit-slider-thumb {
  border-radius: 1rem;
  -webkit-appearance: none;
  width: 30px;
  margin-top: -1rem;
  height: 2rem;
  background: #F2F2F2;
  cursor: pointer;
}

.alpha-slider::-moz-range-thumb {
  border-radius: 1rem;
  width: 30px;
  margin-top: -1rem;
  height: 2rem;
  background: #F2F2F2;
  cursor: pointer;
}

.alpha-slider::-webkit-slider-runnable-track {
  padding: 1rem 0;
  border-radius: 1rem;
  height: 2rem;
  margin-top: -1rem;
  height: 2rem;
  cursor: pointer;
  background: #394867;
}

.alpha-slider::-moz-range-track {
  border-radius: 1rem;
  height: 2rem;
  margin-top: -1rem;
  height: 2rem;
  cursor: pointer;
  background: #394867;
}
</style>



