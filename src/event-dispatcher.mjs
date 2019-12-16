/**
 * Register event listeners and dispatch events.
 */
const EventDispatcher = () => {

  const listeners = {};

  /**
   * Store listener with callback function per type.
   */
  const add = (type, fn) => listeners.type = [...listeners.type || [], fn];

  /**
   * Dispatch events to a certain listener type.
   */
  const dispatch = (type, ...args) => listeners.type
      ? listeners.type.forEach(fn => fn(...args))
      : undefined;

  return {
    add,
    dispatch,
    listeners,
  };

};

export default EventDispatcher;
