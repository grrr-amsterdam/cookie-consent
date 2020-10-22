import { DEFAULTS } from './config-defaults';
import { getEntryByDotString } from './utils';

/**
 * Config getter with defaults fallback and warning when required values are missing.
 */
const Config = settings => {
  return {
    get: (entryString, required = false) => {
      const value = getEntryByDotString(settings, entryString);
      if (!value && required) {
        console.warn(`Required setting '${entryString}' is missing.`);
        return undefined;
      }
      return value === undefined ? getEntryByDotString(DEFAULTS, entryString) : value;
    },
  };
};

export default Config;
