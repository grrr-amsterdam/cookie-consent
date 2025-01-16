/* eslint class-methods-use-this:[
  "error",
    {
      "exceptMethods":
        [
          "getConfig",
          "initEventDispatcher",
          "getPreferences",
          "initDomToggler"
        ]
    }
] */

import { htmlToElement, preventingDefault } from "@grrr/utils";
import EventDispatcher from "./event-dispatcher.mjs";
import DialogOptionList from "./dialog-tablist.mjs";
import DomToggler from "./dom-toggler.mjs";

import Config from "./config.mjs";
import Preferences from "./preferences.mjs";

/**
 * Dialog which is shown to update cookie preferences.
 */
export default class Dialog extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
    // sets and returns 'this.shadowRoot'
    this.attachShadow({ mode: "open" });
    // get data
    this.data = this.getData();
    // get config
    this.config = this.getConfig();
    // initialize event dispatcher
    this.events = this.initEventDispatcher();
    // initialize optionlist
    this.optionList = this.initOptionList();
    // get cookies
    this.cookies = this.data.cookies;
    // generate dialog element
    this.dialogElement = this.generateDialogElement();
    // append dialog to shadowRoot
    this.shadowRoot.append(this.dialogElement);
    // get preferences
    this.preferences = this.getPreferences();
    // initialize domtoggler
    this.domToggler = this.initDomToggler();
    // initialize show and hide
    this.show = this.show();
    this.hide = this.hide();
    // get all preferences
    this.preferences.getAll();

    this.domToggler.toggle(this.preferences);

    // if cookie prefs already selected dispatch update event and hide
    if (this.preferences.hasPreferences()) {
      this.events.dispatch("update", this.preferences.getAll());
    }

    // add submit event
    this.events.add("submit", this.updatePreference.bind(this));
  }

  getData() {
    // fallback content from config
    const fallbackContent = {
      title: Config().get("labels.title"),
      description: Config().get("labels.description"),
      saveButtonText: Config().get("labels.aria.button"),
      defaultButtonLabel: Config().get("labels.button.default"),
      acceptAllButton:
        Config().get("acceptAllButton") && !Preferences().hasPreferences(),
    };
    // custom content from data-attributes
    const customContent = {
      title: this.getAttribute("data-title"),
      description: this.getAttribute("data-description"),
      saveButtonText: this.getAttribute("data-saveButtonText"),
    };
    // parse cookies to json
    const cookies = JSON.parse(this.getAttribute("data-cookies"));

    return {
      title:
        customContent.title === null
          ? fallbackContent.title
          : customContent.title,
      description:
        customContent.description === null
          ? fallbackContent.description
          : customContent.description,
      saveButtonText:
        customContent.saveButtonText === null
          ? fallbackContent.defaultButtonLabel
          : customContent.saveButtonText,
      acceptAllButton: fallbackContent.acceptAllButton,
      cookies,
    };
  }

  getConfig() {
    return {
      type: Config().get("type"),
      prefix: Config().get("prefix"),
      dialogTemplate: Config().get("dialogTemplate"),
    };
  }

  initEventDispatcher() {
    return EventDispatcher();
  }

  initOptionList() {
    return DialogOptionList(this.data.cookies);
  }

  generateDialogElement() {
    // Initialize tab list and append it to the form.
    this.optionList.init();

    const template = `
    <div part="${this.config.prefix}" id="${this.config.prefix}" class="${this.config.prefix} js-cookie-bar" role="dialog" aria-hidden="true" aria-label="Cookie banner tabindex="0">
      <!--googleoff: all-->
        <header part="${this.config.prefix}__header" class="${this.config.prefix}__header" id="${this.config.prefix}-description">
          <h1 part="${this.config.prefix}__title">${this.data.title}</h1>
          ${this.data.description}
        </header>
        <form part="${this.config.prefix}__form">
          <button type="button" part="${this.config.prefix}__button" class="${this.config.prefix}__button">
            <span part="${this.config.prefix}__button-text">${this.data.saveButtonText}</span>
          </button>
        </form>
      <!--googleon: all-->
    </div>`;

    const dialogElement = htmlToElement(template);

    dialogElement.insertAdjacentHTML(
      "afterbegin",
      `
    <style>
      .${this.config.prefix}[aria-hidden="true"] {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
        transform: translate(0, 100px);
      }
    </style>`
    );

    const formElement = dialogElement.lastElementChild;

    formElement.addEventListener(
      "submit",
      preventingDefault(this.submitHandler.bind(this))
    );

    dialogElement.insertBefore(this.optionList.element, formElement);

    return dialogElement;
  }

  submitHandler(e) {
    e.preventDefault();
    // Get values based on the rules defined in `composeValues`.
    const values = this.composeValues(this.optionList.getValues());

    if (!values) {
      return;
    }

    // Dispatch values and hide the dialog.
    this.events.dispatch("submit", values);
    // toggleDialogVisibility(this.firstElementChild).hide();
    this.hide();
  }

  composeValues(values) {
    // Checkbox with `acceptAllButton` and no user-choosable option is checked.
    // We compare amount of required options against checked options.

    const requiredCount = this.data.cookies.filter((c) => c.required).length;
    const checkedCount = values.filter((v) => v.accepted).length;
    const userOptionsChecked = checkedCount >= requiredCount;
    if (
      this.data.acceptAllButton &&
      this.config.type === "checkbox" &&
      !userOptionsChecked
    ) {
      return values.map((value) => ({
        ...value,
        accepted: true,
      }));
    }

    // Return the values untouched. Happens for:
    // - Checkbox with or without checked option, except the `acceptAllButton` case above.
    return values;
  }

  getPreferences() {
    const preferences = Preferences(Config().get("prefix"));

    return preferences;
  }

  updatePreference(selectedCookies) {
    this.preferences.store(selectedCookies);
    this.events.dispatch("update", this.preferences.getAll());
    this.domToggler.toggle(this.preferences);
  }

  initDomToggler() {
    return DomToggler(Config());
  }

  show() {
    return () =>
      this.shadowRoot
        .querySelector(".cookie-consent")
        .setAttribute("aria-hidden", "false");
  }

  hide() {
    return () =>
      this.shadowRoot
        .querySelector(".cookie-consent")
        .setAttribute("aria-hidden", "true");
  }

  on(type, payload) {
    return this.events.add(type, payload);
  }

  static get observedAttributes() {
    return ["data-cookies"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    // Set this.cookies to the updated value
    this.cookies = JSON.parse(newValue);
    // Transform NodeList to array
    const arrayfiedOptionList = Array.from(this.optionList.element.children);
    // Filter out all li elements
    const optionListChildren = arrayfiedOptionList.filter(
      (item) => item.nodeName === "LI"
    );
    // Loop through arrayfiedOptionListChildren
    optionListChildren.forEach((input) => {
      // Find all input elements
      const inputElement =
        input.firstElementChild.firstElementChild.firstElementChild;
      // Loop through updated cookies
      this.cookies.forEach((cookie) => {
        // set the checked state to the updated cookie state
        if (inputElement.value === cookie.id && cookie.checked) {
          inputElement.checked = true;
        }
      });
    });
  }
}
