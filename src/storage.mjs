import { supportsLocalStorage } from './utils';

/**
 * Store items in LocalStorage.
 */
const Storage = () => {

  const get = (key, value) => window.localStorage.getItem(key, value);
  const set = (key, value) => window.localStorage.setItem(key, value);
  const has = key => window.localStorage.getItem(key) !== null;

  return {
    get,
    set,
    has,
    isSupported: supportsLocalStorage,
  };

};

export default Storage;
