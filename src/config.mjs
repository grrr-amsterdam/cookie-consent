const Config = settings => {
  return {
    get: (key, required = true) => {
      if (!settings[key] && required) {
        console.warn(`Setting '${key}' is missing.`)
      }
      return settings[key] || '';
    },
  };
};

export default Config;
