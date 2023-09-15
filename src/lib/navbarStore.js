import { writable } from "svelte/store";

// This is a meme-y solution to router lib not being responsive/reactive enough. 
// Basically we have to remove the navbar manually as the user routes to mypage and add it 
// once the user comes back. The code is to be found in app.svelte currently.
const storedValue = localStorage.getItem("setting");
const defaultSetting = "navbar"; // Set a default value if you like
const initSetting = storedValue !== null ? storedValue : defaultSetting;
export const currentSetting = writable(initSetting);

// Subscribe to changes in the store and update localStorage accordingly
currentSetting.subscribe((value) => {
  if (["navbar", "layout", "oauth"].includes(value)) {
    localStorage.setItem("setting", value);
  }
});
