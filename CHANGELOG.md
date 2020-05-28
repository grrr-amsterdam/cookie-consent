# Changelog

This changelog only lists notable changes. Major version are always breaking. Check individual releases (tags) and their commits to see unlisted changes.


### v1.0.0 (2020-05-28)

Adds the `acceptAllButton` option, which changes the `labels.button` setting from a string to an object with multiple values.

This...

```js
labels: {
  button: 'Ok',
},
```

... becomes:

```js
labels: {
  button: {
    default: 'Save preferences',
    acceptAll: 'Accept all',
  },
},
```
