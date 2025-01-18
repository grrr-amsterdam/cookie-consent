import CookieConsent from "../src/cookie-consent";

describe("CookieConsent", () => {
  const FOO = { id: "foo", accepted: true };
  const BAR = { id: "bar", accepted: false };
  const COOKIES = [FOO, BAR];

  window.customElements.define("cookie-consent", CookieConsent);

  const cookieConsent = document.createElement("cookie-consent");

  test("updatePreference", () => {
    cookieConsent.updatePreference(COOKIES);
    expect(cookieConsent.preferences.getAll()).toEqual(COOKIES);
  });
});
