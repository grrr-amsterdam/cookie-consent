/**
 * Register event listeners and dispatch events.
 */
const EventDispatcher = () => {

  const listeners = {};
  const queue = {};

  /**
   * Dispatch events to a certain listener type, or store them in a queue.
   */
  const dispatch = (type, payload) => {
    if (listeners[type]) {
      listeners[type].forEach(fn => fn(payload));
    } else {
      queue[type] = [...queue[type] || [], payload];
    }
  };

  /**
   * Store listener with callback function per type. Invoke the queue if it exists.
   */
  const add = (type, fn) => {
    listeners[type] = [...listeners[type] || [], fn];
    if (queue[type]) {
      queue[type].forEach(payload => dispatch(type, payload));
      delete queue[type];
    }
  };

  return {
    add,
    dispatch,
    listeners,
  };

};

export default EventDispatcher;
