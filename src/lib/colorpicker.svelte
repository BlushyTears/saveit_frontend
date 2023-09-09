<script lang="ts">
  export let selectedColor: string = '#ff0000'; // Default color
  export let nameType: string = "Type";
  export let alpha: number = 1.0; // Default alpha value

  let colorDisplay: HTMLElement;
  let hiddenInput: HTMLInputElement;

  function handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    selectedColor = input.value;
    colorDisplay.style.backgroundColor = selectedColor;
  }

  function triggerColorPicker() {
    hiddenInput.click();
  }

  function handleAlphaChange(e: Event) {
    const input = e.target as HTMLInputElement;
    alpha = parseFloat(input.value);
    updateDisplay();
  }

  function updateDisplay() {
    colorDisplay.style.backgroundColor = `rgba(${parseInt(selectedColor.substring(1, 3), 16)}, ${parseInt(selectedColor.substring(3, 5), 16)}, ${parseInt(selectedColor.substring(5, 7), 16)}, ${alpha})`;
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      triggerColorPicker();
    }
  }

</script>

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
    height: 1.2rem;
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
  margin-top: 0.5rem;
  width: calc(1vw + 6rem);
  border-radius: 1rem;
  -webkit-appearance: none;
  appearance: none;
}

.alpha-slider::-webkit-slider-thumb {
  border-radius: 1rem;
  -webkit-appearance: none;
  width: 20px;
  height: 1rem;
  background: #F2F2F2;
  cursor: pointer;
}

.alpha-slider::-moz-range-thumb {
  border-radius: 1rem;
  width: 20px;
  height: 1rem;
  background: #F2F2F2;
  cursor: pointer;
}

.alpha-slider::-webkit-slider-runnable-track {
  border-radius: 1rem;
  width: 100%;
  height: 1rem;
  cursor: pointer;
  background: #394867;
}

.alpha-slider::-moz-range-track {
  border-radius: 1rem;
  height: 1rem;
  width: 100%;
  cursor: pointer;
  background: #394867;
}
</style>


<div class="color-container">
  <!-- <div class="flex-container" on:click={triggerColorPicker}>
    <label for="color">{nameType}</label>
    <div bind:this={colorDisplay} class="colorDisplay" style="background-color: {selectedColor};"></div>
  </div> -->
  <div class="flex-container" 
    on:click={triggerColorPicker}
    on:keydown={handleKeyDown}
    tabindex="0"  
    role="button"  
    aria-label="Open color picker">

  <label for="color">{nameType}</label>
  <div bind:this={colorDisplay} class="colorDisplay" style="background-color: {selectedColor};"></div>
  </div>

  <input type="range" min="0" max="1" step="0.01" bind:value={alpha} class="alpha-slider" on:input={handleAlphaChange} />
  <input bind:this={hiddenInput} type="color" class="colorPicker hidden" bind:value={selectedColor} on:input={handleChange} />
</div>


