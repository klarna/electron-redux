import { Application } from "spectron";

describe("End to End Tests", () => {
  let app: Application;

  const getText = (selector) =>
    app.client.$(selector).then((el) => el.getText());
  const click = (selector) => app.client.$(selector).then((el) => el.click());

  beforeEach(async () => {
    jest.setTimeout(6000);
    app = new Application({
      path: "./node_modules/.bin/electron",
      args: ["./e2e_dist/main/main.js"],
      startTimeout: 5000,
      host: process.env.CHROMEDRIVER_HOST || "localhost",
      port: parseInt(process.env.CHROMEDRIVER_PORT || "9515"),
    });

    await app.start();
    await app.browserWindow.isVisible();
  });

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it("+ button should increse counter on both renderer & main thread", async () => {
    expect(await getText("#value")).toEqual("0");

    await click("#increment");

    expect(await getText("#value")).toEqual("1");
    expect(await app.browserWindow.getTitle()).toEqual("1");
  });

  it("- button should decrease counter on both renderer & main thread", async () => {
    expect(await getText("#value")).toEqual("0");

    await click("#decrement");

    expect(await getText("#value")).toEqual("-1");
    expect(await app.browserWindow.getTitle()).toEqual("-1");
  });
});
