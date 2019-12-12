/**
 * Test is LocalStorage is supported.
 */
export const supportsLocalStorage = () => {
    const test = 'localstorage-test-key';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
};

/**
 * Get nested entry from an object by dot string notation: `config.get('foo.bar')`.
 */
export const getEntryByDotString = (object, entryString) => {
  const entries = entryString.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
  return entries.reduce((acc, entry) => {
    if (acc && entry in acc) {
      return acc[entry];
    }
    return undefined;
  }, object);
};
