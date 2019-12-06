import { PREFIX, STORAGE_KEY_SUFFIX } from './constants';
import { supportsLocalStorage } from './utils';

const Preferences = (storage, prefix = PREFIX) => {
  const key = `${prefix}-${STORAGE_KEY_SUFFIX}`;
  return {
    get: value => storage.get(key, value),
    set: value => storage.set(key, value),
    has: () => storage.has(key),
  };
};

export default Preferences;
