import { htmlToElement, parseJson, preventingDefault } from '@grrr/utils';
import { PREFIX } from './constants';
import EventDispatcher from './event-dispatcher';

const Dialog = ({ prefix = PREFIX, labels, ariaLabels, cookieTypes }) => {

  const events = new EventDispatcher();

  const dialog = htmlToElement(`
    <aside class="${prefix} -dialog js-cookie-bar" role="dialog" aria-live="polite" aria-describedby="${prefix}-description" aria-hidden="true" outline="0">
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
  `);

  return {
    init() {
      dialog.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        // @TODO dispatch FormData or equivalent...
        events.dispatch('submit', 'testing-123');
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
