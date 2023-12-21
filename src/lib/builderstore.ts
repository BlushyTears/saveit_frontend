import { writable } from "svelte/store";

interface ColorSet {
  text: {
    color: string;
    alpha: number;
  };
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

interface ColorMiscSet {
  body: {
    color: string;
    alpha: number; // Adding alpha to store
  };
}

export const buttonColors = writable<ColorSet[][]>([]);
export const borderRadius = writable([]);
export const textThickness = writable([]);
export const buttonNames = writable([]);
export const showModal = writable([false]);
export const showPreviewModal = writable([false]);
export const showEditBtnModal = writable([false]);
export const showEditBgColorModal = writable(false);
export const showEditLinksPickerModal = writable(false);
export const editedText = writable("My page");
export const inputTextList = writable([""]); // should have the same initial length as buttonNames
export const socialLinksList = writable<{[key: string]: string }>({}); // Initially we hard code these keys and values, but in the future the 
// user will do that according to their preferences (maybe you want it ordered a specific way etc), that's why hashmap works well now and in future
export const btnCount = writable(0); // Initialize as an integer
export const containerCount = writable(0); // Initialize as an integer

export const bodyBackgroundColor = writable<ColorMiscSet>({
  body: {
    color: "#474a71", // initialize with a valid color value
    alpha: 1, // initialize alpha to 1
  },
});

export const titleColor = writable<ColorMiscSet>({
  body: {
    color: "#ffffff", // initialize with a valid color value
    alpha: 1, // initialize alpha to 1
  },
});

const DEFAULT_VALUES = {
  buttonColors: [],
  borderRadius: [],
  textThickness: [],
  buttonNames: [],
  showModal: [false],
  showPreviewModal: [false],
  showEditBtnModal: [false],
  showEditBgColorModal: false,
  showEditLinksPickerModal: false,
  editedText: "",
  inputTextList: [""],
  socialLinksList: {},
  btnCount: 0,
  containerCount: 0,
  bodyBackgroundColor: {
    body: {
      color: "#474a71",
      alpha: 1,
    },
  },
  titleColor: {
    body: {
      color: "#474a71",
      alpha: 1,
    },
  },
};

// Used for keeping track of all stores whenever updating them
export const stores = {
  titleColor,
  buttonColors,
  borderRadius,
  textThickness,
  buttonNames,
  showModal,
  showPreviewModal,
  showEditBtnModal,
  editedText,
  inputTextList,
  socialLinksList,
  showEditBgColorModal,
  showEditLinksPickerModal,
  bodyBackgroundColor,
};

export function initializeStoresWithLocalStorage() {
  Object.keys(stores).forEach((key) => {
    try {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        stores[key].set(parsedData);
      } else {
        throw new Error("No stored data found");
      }
    } catch (error) {
      console.warn(`Using default value for ${key} due to: ${error.message}`);
      stores[key].set(DEFAULT_VALUES[key]);
    }

    // Subscribe to the store and update the localStorage whenever the store value changes
    stores[key].subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  });
}

// Miscs (probably needs its own file if it gets too big):
export const linkname = writable("");
export const savedChanges = writable(true);
export const isEmailVerified = writable(false);
export const currentRoute = writable(null);
export const userImage = writable("");
export const userWallpaper = writable("");

export function setImage(newImage: string) {
  userImage.set(newImage); // Use the set method to update the store's value
}

export function clearImage() {
  userImage.set(""); // Set to an empty string (or null if you want, but ensure the initial value and this match in type)
}

export function setWpImage(newImage: string) {
  userWallpaper.set(newImage); // Use the set method to update the store's value
}

export function clearWpImage() {
  userWallpaper.set(""); // Set to an empty string (or null if you want, but ensure the initial value and this match in type)
}
