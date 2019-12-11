import { parseJson } from '@grrr/utils';
import { PREFIX, STORAGE_KEY_SUFFIX } from './constants';

const Preferences = (storage, prefix = PREFIX) => {
  const key = `${prefix}-${STORAGE_KEY_SUFFIX}`;
  return {
    get: () => parseJson(storage.get(key)),
    update: (cookies = []) => storage.set(key, JSON.stringify(cookies)),
    has: () => storage.has(key),
  };
};

export default Preferences;
