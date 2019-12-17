import Config from './config';
import Dialog from './dialog';
import DomToggler from './dom-toggler';
import EventDispatcher from './event-dispatcher';
import Preferences from './preferences';
import Storage from './storage';

/**
 * Main constructor, which provides the API to the outside.
 */
const CookieConsent = settings => {

  // Check if any settings are added.
  if (typeof settings !== 'object' || !Object.keys(settings).length) {
    return console.warn(`No settings specified.`);
  }

  // Check if LocalStorage is supported.
  const storage = new Storage();
  if (!storage.isSupported) {
    return console.warn(`LocalStorage is not supported.`);
  }

  // Construct 'classes'.
  const config = new Config(settings);
  const preferences = new Preferences({ storage, prefix: config.get('prefix') });
  const dialog = new Dialog({ config, preferences });
  const domToggler = new DomToggler(config);
  const events = new EventDispatcher();

  // Update initial content.
  domToggler.toggle(preferences);

  // Initialize dialog and bind `submit` event.
  dialog.init();
  dialog.on('submit', cookies => {
    preferences.update(cookies);
    events.dispatch('set', preferences.getAll());
    domToggler.toggle(preferences);
  });

  // Append dialog to the DOM, if this is not explicitly prevented.
  if (config.get('append') !== false) {
    const appendEl = document.querySelector('main') || document.body.firstElementChild;
    document.body.insertBefore(dialog.element, appendEl);
  }

  // Show dialog if no preferences are found. If found, fire the `set` event.
  if (preferences.has()) {
    events.dispatch('set', preferences.getAll());
  } else {
    // Force a small timeout, to make sure any transition happens in the next cycle.
    window.setTimeout(() => dialog.show(), 100);
  }

  return {
    getDialog: () => dialog.element,
    hideDialog: dialog.hide,
    showDialog: dialog.show,
    isAccepted: preferences.getState,
    getPreferences: preferences.getAll,
    on: events.add,
  };

};

export default CookieConsent;
