import { htmlToElement } from '@grrr/utils';
import EventDispatcher from './event-dispatcher';

const DialogTabList = config => {

  const events = new EventDispatcher();
  const prefix = config.get('prefix');

  /**
   * @TODO render with preferences when opened that way...
   */
  const renderTab = (type, index) => {
    return `
      <li role="presentation">
        <header class="${prefix}__tab">
          <label>
            <input type="checkbox" name="${type.id}" checked="${type.required}" ${type.required ? 'disabled' : ''}>
            ${type.label}
          </label>
          <a
            class="${prefix}__toggle"
            role="tab"
            id="${prefix}-tab-${index}"
            href="#${prefix}-tabpanel-${index}"
            aria-controls="${prefix}-tabpanel-${index}"
            aria-selected="false"
            aria-label="${config.get('ariaLabels.tabToggle')}">
            <svg width="28" height="18" viewBox="0 0 28 18" xmlns="http://www.w3.org/2000/svg"><g stroke-width="2" fill="none" fill-rule="evenodd"><path d="M1 9h24" stroke-linecap="square"/><path d="M18 1l8 8-8 7.415"/></g></svg>
          </a>
        </header>
        <div
          class="${prefix}__tabpanel"
          role="tabpanel"
          id="${prefix}-tabpanel-${index}"
          aria-labelledby="${prefix}-tab-${index}"
          aria-hidden="true">
          ${type.description}
        </div>
      </li>
    `;
  };

  const renderTabList = () => {
    const cookieTypes = config.get('cookieTypes', true) || [];
    return `
      <ul class="${prefix}__tablist" role="tablist" aria-label="${config.get('ariaLabels.tabList')}">
        ${cookieTypes.map(renderTab).join('')}
      </ul>
    `;
  }

  const tabList = htmlToElement(renderTabList());

  const selectTab = ({ tabs, panels, targetTab }) => {
    const controls = targetTab ? targetTab.getAttribute('aria-controls') : '';
    tabs.forEach(tab => tab.setAttribute('aria-selected', tab === targetTab));
    panels.forEach(panel => panel.setAttribute('aria-hidden', controls !== panel.id));
  };

  const getValues = () => {
    const inputs = [...tabList.querySelectorAll('input')];
    return inputs.map(input => ({
      id: input.name,
      accepted: input.checked,
    }));
  };

  const addEventListeners = () => {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const panels = [...tabList.querySelectorAll('[role="tabpanel"]')];
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        const targetTab = tab.getAttribute('aria-selected') === 'true' ? null : tab;
        selectTab({ tabs, panels, targetTab });
      });
    });
  };

  addEventListeners();

  return {
    init() {
      //
    },
    on: events.add,
    element: tabList,
    getValues,
  };

};

export default DialogTabList;
