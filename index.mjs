import Dialog from './src/dialog';
import Preferences from './src/preferences';
import Storage from './src/storage';

const CookieConsent = config => {
  // Check config.
  if (!config) {
    return console.warn(`No config specified.`);
  }

  // Check if LocalStorage is supported.
  const storage = new Storage();
  if (!storage.supported) {
    return console.warn(`LocalStorage is not supported.`);
  }

  // Initialize dialog and append it to the DOM.
  const dialog = new Dialog(config);
  dialog.init();
  dialog.on('submit', prefs => preferences.update(prefs));

  // @TODO think about this...
  if (config.addDialog) {
    config.addDialog(dialog.element);
  } else {
    document.body.insertBefore(dialog.element, document.body.firstElementChild);
  }

  // Initialize preferences and show dialog if none are found.
  const preferences = new Preferences(storage, config.prefix);
  if (!preferences.has()) {
    window.setTimeout(() => dialog.show(), 100);
  }

  return {
    dialog: dialog.element,
  };
};

export default CookieConsent;

/**
 * @TODO
 *
 * - `settings` can be either appended directly or from a global...?
 *
 * - Dialog with content from 'CMS' (incl. array of cookie types)
 * - Store in LocalStorage + check
 * - Trigger dialog with trigger (update settings)
 * - GTM trigger (`event`: `cookieConsent`, types...)
 * - Consent listeners (`cookieConsent.on('consent')`, ...)
 * - Content checker (e.g. `data-cookie-consent="marketing"`)
 */
