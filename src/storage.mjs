import { supportsLocalStorage } from './utils';

/**
 * Store items in LocalStorage.
 */
const Storage = () => {
  return {
    get: (key, value) => window.localStorage.getItem(key, value),
    set: (key, value) => window.localStorage.setItem(key, value),
    has: key => window.localStorage.getItem(key) !== null,
    isSupported: supportsLocalStorage(),
  };
};

export default Storage;
