import { htmlToElement, preventingDefault } from '@grrr/utils';
import EventDispatcher from './event-dispatcher';
import DialogTabList from './dialog-tablist';

/**
 * Dialog which is shown to update cookie preferences.
 */
const Dialog = ({ config, preferences }) => {

  const tabList = DialogTabList({ config, preferences });
  const events = EventDispatcher();

  const TYPE = config.get('type');
  const PREFIX = config.get('prefix');

  /**
   * Render dialog element.
   */
  const renderDialog = () => {
    return `
      <aside class="${PREFIX} js-cookie-bar" role="dialog" aria-live="polite" aria-describedby="${PREFIX}-description" aria-hidden="true" tabindex="0">
        <!--googleoff: all-->
        <header class="${PREFIX}__header" id="${PREFIX}-description">
          <h1>${config.get('labels.title')}</h1>
          ${config.get('labels.description')}
        </header>
        <form>
          <button class="${PREFIX}__button" aria-label="${config.get('labels.aria.button')}">
            <span>${config.get('labels.button')}</span>
          </button>
        </form>
        <!--googleon: all-->
      </aside>
    `;
  };

  /**
   * Dialog and form elements.
   */
  const dialog = htmlToElement(renderDialog());
  const form = dialog.querySelector('form');

  /**
   * Hide/show helpers.
   */
  const hide = () => dialog.setAttribute('aria-hidden', 'true');
  const show = () => dialog.setAttribute('aria-hidden', 'false');

  /**
   * Handle form submits.
   */
  const submitHandler = e => {
    e.preventDefault();

    const values = tabList.getValues();

    // Do not close the dialog when the type is `radio` and none are checked.
    if (TYPE === 'radio' && !values.find(v => v.accepted)) {
      return;
    }

    events.dispatch('submit', values);
    hide();
  };

  return {
    init() {
      // Initialize tab list and append it to the form.
      tabList.init();
      form.insertBefore(tabList.element, form.firstElementChild);

      // Attach submit listener to the form.
      form.addEventListener('submit', preventingDefault(submitHandler));
    },
    on: events.add,
    show,
    hide,
    element: dialog,
  };

};

export default Dialog;
