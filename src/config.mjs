import { DEFAULTS } from '../data/defaults';
import { getEntryByDotString } from './utils';

const Config = settings => {
  return {
    get: (entryString, required = false) => {
      const value = getEntryByDotString(settings, entryString);
      if (!value && required) {
        console.warn(`Setting '${entryString}' is missing.`);
        return undefined;
      }
      return value || getEntryByDotString(DEFAULTS, entryString);
    },
  };
};

export default Config;
