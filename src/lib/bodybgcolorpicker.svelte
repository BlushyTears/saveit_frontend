<script lang="ts">
  import { bodyBackgroundColor } from "./builderstore";

  let colorDisplay: HTMLElement;
  let hiddenInput: HTMLInputElement;

  $: if (bodyBackgroundColor && $bodyBackgroundColor.bodybackground) {
    const selected = $bodyBackgroundColor.bodybackground;
    if (selected && selected.color && colorDisplay) {
      colorDisplay.style.backgroundColor = `rgba(${parseInt(selected.color.substring(1, 3), 16)}, ${parseInt(selected.color.substring(3, 5), 16)}, ${parseInt(selected.color.substring(5, 7), 16)}, ${selected.alpha})`;
    }
}

function handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const selectedColor = input.value;
    bodyBackgroundColor.update(colors => {
      return { 
        ...colors, 
        bodybackground: { 
          color: selectedColor, 
          alpha: colors.bodybackground.alpha // Ensure alpha is included
        } 
      };
    });
}

  function handleAlphaChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const newAlpha = parseFloat(input.value);
    bodyBackgroundColor.update(colors => {
      return {
        ...colors, 
        bodybackground: {
          color: colors.bodybackground.color,
          alpha: newAlpha
        }
      };
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

  <input type="range" min="0" max="1" step="0.01" bind:value={$bodyBackgroundColor.bodybackground.alpha} class="alpha-slider" on:input={handleAlphaChange} />
  <input bind:this={hiddenInput} type="color" class="colorPicker hidden" on:input={handleChange} />
</div>



<style>
.color-container {
  display: flex;
  align-items: center;
  float: right;
  gap: 1rem;
}

.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  border: 2px solid #C4C4C4;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
}

.flex-container:hover {
  background: #f4f4f4;
}

.colorDisplay {
  width: 1.2rem;
  height: 1rem;
  border-radius: 0.5rem;
}

.hidden {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.alpha-slider {
  width: 100px;
  height: 0.3rem;
  border-radius: 0.5rem;
  background: #E5E5E5;
  cursor: pointer;
  appearance: none;
  outline: none;
}

.alpha-slider::-webkit-slider-thumb {
  border-radius: 0.5rem;
  -webkit-appearance: none;
  width: 20px;
  height: 0.8rem;
  background: #2D9CDB;
  cursor: pointer;
  transition: 0.3s;
}

.alpha-slider::-webkit-slider-thumb:hover {
  background: #247AB0;
}

.alpha-slider::-moz-range-thumb {
  border-radius: 0.5rem;
  width: 20px;
  height: 0.8rem;
  background: #2D9CDB;
  cursor: pointer;
}

.alpha-slider::-moz-range-progress {
  background-color: #2D9CDB;
}

.alpha-slider::-webkit-slider-runnable-track {
  cursor: pointer;
  background: #E5E5E5;
}

.alpha-slider::-moz-range-track {
  background: #E5E5E5;
}

</style>




