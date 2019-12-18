import { supportsLocalStorage } from './utils';

/**
 * Store items in LocalStorage.
 */
const Storage = () => {

  const storageModule = supportsLocalStorage() ? window.localStorage : {
    attributes: {},
    setItem(key, val) {
      this.attributes[key] = val;
    },
    getItem(key) {
      return this.attributes[key];
    },
  };

  const get = (key, value) => storageModule.getItem(key, value);
  const set = (key, value) => storageModule.setItem(key, value);
  const has = key => storageModule.getItem(key) !== null;

  return {
    get,
    set,
    has,
  };

};

export default Storage;
