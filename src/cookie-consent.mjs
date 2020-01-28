import Config from './config';
import Dialog from './dialog';
import DomToggler from './dom-toggler';
import EventDispatcher from './event-dispatcher';
import Preferences from './preferences';

/**
 * Main constructor, which provides the API to the outside.
 */
const CookieConsent = settings => {

  // Show warning when settings are missing.
  if (typeof settings !== 'object' || !Object.keys(settings).length) {
    console.warn(`No settings specified.`);
  }

  // Construct 'classes'.
  const config = Config(settings);
  const preferences = Preferences(config.get('prefix'));
  const dialog = Dialog({ config, preferences });
  const domToggler = DomToggler(config);
  const events = EventDispatcher();

  // Update initial content.
  domToggler.toggle(preferences);

  // Initialize dialog and bind `submit` event.
  dialog.init();
  dialog.on('submit', cookies => {
    preferences.store(cookies);
    events.dispatch('update', preferences.getAll());
    domToggler.toggle(preferences);
  });

  // Append dialog to the DOM, if this is not explicitly prevented.
  if (config.get('append') !== false) {
    const appendEl = document.querySelector('main') || document.body.firstElementChild;
    document.body.insertBefore(dialog.element, appendEl);
  }

  // Show the dialog when no preferences are found. If found, fire the `update` event.
  if (preferences.hasPreferences()) {
    events.dispatch('update', preferences.getAll());
  } else {
    // Show the dialog. Invoked via a timeout, to ensure it's added in the next cycle
    // to cater for possible transitions.
    window.setTimeout(() => dialog.show(), 0);
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
