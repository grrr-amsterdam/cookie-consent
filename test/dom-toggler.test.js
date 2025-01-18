import DomToggler from "../src/dom-toggler.mjs";
import Preferences from "../src/preferences.mjs";

beforeEach(() => {
  document.body.innerHTML = `
    <div class="test-elementA" data-cookie-consent-accepted="bar"></div>
    <div class="test-elementB" data-cookie-consent-accepted="foo"></div>
    <iframe class="iframe-elementA" data-cookie-consent="bar" data-src="dummysrc.js"></iframe>
    <iframe class="iframe-elementB" data-cookie-consent="foo" data-src="dummysrc.js"></iframe>`;
});

afterEach(() => {
  // Clean up the DOM after each test
  document.body.innerHTML = "";
});

describe("Dom Toggler CookieConsent", () => {
  const FOO = { id: "foo", accepted: true };
  const BAR = { id: "bar", accepted: false };
  const COOKIES = [FOO, BAR];

  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  // Replace the global localStorage with the mock
  Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
  });

  // Set up the mock localstorage use in Preferences
  localStorageMock.getItem.mockReturnValue(JSON.stringify(COOKIES));

  const preferences = Preferences();
  const domToggler = DomToggler(COOKIES);

  test("element with attribute 'data-cookie-consent-accepted' should be hidden without consent", () => {
    domToggler.toggle(preferences);
    const elements = document.body.querySelectorAll(".test-elementA");

    elements.forEach((element) => {
      const attr = element.getAttribute("aria-hidden");
      expect(attr).toBe("true");
    });
  });

  test("element with attribute 'data-cookie-consent-accepted' should be visible with consent", () => {
    domToggler.toggle(preferences);
    const elements = document.body.querySelectorAll(".test-elementB");

    elements.forEach((element) => {
      const attr = element.getAttribute("aria-hidden");
      expect(attr).toBe(null);
    });
  });

  test("iframe with attribute 'data-cookie-consent-accepted' should not load without consent", () => {
    domToggler.toggle(preferences);
    const elements = document.body.querySelectorAll(".iframe-elementA");

    elements.forEach((element) => {
      const attr = element.getAttribute("src");
      expect(attr).toBe(null);
    });
  });

  test("iframe with attribute 'data-cookie-consent-accepted' should load with consent", () => {
    domToggler.toggle(preferences);
    const elements = document.body.querySelectorAll(".iframe-elementB");

    elements.forEach((element) => {
      const attr = element.getAttribute("src");
      expect(attr).toEqual("dummysrc.js");
    });
  });
});
