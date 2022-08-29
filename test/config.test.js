import Config from "../src/config";

describe("Config", () => {
  test("append-falsy", () => {
    const config = Config({ append: false });
    expect(config.get("append")).toBeFalsy();
  });

  test("append-truthy", () => {
    const config = Config({});
    expect(config.get("append")).toBeTruthy();
  });
});
