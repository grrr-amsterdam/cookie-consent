import { htmlToElement } from '@grrr/utils';
import EventDispatcher from './event-dispatcher';

/**
 * Dialog tab list with cookie tabs.
 */
const DialogTabList = ({ config, preferences }) => {

  const events = new EventDispatcher();

  const PREFIX = config.get('prefix');

  /**
   * Render cookie tabs.
   */
  const renderTab = ({ id, label, description, required, checked, accepted }, index) => {
    const shouldBeChecked = typeof accepted !== 'undefined'
      ? accepted
      : typeof required !== 'undefined'
        ? required
        : checked;

    return `
      <li role="presentation">
        <header class="${PREFIX}__tab">
          <label class="${PREFIX}__option" data-required="${required}">
            <input type="checkbox" name="${id}" ${shouldBeChecked ? 'checked' : ''} ${required ? 'disabled' : ''}>
            <span>${label}</span>
          </label>
          <a
            class="${PREFIX}__tab-toggle"
            role="tab"
            id="${PREFIX}-tab-${index}"
            href="#${PREFIX}-tabpanel-${index}"
            aria-controls="${PREFIX}-tabpanel-${index}"
            aria-selected="false"
            aria-label="${config.get('labels.aria.tabToggle')}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 16"><path d="M21.5.5l3 3.057-12 11.943L.5 3.557 3.5.5l9 9z"/></svg>
          </a>
        </header>
        <div
          class="${PREFIX}__tab-panel"
          role="tabpanel"
          id="${PREFIX}-tabpanel-${index}"
          aria-labelledby="${PREFIX}-tab-${index}"
          aria-hidden="true">
          <div class="${PREFIX}__tab-description">
            ${description}
          </div>
        </div>
      </li>
    `;
  };

  /**
   * Render cookie tab list.
   */
  const renderTabList = () => {
    const cookies = config.get('cookies', true).map(type => ({
      ...type,
      accepted: preferences.get(type.id) ? preferences.get(type.id).accepted : undefined,
    }));
    return `
      <ul class="${PREFIX}__tab-list" role="tablist" aria-label="${config.get('labels.aria.tabList')}">
        ${cookies.map(renderTab).join('')}
      </ul>
    `;
  }

  /**
   * Tab list element.
   */
  const tabList = htmlToElement(renderTabList());

  /**
   * Simple method to get values from cookie checkboxes.
   */
  const getValues = () => {
    const inputs = [...tabList.querySelectorAll('input')];
    return inputs.map(input => ({
      id: input.name,
      accepted: input.checked,
    }));
  };

  /**
   * Handle tab selection.
   */
  const selectTab = ({ tabs, panels, targetTab }) => {
    const controls = targetTab ? targetTab.getAttribute('aria-controls') : '';
    tabs.forEach(tab => tab.setAttribute('aria-selected', tab === targetTab));
    panels.forEach(panel => panel.setAttribute('aria-hidden', controls !== panel.id));
  };

  /**
   * Attach event listener for tab click event.
   */
  const attachTabClickListeners = () => {
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
      attachTabClickListeners();
    },
    on: events.add,
    element: tabList,
    getValues,
  };

};

export default DialogTabList;
