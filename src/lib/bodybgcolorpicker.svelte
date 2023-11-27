<script lang="ts">
  import { bodyBackgroundColor, titleColor } from "./builderstore";
  import EditWallPaperModal from "./editwallpapermodal.svelte";

  let bodyColorDisplay: HTMLElement;
  let titleColorDisplay: HTMLElement;
  let hiddenBodyInput: HTMLInputElement;
  let hiddenTitleInput: HTMLInputElement;

  $: if (bodyBackgroundColor && $bodyBackgroundColor.body) {
    const selected = $bodyBackgroundColor.body;
    if (selected && selected.color && bodyColorDisplay) {
      bodyColorDisplay.style.backgroundColor = `rgba(${parseInt(selected.color.substring(1, 3), 16)}, ${parseInt(selected.color.substring(3, 5), 16)}, ${parseInt(selected.color.substring(5, 7), 16)}, ${selected.alpha})`;
      hiddenBodyInput.value = selected.color; // Set color input value
    }
  }

  $: if (titleColor && $titleColor.body) {
    const selected = $titleColor.body;
    if (selected && selected.color && titleColorDisplay) {
      titleColorDisplay.style.backgroundColor = `rgba(${parseInt(selected.color.substring(1, 3), 16)}, ${parseInt(selected.color.substring(3, 5), 16)}, ${parseInt(selected.color.substring(5, 7), 16)}, ${selected.alpha})`;
      hiddenTitleInput.value = selected.color; // Set color input value
    }
  }

  function handleBodyBgChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const selectedColor = input.value;
    bodyBackgroundColor.update(colors => {
      return { 
        ...colors, 
        body: {  // Use body instead of bodybackground
          color: selectedColor, 
          alpha: colors.body?.alpha || 1 // Ensure alpha is included with a fallback
        } 
      };
    });
  }

  function handleTitleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const selectedColor = input.value;
    titleColor.update(colors => {
      return { 
        ...colors, 
        body: {  // Use body instead of title
          color: selectedColor, 
          alpha: colors.body?.alpha || 1 // Ensure alpha is included with a fallback
        } 
      };
    });
  }

  function handleBodyAlphaChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const newAlpha = parseFloat(input.value);
    bodyBackgroundColor.update(colors => {
      return {
        ...colors, 
        bodybackground: {
          color: colors.body.color,
          alpha: newAlpha
        }
      };
    });
  }

  function handleTitleAlphaChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const newAlpha = parseFloat(input.value);
    titleColor.update(colors => {
      return {
        ...colors, 
        title: {
          color: colors.body.color,
          alpha: newAlpha
        }
      };
    });
  }

  function triggerBodyColorPicker() {
    hiddenBodyInput.click();
  }

  function triggerTitleColorPicker() {
    hiddenTitleInput.click();
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      triggerBodyColorPicker();
      triggerTitleColorPicker();
    }
  }

</script>

<!-- Body Background Color Picker -->
<div class="color-container">
  <div class="flex-container"
    on:click={triggerBodyColorPicker}
    on:keydown={handleKeyDown}
    tabindex="0"
    role="button"
    aria-label="Open body color picker">
    <div bind:this={bodyColorDisplay} class="colorDisplay"></div>
  </div>
  <input type="range" min="0" max="1" step="0.01" bind:value={$bodyBackgroundColor.body.alpha} class="alpha-slider" on:input={handleBodyAlphaChange} />
  <input bind:this={hiddenBodyInput} type="color" class="colorPicker hidden" on:input={handleBodyBgChange} />
</div>

<br>
<!-- Title Color Picker -->
<div class="color-container">
  <div class="flex-container"
    on:click={triggerTitleColorPicker}
    on:keydown={handleKeyDown}
    tabindex="0"
    role="button"
    aria-label="Open title color picker">
    <div bind:this={titleColorDisplay} class="colorDisplay"></div>
  </div>
  <input type="range" min="0" max="1" step="0.01" bind:value={$titleColor.body.alpha} class="alpha-slider" on:input={handleTitleAlphaChange} />
  <input bind:this={hiddenTitleInput} type="color" class="colorPicker hidden" on:input={handleTitleChange} />
</div>

<br>

<EditWallPaperModal />

<style>
.color-container {
  display: flex;
  align-items: center;
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
  transition: 0.3s;
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




