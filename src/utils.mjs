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

export const getEntryByDotString = (object, entryString) => {
  // Convert indexes to properties, strip leading dot and create an array.
  const entries = entryString.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
  return entries.reduce((acc, entry) => {
    if (acc && entry in acc) {
      return acc[entry];
    }
    return undefined;
  }, object);
};
