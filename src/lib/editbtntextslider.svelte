<script lang="ts">
  import { writable } from "svelte/store";
  import { textThickness } from "./builderstore";

  export let index: number;

  let value = 0;
  let selectedStore = writable([]); // Default to an empty writable store

  // Horrible solution, should automate these if statements to scale up the process
  $: {
    selectedStore = textThickness;
    value = $selectedStore[index] !== undefined ? $selectedStore[index] : 0;
  }

  function handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const newValue = parseInt(input.value);

    selectedStore.update((values) => {
      const newValues = [...values];
      newValues[index] = newValue;
      return newValues;
    });
  }
</script>

<div class="radius-container">
  <input
    type="range"
    min="0"
    max="900"
    step="0.1"
    {value}
    class="radius-slider"
    on:input={handleChange}
  />
</div>

<style>
  .radius-container {
    margin-top: 1rem;
    align-items: center;
    display: flex;
  }

  .radius-slider {
    background: none;
    width: calc(1vw + 4rem);
    border-radius: 1rem;
    -webkit-appearance: none;
    appearance: none;
  }

  .radius-slider::-webkit-slider-thumb {
    border-radius: 1rem;
    -webkit-appearance: none;
    width: 20px;
    height: 1.2rem;
    background: #f2f2f2;
    cursor: pointer;
  }

  .radius-slider::-moz-range-thumb {
    border-radius: 1rem;
    width: 30px;
    height: 1.2rem;
    background: #f2f2f2;
    cursor: pointer;
  }

  .radius-slider::-webkit-slider-runnable-track {
    border-radius: 1rem;
    cursor: pointer;
    height: 1.2rem;
    background: #394867;
  }

  .radius-slider::-moz-range-track {
    border-radius: 1rem;
    height: 1.2rem;
    cursor: pointer;
    background: #394867;
  }
</style>
