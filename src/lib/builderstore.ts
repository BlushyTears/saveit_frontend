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

interface ColorMiscSet {
  bodybackground: {
    color: string;
    alpha: number;  // Adding alpha to store
  };
}

export const buttonNames = writable([]);
export const showModal = writable([false]);
export const showPreviewModal = writable([false]);
export const showEditBtnModal = writable([false]);
export const showEditBgColorModal = writable(false);
export const editedText = writable('My recipes');
export const inputTextList = writable(['']); // should have the same initial length as buttonNames
export const btnCount = writable(0); // Initialize as an integer
export const containerCount = writable(0); // Initialize as an integer

export const bodyBackgroundColor = writable<ColorMiscSet>({
  bodybackground: {
    color: '#474a71',  // initialize with a valid color value
    alpha: 1,  // initialize alpha to 1
  }
});

export const stores = { buttonColors, buttonNames, showModal, 
                      showPreviewModal, showEditBtnModal, editedText, 
                      inputTextList, showEditBgColorModal, bodyBackgroundColor};

export function initializeStoresWithLocalStorage() {
  Object.keys(stores).forEach(key => {
    if (localStorage.getItem(key)) {
      // If key exists in localStorage, set the store with the localStorage value
      stores[key].set(JSON.parse(localStorage.getItem(key)));
    } else {
      // If key does not exist in localStorage, set the localStorage with the current store value
      localStorage.setItem(key, JSON.stringify(stores[key].$));
    }

    // Subscribe to the store and update the localStorage whenever the store value changes
    stores[key].subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  });
}

export const savedChanges = writable(true);
export const currentRoute = writable(null);