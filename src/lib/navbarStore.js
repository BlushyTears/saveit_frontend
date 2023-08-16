import { writable } from 'svelte/store';

// Initialize the store with a default value, using localStorage as fallback
const navbarStored = localStorage.getItem('showNavbar');
const navbarInit = navbarStored !== null ? navbarStored === 'true' : true;
export const showNavbar = writable(navbarInit);

// Subscribe to changes in the store and update localStorage accordingly
showNavbar.subscribe(value => {
  localStorage.setItem('showNavbar', value.toString()); // Convert boolean to string
});

