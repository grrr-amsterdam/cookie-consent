import CookieConsent from "../src/cookie-consent";

describe("CookieConsent", () => {
  const FOO = { id: "foo", accepted: true };
  const BAR = { id: "bar", accepted: false };
  const COOKIES = [FOO, BAR];

  const cookieConsent = CookieConsent({
    cookies: COOKIES,
  });

  test("updatePreference", () => {
    const input = [
      { id: "foo", accepted: false },
      { id: "bar", accepted: true },
    ];
    cookieConsent.updatePreference(input);
    expect(cookieConsent.getPreferences("foo")).toEqual(input);
  });
});
