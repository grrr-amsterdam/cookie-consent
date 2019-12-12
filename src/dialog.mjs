import { htmlToElement } from '@grrr/utils';
import EventDispatcher from './event-dispatcher';
import DialogTabList from './dialog-tablist';

const Dialog = config => {

  const events = new EventDispatcher();
  const prefix = config.get('prefix');

  const renderDialog = () => {
    return `
      <aside class="${prefix} js-cookie-bar" role="dialog" aria-live="polite" aria-describedby="${prefix}-description" aria-hidden="true" outline="0">
        <!--googleoff: all-->
        <header class="${prefix}__header" id="${prefix}-description">
          <h1>${config.get('labels.title')}</h1>
          ${config.get('labels.description')}
        </header>
        <form>
          <button class="${prefix}__button" aria-label="${config.get('labels.aria.button')}">
            <span>${config.get('labels.button')}</span>
          </button>
        </form>
        <!--googleon: all-->
      </aside>
    `;
  }

  const dialog = htmlToElement(renderDialog());
  const form = dialog.querySelector('form');

  return {
    init() {
      const tabList = new DialogTabList(config);
      tabList.init();

      form.insertBefore(tabList.element, form.firstElementChild);

      form.addEventListener('submit', e => {
        e.preventDefault();
        events.dispatch('submit', tabList.getValues());
        this.hide();
      });
    },
    on: events.add,
    show: () => dialog.setAttribute('aria-hidden', 'false'),
    hide: () => dialog.setAttribute('aria-hidden', 'true'),
    element: dialog,
  };

};

export default Dialog;
