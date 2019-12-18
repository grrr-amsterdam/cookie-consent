import { parseJson } from '@grrr/utils';

const KEY_SUFFIX = 'preferences';

/**
 * Normalize cookie preferences and set/get from Storage.
 */
const Preferences = ({ storage, prefix }) => {

  const KEY = `${prefix}-${KEY_SUFFIX}`;

  const getAll = () => parseJson(storage.get(KEY)) || [];
  const get = id => getAll().find(type => type.id === id);
  const getState = id => get(id) && get(id).accepted;
  const hasPreferences = () => storage.has(KEY) && getAll().length;
  const store = (cookies = []) => storage.set(KEY, JSON.stringify(cookies));

  return {
    get,
    getAll,
    getState,
    hasPreferences,
    store,
  };

};

export default Preferences;
