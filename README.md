# Cookie Consent

[![Build Status](https://travis-ci.com/grrr-amsterdam/cookie-consent.svg?branch=master)](https://travis-ci.com/grrr-amsterdam/cookie-consent)

### JavaScript utility library

- No dependencies
- Customizable cookie types (required, pre-checked, labeling)
- Conditional script tags, iframes and elements based on cookie consent and type

Built with ❤️ by [GRRR](https://grrr.tech).

## Installation

```sh
$ npm install @grrr/cookie-consent
```

Note: depending on your setup [additional configuration might be needed](https://github.com/grrr-amsterdam/cookie-consent/wiki/Usage-with-build-tools), since this package is published with untranspiled JavaScript.

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

### Conditional script tags

To conditionally show scripts, add the `data-cookie-consent`-attribute with the id of the required cookie consent type, and disable the script by setting the `type` to `text/plain`:

```js
// External script.
<script src="https://..." data-cookie-consent="marketing" type="text/plain"></script>

// Inline script.
<script data-cookie-consent="marketing" type="text/plain">
    alert('hello world');
</script>
```

### Conditional iframe embeds

To conditionally show or hide iframes, add the `data-cookie-consent`-attribute with the id of the required cookie consent type, and disable the iframe renaming the `src`-attribute to `data-src`:

```html
<iframe data-cookie-consent="marketing" data-src="https://..."></iframe>
```

### Conditional content

To conditionally show or hide elements, add the `data-cookie-consent-<state>`-attribute with the id of the required cookie consent type. There are two types of state: `accepted` and `rejected`.

```html
<div data-cookie-consent-accepted="marketing" hidden>Accepted</div>
<div data-cookie-consent-rejected="marketing" hidden>Rejected</div>
```

When hiding, the module will add `aria-hidden="true"` and `style="display: none;"` to remove it from the DOM.
When showing, the module will remove any inline set `display` style, along with any `hidden` or `aria-hidden` attributes.

## Options

```js
{
  prefix: 'cookie-consent', // The prefix used to 
  append: true,            //
  cookies: [
    {
      id: 'functional',    // The identifier of the cookie
      label: 'Functional', // The label used in the dialog
      description: '...',  // The discription used in the dialog
      required: true,      // Mark a cookie required
      checked: true,       // The default checked state (only valid if optional)
    },
  ],
  labels: {
    title: 'Cookies & Privacy',
    description: '<p>Lorem ipsum <a href="#">privacy policy</a>.</p>',
    button: 'Ok',
    aria: {
      button: 'Confirm cookie settings',
      tabList: 'List with cookie types',
      tabToggle: 'Toggle cookie tab',
    },
  },
}
```

## API

To make the module globally available, simply add it as a global after invoking it:

```js
window.CookieConsent = cookieConsent;
```

### new CookieConsent(options: object)

...

### CookieConsent.getDialog()

...

### CookieConsent.showDialog()

...

### CookieConsent.hideDialog()

...

### CookieConsent.getPreferences()

...

### CookieConsent.on(type: string)

...

## Events

### set

```js
cookieConsent.on('set', cookies => {
  const accepted = cookies.filter(cookie => cookie.accepted);
  const dataLayer = window.dataLayer || [];
  accepted.forEach(cookie => dataLayer.push({ event: 'cookieConsent', cookieType: cookie.id }));
});
```

## Styling

...

<img width="440" alt="Screenshot of the GDPR proof cookie consent dialog from @grrr/cookie-consent" src="https://user-images.githubusercontent.com/1607628/70926276-1f5c9600-202d-11ea-9772-90fd56b5861d.png">
