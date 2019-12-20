# Cookie Consent

[![Build Status](https://travis-ci.com/grrr-amsterdam/cookie-consent.svg?branch=master)](https://travis-ci.com/grrr-amsterdam/cookie-consent)

### JavaScript utility library

- No dependencies
- Customizable cookie types (required, pre-checked, labeling)
- Conditional script tags, iframes and elements based on cookie consent and type

Built with ❤️ by [GRRR](https://grrr.tech).

<img src="https://user-images.githubusercontent.com/1607628/70984703-3cd84100-20bb-11ea-9fa0-0d23c49c0d94.png" alt="Screenshot of the GDPR proof cookie consent dialog from @grrr/cookie-consent" width="422"/>

## Installation

```sh
$ npm install @grrr/cookie-consent
```

Note: depending on your setup [additional configuration might be needed](https://github.com/grrr-amsterdam/cookie-consent/wiki/Usage-with-build-tools). This package is published with untranspiled JavaScript, as EcmaScript Modules (ESM).

## Usage

Import the module and initialize it:

```js
import CookieConsent from '@grrr/cookie-consent';

const cookieConsent = new CookieConsent({
  cookies: [
    {
      id: 'functional',
      label: 'Functional',
      description: 'Lorem ipsum.',
      required: true,
    },  
    {
      id: 'marketing',
      label: 'Marketing',
      description: 'Lorem ipsum.',
      checked: true,
    },
  ],
});
```

### Conditional scripts

Conditionally show `script` tags. Add the `data-cookie-consent`-attribute with the id of the required cookie type, and disable the script by setting the `type` to `text/plain`:

```html
// External script.
<script src="https://..." data-cookie-consent="marketing" type="text/plain"></script>

// Inline script.
<script data-cookie-consent="marketing" type="text/plain">
    alert('hello world');
</script>
```

### Conditional iframe embeds

Conditionally show or hide `iframe` embed. Add the `data-cookie-consent`-attribute with the id of the required cookie consent type, and disable the iframe renaming the `src`-attribute to `data-src`:

```html
<iframe data-cookie-consent="marketing" data-src="https://..."></iframe>
```

### Conditional content

Conditionally show or hide elements. Add the `data-cookie-consent-<state>`-attribute with the id of the required cookie consent type. There are two types of state: `accepted` and `rejected`.

```html
<div data-cookie-consent-accepted="marketing" hidden>Accepted</div>
<div data-cookie-consent-rejected="marketing" hidden>Rejected</div>
```

Notes: 

- When hiding, the module will add `aria-hidden="true"` and `style="display: none;"` to remove it from the DOM.
- When showing, the module will remove any inline set `display` style, along with any `hidden` or `aria-hidden` attributes.

## Options

All options are optional and will fallback to the defaults, except the array of `cookies`.

```js
{
  prefix: 'cookie-consent', // The prefix used for styling and identifiers.
  append: true,             // By default the dialog is appended before the `main` tag or
                            // as the first `body` child. Disable to append it yourself.
  cookies: [                // Array with cookie types. 
    {
      id: 'marketing',      // The unique identifier of the cookie type.
      label: 'Marketing',   // The label used in the dialog.
      description: '...',   // The description used in the dialog.
      required: false,      // Mark a cookie required.
      checked: false,       // The default checked state (only valid when not `required`).
    },
  ],
  labels: {                 // Labels to provide content for the dialog.
    title: 'Cookies & Privacy',
    description: '<p>This site makes use of third-party cookies. Read more in our 
                  <a href="/privacy-policy">privacy policy</a>.</p>',
    button: 'Ok',
    aria: {                 // Some `aria-label`s to improve accessibility.
      button: 'Confirm cookie settings',
      tabList: 'List with cookie types',
      tabToggle: 'Toggle cookie tab',
    },
  },
}
```

## API

- [new CookieConsent()](#new-cookieconsentoptions-object)
- [getDialog()](#getdialog)
- [showDialog()](#showdialog)
- [hideDialog()](#hidedialog)
- [isAccepted()](#isacceptedid-string)
- [getPreferences()](#getpreferences)
- [on()](#on)

### new CookieConsent(options: object)

Will create a new instance.

```js
const cookieConsent = new CookieConsent({
    cookies: [
        // ...
    ]
});
```

To make the instance globally available (for instance to add event listeners elsewhere), add it as a global after the instance has been created:

```js
const cookieConsent = new CookieConsent();

window.CookieConsent = cookieConsent;
```

### getDialog()

Will fetch the dialog element, for example to append it at a custom DOM position.

```js
document.body.insertBefore(cookieConsent.getDialog(), document.body.firstElementChild);
```

### showDialog()

Will show the dialog element, for example to show it when triggered to change settings.

```js
el.addEventListener('click', e => {
  e.preventDefault();
  cookieConsent.showDialog();
});
```

### hideDialog()

Will hide the dialog element.

```js
el.addEventListener('click', e => {
  e.preventDefault();
  cookieConsent.hideDialog();
});
```

### isAccepted(id: string)

Check if a certain cookie type has been accepted. Will return `true` when accepted, `false` when denied, and `undefined` when no action has been taken.

```js
const acceptedMarketing = cookieConsent.isAccepted('marketing'); // => true, false, undefined
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

### on(event: string)

Add listeners for events. Will fire when the event is dispatched from the CookieConsent module.
See available [events](#events).

```js
cookieConsent.on('event', eventHandler);
```

## Events

Events are bound by the [on](#onevent-string) method.

- [set](#set)

### update

Will fire whenever the cookie settings are updated, or when the instance is constructed and stored preferences are found. It returns the array with cookie preferences, identical to the `getPreferences()` method.

This event can be used to fire tag triggers for each cookie type, for example via Google Tag Manager (GTM). In the following example trackers are loaded via a trigger added in GTM. Each cookie type has it's own trigger, based on the `cookieType` variable, and the trigger itself is invoked by the `cookieConsent` event.

Example:

```js
cookieConsent.on('update', preferences => {
  const accepted = preferences.filter(cookie => cookie.accepted);
  const dataLayer = window.dataLayer || [];
  accepted.forEach(cookie => dataLayer.push({ 
      event: 'cookieConsent', 
      cookieType: cookie.id,
  }));
});
```

## Styling

No styling is being applied by the JavaScript module. However, there is a default stylesheet in the form of a Sass module which can easily be added and customized to your project and its needs.

...

![Screenshot of the GDPR proof cookie consent dialog from @grrr/cookie-consent](https://user-images.githubusercontent.com/1607628/70981646-d43a9580-20b5-11ea-8308-ddef988afde0.png)
