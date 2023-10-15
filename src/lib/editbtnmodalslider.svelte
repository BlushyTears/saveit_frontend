<script lang="ts">
    import { borderRadius } from "../lib/builderstore";
  
    export let nameType: string = "Radius";
    export let index: number;
  
    let borderRadiusValue = 0;
  
    $: borderRadiusValue = $borderRadius[index] !== undefined ? $borderRadius[index] : 0;
  
    function handleRadiusChange(e: Event) {
      const input = e.target as HTMLInputElement;
      const radius = parseInt(input.value);
      borderRadius.update((radii) => {
        const newRadii = [...radii];
        newRadii[index] = radius;
        return newRadii;
      });
    }
  </script>
  
  <div class="radius-container">
    <!-- Weird range values since at least for border radius 30px or so is as rounded as it gets, and sliding beyond that just looks weird. -->
    <input type="range" min="0" max="30" step="0.1" value={borderRadiusValue} class="radius-slider" on:input={handleRadiusChange} />
  </div>
  
  <style>
    .radius-container {
      align-items: center;
      display: flex;
    }
  
    .radius-slider {
      background: none;
      width: calc(1vw + 6rem);
      border-radius: 1rem;
      -webkit-appearance: none;
      appearance: none;
    }
  
    .radius-slider::-webkit-slider-thumb {
      border-radius: 1rem;
      -webkit-appearance: none;
      width: 30px;
      height: 1.5rem;
      background: #F2F2F2;
      cursor: pointer;
    }
  
    .radius-slider::-moz-range-thumb {
      border-radius: 1rem;
      width: 30px;
      height: 1.5rem;
      background: #F2F2F2;
      cursor: pointer;
    }
  
    .radius-slider::-webkit-slider-runnable-track {
      border-radius: 1rem;
      cursor: pointer;
      background: #394867;
    }
  
    .radius-slider::-moz-range-track {
      border-radius: 1rem;
      height: 1rem;
      cursor: pointer;
      background: #394867;
    }
  

  </style>
  