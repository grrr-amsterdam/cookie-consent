import Config from './src/config';
import Dialog from './src/dialog';
import Preferences from './src/preferences';
import Storage from './src/storage';

/**
 * @TODO
 *
 * - Provide defaults...
 * - Store in LocalStorage + check
 * - Trigger dialog with trigger (update settings)
 * - GTM trigger (`event`: `cookieConsent`, types...)
 * - Consent listeners (`cookieConsent.on('consent')`, ...)
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

  // Initialize dialog and append it to the DOM.
  const dialog = new Dialog(config);
  dialog.init();
  dialog.on('submit', prefs => preferences.update(prefs));

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

  console.log(preferences.get());

  // Make it globally available.
  window[config.get('global')] = {
    hide: dialog.hide,
    show: dialog.show,
    getPreferences: preferences.get,
  };

  return {
    dialog: dialog.element,
  };
};

export default CookieConsent;
