import { writable } from 'svelte/store';

interface ColorSet {
  button: {
    color: string;
    alpha: number;
  };
  hover: {
    color: string;
    alpha: number;
  };
  border: {
    color: string;
    alpha: number;
  };
  shadow: {
    color: string;
    alpha: number;
  };
}
  
export const buttonColors = writable<ColorSet[][]>([]);
export const buttonNames = writable([]);
export const showModal = writable([false]);
export const showEditBtnModal = writable([false]);
export const editedText = writable("Ellie's Recipes!");
export const inputTextList = writable([""]); // should have the same initial length as buttonNames
export const btnCount = writable(0); // Initialize as an integer
export const containerCount = writable(0); // Initialize as an integer