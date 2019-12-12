import Config from './config';
import Dialog from './dialog';
import EventDispatcher from './event-dispatcher';
import Preferences from './preferences';
import Storage from './storage';

/**
 * @TODO
 *
 * - Provide defaults...
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
  if (!storage.supported) {
    return console.warn(`LocalStorage is not supported.`);
  }

  // Construct config.
  const config = new Config(settings);
  const events = new EventDispatcher();

  // Initialize dialog and append it to the DOM.
  const dialog = new Dialog(config);
  dialog.init();

  // Handle update...
  dialog.on('submit', prefs => {
    preferences.update(prefs);
    events.dispatch('update', prefs);
  });

  // @TODO think about this...
  if (settings.addDialog) {
    settings.addDialog(dialog.element);
  } else {
    document.body.insertBefore(dialog.element, document.body.firstElementChild);
  }

  // Initialize preferences and show dialog if none are found.
  const preferences = new Preferences({
    storage,
    prefix: config.get('prefix'),
  });
  if (!preferences.has()) {
    window.setTimeout(() => dialog.show(), 100);
  }

  // Make it globally available.
  window[config.get('global')] = {
    hide: dialog.hide,
    show: dialog.show,
    getPreferences: preferences.get,
  };

  return {
    dialog: dialog.element,
    on: events.add,
  };
};

export default CookieConsent;
