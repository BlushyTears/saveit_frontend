import { writable } from 'svelte/store';

const storedValue = localStorage.getItem('setting');
const defaultSetting = 'navbar'; // Set a default value if you like
const initSetting = storedValue !== null ? storedValue : defaultSetting;
export const currentSetting = writable(initSetting);

// Subscribe to changes in the store and update localStorage accordingly
currentSetting.subscribe(value => {
  if (['navbar', 'layout', 'oauth'].includes(value)) {
    localStorage.setItem('setting', value);
  }
});