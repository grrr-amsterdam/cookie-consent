import { htmlToElement } from "@grrr/utils";
import EventDispatcher from "./event-dispatcher.mjs";

import Config from "./config.mjs";
import Preferences from "./preferences.mjs";

/**
 * Dialog tab list with cookie tabs.
 */
const DialogTabList = (cookieInformation) => {
  const events = EventDispatcher();

  const TYPE = Config().get("type");
  const PREFIX = Config().get("prefix");

  /**
   * Render cookie tabs.
   */
  const renderTab = (
    { id, label, description, required, checked, accepted },
    index
  ) => {
    /**
     * Check if the checkbox should be checked:
     *
     * 1. If any preference is saved, use that.
     * 2. If it's explicitly `required` in the settings, mark it checked (ignore
     *    `required: false`, because of #3)
     * 3. Use the `checked` setting.
     */
    const shouldBeChecked = typeof accepted !== "undefined"
      ? accepted
      : required === true ? required
        : checked;

    return `
      <style>
        .${PREFIX}__tab-panel[aria-hidden="true"] {
          display: none;
        }
        .cookie-consent__tab-toggle[aria-selected="true"] > svg {
          transform: scaleY(-1);
        }
      </style>
      <li part="${PREFIX}__tab-list-item" role="presentation">
        <header part="${PREFIX}__tab" class="${PREFIX}__tab">
          <label part="${PREFIX}__option" class="${PREFIX}__option" data-required="${required}">
            <input
              part="${PREFIX}__input"
              type="${TYPE === "radio" ? "radio" : "checkbox"}"
              name="${PREFIX}-input" value="${id}"
              ${shouldBeChecked ? "checked" : ""}
              ${required && TYPE !== "radio" ? "disabled" : ""}>
            <span>${label}</span>
          </label>
          <a
            part="${PREFIX}__tab-toggle"
            class="${PREFIX}__tab-toggle"
            role="tab"
            id="${PREFIX}-tab-${index}"
            href="#${PREFIX}-tabpanel-${index}"
            aria-controls="${PREFIX}-tabpanel-${index}"
            aria-selected="false"
            aria-label="${Config().get("labels.aria.tabToggle")}">
            <svg part="${PREFIX}__tab-toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 16"><path d="M21.5.5l3 3.057-12 11.943L.5 3.557 3.5.5l9 9z"/></svg>
          </a>
        </header>
        <div
          part="${PREFIX}__tab-panel"
          class="${PREFIX}__tab-panel"
          role="tabpanel"
          id="${PREFIX}-tabpanel-${index}"
          aria-labelledby="${PREFIX}-tab-${index}"
          aria-hidden="true">
          <div
            part="${PREFIX}__tab-description"
            class="${PREFIX}__tab-description">
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
    const cookies = cookieInformation || [];

    const cookiesWithState = cookies.map((cookieType) => ({
      ...cookieType,
      accepted: Preferences().get(cookieType.id)
        ? Preferences().get(cookieType.id).accepted
        : undefined,
    }));
    return `
      <ul part="${PREFIX}__tab-list" class="${PREFIX}__tab-list" role="tablist" aria-label="${Config().get("labels.aria.tabList")}">
        ${cookiesWithState.map(renderTab).join("")}
      </ul>
    `;
  };

  /**
   * Tab list element.
   */
  const tabList = htmlToElement(renderTabList());

  /**
   * Simple method to get values from cookie checkboxes.
   */
  const getValues = () => {
    const inputs = [...tabList.querySelectorAll("input")];
    return inputs.map((input) => ({
      id: input.value,
      accepted: input.checked,
    }));
  };

  /**
   * Handle tab selection.
   */
  const selectTab = ({ tabs, panels, targetTab }) => {
    const controls = targetTab ? targetTab.getAttribute("aria-controls") : "";
    tabs.forEach((tab) => tab.setAttribute("aria-selected", tab === targetTab));
    panels.forEach((panel) =>
      panel.setAttribute("aria-hidden", controls !== panel.id));
  };

  /**
   * Attach event listener for tab click event.
   */
  const attachTabClickListeners = () => {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const panels = [...tabList.querySelectorAll('[role="tabpanel"]')];
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = tab.getAttribute("aria-selected") === "true" ? null : tab;
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
