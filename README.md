# Cookie Consent

[![Build Status](https://travis-ci.com/grrr-amsterdam/cookie-consent.svg?branch=master)](https://travis-ci.com/grrr-amsterdam/cookie-consent)

### JavaScript utility library

- No dependencies
- Customizable cookie types (required, pre-checked)
- Conditional script tags, iframes and elements based on cookie type consent

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
  // options...
});
...
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

## Options & Configuration

```js
  prefix: 'cookie-consent',
  append: false,
  checked: true,
  labels: {
    title: 'Cookies & Privacy',
    description: '<p>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus <a href="#">privacy policy</a>.</p>',
    button: 'Ok',
    aria: {
      button: 'Confirm cookie settings',
      tabList: 'List with cookie types',
      tabToggle: 'Toggle cookie tab',
    },
  },
  cookies: [
    {
      id: 'functional',
      label: 'Functional',
      description: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper. Etiam porta sem malesuada magna mollis euismod.',
      required: true,
    },
    {
      id: 'analytical',
      label: 'Analytical',
      description: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper. Etiam porta sem malesuada magna mollis euismod.',
      required: true,
    },
    {
      id: 'marketing',
      label: 'Marketing & Social Media',
      description: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper. Etiam porta sem malesuada magna mollis euismod.',
      checked: true,
    },
  ],
```

### Append dialog at custom DOM position

To append the dialog at a custom position in the DOM, set the auto-appending option to false:

```js
{
    append: false,
}
```

The get the dialog element via the `getDialog()` method, and append it:

```js
document.body.insertBefore(cookieConsent.getDialog(), document.querySelector('main'));
```

### Global

To make the module globally available, simply add it as a global after invoking it:

```js
window.CookieConsent = cookieConsent;
```
