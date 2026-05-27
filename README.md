# Cookie Consent

[![CI status](https://github.com/grrr-amsterdam/cookie-consent/workflows/CI/badge.svg)](https://github.com/grrr-amsterdam/cookie-consent/actions)

### JavaScript utility library

-   No dependencies
-   Customizable cookie types (identifiers, optional/required, pre-checked)
-   Conditional script tags, iframes and elements based on cookie consent and type

<img src="https://user-images.githubusercontent.com/1607628/70984703-3cd84100-20bb-11ea-9fa0-0d23c49c0d94.png" alt="Screenshot of the GDPR proof cookie consent dialog from @grrr/cookie-consent with checkbox inputs" width="50%" style="width: 50%;"/>

### Developed with ❤️ by [GRRR](https://grrr.nl)

-   GRRR is a [B Corp](https://grrr.nl/en/b-corp/)
-   GRRR has a [tech blog](https://grrr.tech/)
-   GRRR is [hiring](https://grrr.nl/en/jobs/)
-   [@GRRRTech](https://twitter.com/grrrtech) tweets

## Installation

```sh
$ npm install @grrr/cookie-consent
```

## Custom element

This cookie-consent module is a [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). This also means that the element is encapsulated in a [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM). Here follows some information of how to implement this custom element in your own project.

## Usage

Import the module and register it as a custom element:

```js
import CookieConsent from "@grrr/cookie-consent";

if (window.customElements.get("cookie-consent") === undefined) {
    window.customElements.define("cookie-consent", cookieConsent);
}
```

Once registered, you can add the cookie-consent element to your HTML there's some optional data you can pass to the element but the only required attribute to pass along are the cookies:

```js
const cookies = [
    {
        id: "functional", // string
        label: functionalCookiesLabel, // string
        description: functionalCookiesDescription, // string
        required: true, // boolean
    },
    {
        id: "marketing", // string
        label: marketingCookiesLabel, // string
        description: marketingCookiesDescription, // string
        checked: marketingCookiesAccepted, // boolean
    },
];
// in order to pass these as a data-attribute we'll need to transform them to a string first
const stringifiedCookies = JSON.stringify(cookies);
```

```html
<cookie-consent data-cookies="cookies" />;
```

## Options

As mentioned before there is some optional data you can pass to the element:

-   title `string`
-   description `string`
-   save button text `string`

To use the options, add them as data attributes to the custom element:

```js
<cookie-consent
    data-title="Cookies & Privacy" // The title of the dialog.
    data-description="<p>This site makes use of third-party cookies.
    Read more in our <a href='/privacy-policy'>privacy policy</a>.</p>"  // The description of the dialog.
    data-saveButtonText="Save preferences" // The save button label.
    data-cookies=cookies
/>

```

All options except `cookies` are optional. They will fall back to the defaults, which are listed here:

```js
export const DEFAULTS = {
    prefix: "cookie-consent",
    append: true,
    appendDelay: 500,
    acceptAllButton: false,
    labels: {
        title: "Cookies & Privacy",
        description:
            '<p>This site makes use of third-party cookies. Read more in our <a href="/privacy-policy">privacy policy</a>.</p>',
        button: {
            default: "Save preferences",
            acceptAll: "Accept all",
        },
        aria: {
            button: "Confirm cookie settings",
            tabList: "List with cookie types",
            tabToggle: "Toggle cookie tab",
        },
    },
};
```

## API

-   [show()](#show)
-   [hide()](#hide)
-   [getPreferences()](#getpreferences)
-   [updatePreference()](#updatePreferencecookies-array)
-   [on()](#on)

### show()

Will show the dialog element, for example to show it when triggered to change settings.

```js
button.addEventListener("click", (e) => {
    e.preventDefault();
    cookieConsent.show();
});
```

### hide()

Will hide the dialog element.

```js
button.addEventListener("click", (e) => {
    e.preventDefault();
    cookieConsent.hide();
});
```

### getPreferences()

Will return an array with preferences per cookie type.

```js
const preferences = cookieConsent.getPreferences();

// [
//   {
//     "id": "analytical",
//     "accepted": true
//   },
//   {
//     "id": "marketing",
//     "accepted": false
//   }
// ]
```

### updatePreference(cookies: array)

Update cookies programmatically.

By updating cookies programmatically, the event handler will receive an update method.

```js
const cookies = [
    {
        id: "marketing",
        label: "Marketing",
        description: "...",
        required: false,
        checked: true,
    },
    {
        id: "simple",
        label: "Simple",
        description: "...",
        required: false,
        checked: false,
    },
];
```

### on(event: string)

Add listeners for events. Will fire when the event is dispatched from the CookieConsent module.
See available [events](#events).

```js
cookieConsent.on("event", eventHandler);
```

## Events

Events are bound by the [on](#onevent-string) method.

-   [update](#update)

### update

Will fire whenever the cookie settings are updated, or when the instance is constructed and stored preferences are found. It returns the array with cookie preferences, identical to the `getPreferences()` method.

This event can be used to fire tag triggers for each cookie type, for example via Google Tag Manager (GTM). In the following example trackers are loaded via a trigger added in GTM. Each cookie type has it's own trigger, based on the `cookieType` variable, and the trigger itself is invoked by the `cookieConsent` event.

Example:

```js
cookieConsent.on("update", (cookies) => {
    const accepted = cookies.filter((cookie) => cookie.accepted);
    const dataLayer = window.dataLayer || [];
    accepted.forEach((cookie) =>
        dataLayer.push({
            event: "cookieConsent",
            cookieType: cookie.id,
        })
    );
});
```

## Styling

No styling is being applied by the JavaScript module. However, there is a default stylesheet in the form of a [Sass](https://sass-lang.com/) module which can easily be added and customized to your project and its needs.

You have to use the `::parts` pseudo-element to style the dialog and its elements due to the Shadow DOM encapsulation. You can style the dialog and its elements by using the following parts:

```scss
cookie-consent::part(cookie-consent) {
    // Styles for the cookie consent dialog
}

/**
 * Header
 */
cookie-consent::part(cookie-consent__header) {
    // Styles for the cookie consent header
}
cookie-consent::part(cookie-consent__title) {
    // Styles for the cookie consent title
}

/**
 * Tabs
 */
cookie-consent::part(cookie-consent__tab-list) {
    // Styles for the cookie consent tab list
}
cookie-consent::part(cookie-consent__tab-list-item) {
    // Styles for the cookie consent tab list item
}
cookie-consent::part(cookie-consent__tab) {
    // Styles for the cookie consent tabs
}

/**
 * Tab option (label with input in it) & tab toggle
 */
cookie-consent::part(cookie-consent__option) {
    // Styles for the tab option label
}
cookie-consent::part(cookie-consent__input) {
    // Styles for the tab option input
}
cookie-consent::part(cookie-consent__tab-toggle) {
    // Styles for the tab toggle
}
cookie-consent::part(cookie-consent__tab-toggle-icon) {
    // Styles for the tab toggle icon
}

/**
 * Tab panel (with description)
 */
cookie-consent::part(cookie-consent__tab-panel) {
    // Styles for the tab panel
}

cookie-consent::part(cookie-consent__tab-description) {
    // Styles for the tab description
}

/**
 * Button
 */
cookie-consent::part(cookie-consent__button) {
    // styles for the consent button
}
cookie-consent::part(cookie-consent__button-text) {
    // Styles for the consent button text
}
```

### Stylesheet

View the [base stylesheet](https://github.com/grrr-amsterdam/cookie-consent/tree/master/styles/cookie-consent.scss).

### Interface

With the styling from the base module applied, the interface will look roughly like this (fonts, sizes and margins might differ):

<img src="https://user-images.githubusercontent.com/1607628/70984703-3cd84100-20bb-11ea-9fa0-0d23c49c0d94.png" alt="Screenshot of the GDPR proof cookie consent dialog from @grrr/cookie-consent with checkbox inputs" width="50%" style="width: 50%;"/>
