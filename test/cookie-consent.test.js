import CookieConsent from "../src/cookie-consent";

describe("CookieConsent", () => {
  const FOO = { id: "foo", accepted: true };
  const BAR = { id: "bar", accepted: false };
  const COOKIES = [FOO, BAR];

  window.customElements.define("cookie-consent", CookieConsent);

  const cookieConsent = document.createElement("cookie-consent");

  cookieConsent.cookies = COOKIES;

  test("updatePreference", () => {
    const input = [
      { id: "foo", accepted: false },
      { id: "bar", accepted: true },
    ];

    cookieConsent.updatePreference(input);

    expect(cookieConsent.preferences.getAll("foo")).toEqual(input);
  });
});
