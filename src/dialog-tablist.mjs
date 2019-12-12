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
          <label class="${prefix}__option" data-required="${type.required}">
            <input type="checkbox" name="${type.id}" checked="${type.required}" ${type.required ? 'disabled' : ''}>
            <span>${type.label}</span>
          </label>
          <a
            class="${prefix}__tab-toggle"
            role="tab"
            id="${prefix}-tab-${index}"
            href="#${prefix}-tabpanel-${index}"
            aria-controls="${prefix}-tabpanel-${index}"
            aria-selected="false"
            aria-label="${config.get('labels.aria.tabToggle')}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 16"><path d="M21.5.5l3 3.057-12 11.943L.5 3.557 3.5.5l9 9z"/></svg>
          </a>
        </header>
        <div
          class="${prefix}__tab-panel"
          role="tabpanel"
          id="${prefix}-tabpanel-${index}"
          aria-labelledby="${prefix}-tab-${index}"
          aria-hidden="true">
          <div class="${prefix}__tab-description">
            ${type.description}
          </div>
        </div>
      </li>
    `;
  };

  const renderTabList = () => {
    const cookieTypes = config.get('cookies', true) || [];
    return `
      <ul class="${prefix}__tab-list" role="tablist" aria-label="${config.get('labels.aria.tabList')}">
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

  return {
    init() {
      addEventListeners();
    },
    on: events.add,
    element: tabList,
    getValues,
  };

};

export default DialogTabList;
