import Config from './config';
import Dialog from './dialog';
import EventDispatcher from './event-dispatcher';
import Preferences from './preferences';
import Storage from './storage';

/**
 * @TODO
 * - Trigger dialog with trigger (update settings)
 * - GTM trigger (`event`: `cookieConsent`, types...)
 * - Content checker (e.g. `data-cookie-consent="marketing"`)
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

  // Construct config.
  const config = new Config(settings);
  const dialog = new Dialog(config);
  const events = new EventDispatcher();
  const preferences = new Preferences({ storage, prefix: config.get('prefix') });

  // Initialize dialog and bind `submit` event.
  dialog.init();
  dialog.on('submit', prefs => {
    preferences.update(prefs);
    events.dispatch('update', prefs);
  });

  // Show dialog if no preferences are found, or fire the `update` event.
  if (preferences.has()) {
    events.dispatch('update', preferences.get());
  } else {
    window.setTimeout(() => dialog.show(), 100);
  }

  return {
    getDialog: () => dialog.element,
    hideDialog: () => dialog.hide,
    showDialog: () => dialog.show,
    getPreferences: preferences.get,
    on: events.add,
  };
};

export default CookieConsent;
