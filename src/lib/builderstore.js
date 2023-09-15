import { writable } from 'svelte/store';

export const buttonNames = writable([]);
export const showModal = writable([false]);
export const showEditBtnModal = writable([false]);
export const editedText = writable("Ellie's Recipes!");
export const inputTextList = writable([""]); // and so on...
export const btnCount = writable(0); // Initialize as an integer
export const containerCount = writable(0); // Initialize as an integer
