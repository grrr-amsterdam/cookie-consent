import { parseJson } from '@grrr/utils';

const KEY_SUFFIX = 'preferences';

/**
 * Normalize cookie preferences and sent/get the from Storage.
 */
const Preferences = ({ storage, prefix }) => {
  const key = `${prefix}-${KEY_SUFFIX}`;
  return {
    get: () => parseJson(storage.get(key)),
    update: (cookies = []) => storage.set(key, JSON.stringify(cookies)),
    has: () => storage.has(key),
  };
};

export default Preferences;
