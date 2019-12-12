/**
 * Register event listeners and dispatch events.
 */
const EventDispatcher = () => {
  const listeners = {};
  return {
    add: (type, fn) => listeners.type = [...listeners.type || [], fn],
    dispatch: (type, ...args) => listeners.type.forEach(fn => fn(...args)),
    listeners,
  };
};

export default EventDispatcher;
