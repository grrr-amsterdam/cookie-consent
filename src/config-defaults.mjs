export const DEFAULTS = {
  type: 'checkbox',
  prefix: 'cookie-consent',
  append: true,
  appendDelay: 500,
  acceptAllButton: false,
  labels: {
    title: 'Cookies & Privacy',
    description: '<p>This site makes use of third-party cookies. Read more in our <a href="/privacy-policy">privacy policy</a>.</p>',
    button: {
      default: 'Save preferences',
      acceptAll: 'Accept all',
    },
    aria: {
      button: 'Confirm cookie settings',
      tabList: 'List with cookie types',
      tabToggle: 'Toggle cookie tab',
    },
  },
};
