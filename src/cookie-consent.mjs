import Config from './config';
import Dialog from './dialog';
import DomToggler from './dom-toggler';
import EventDispatcher from './event-dispatcher';
import Preferences from './preferences';
import Storage from './storage';

/**
 * @TODO
 * - Fix event binding...
 * - Update settings (new labels)
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
  domToggler.toggle(preferences.get());

  // Initialize dialog and bind `submit` event.
  dialog.init();
  dialog.on('submit', prefs => {
    preferences.update(prefs);
    events.dispatch('set', prefs);
    domToggler.toggle(prefs);
  });

  // Append the dialog to the DOM, if this is not explicitly prevented.
  if (config.get('append') !== false) {
    const appendEl = document.querySelector('main') || document.body.firstElementChild;
    document.body.insertBefore(dialog.element, appendEl);
  }

  // Show dialog if no preferences are found, or fire the `set` event.
  if (preferences.has()) {
    const prefs = preferences.getAll();
    events.dispatch('set', prefs);
  } else {
    // Force a small timeout, to make sure any transition happens in the next cycle.
    window.setTimeout(() => dialog.show(), 100);
  }

  return {
    getDialog: () => dialog.element,
    hideDialog: dialog.hide,
    showDialog: dialog.show,
    // dialog: {
    //   element: dialog.element,
    //   show: dialog.show,
    //   hide: dialog.hide,
    // },
    getPreferences: preferences.get,
    on: events.add,
  };

};

export default CookieConsent;
