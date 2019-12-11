import { htmlToElement } from '@grrr/utils';
import { PREFIX } from './constants';
import EventDispatcher from './event-dispatcher';
import DialogTabList from './dialog-tablist';

const Dialog = ({ prefix = PREFIX, labels, ariaLabels, cookieTypes }) => {

  const events = new EventDispatcher();

  const renderDialog = () => {
    return `
      <aside class="${prefix} js-cookie-bar" role="dialog" aria-live="polite" aria-describedby="${prefix}-description" aria-hidden="true" outline="0">
        <div class="${prefix}__inner">
          <!--googleoff: all-->
          <div id="${prefix}-description">
            <h1>${labels.title}</h1>
            ${labels.description}
          </div>
          <form>
            <button class="${prefix}__button" aria-label="${ariaLabels.button}"><span>${labels.button}</span></button>
          </div>
          <!--googleon: all-->
        </div>
      </aside>
    `;
  }

  const dialog = htmlToElement(renderDialog());
  const form = dialog.querySelector('form');

  return {
    init() {
      const tabList = new DialogTabList({ prefix, cookieTypes, ariaLabels });
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
