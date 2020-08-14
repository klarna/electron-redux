const { Application } = require('spectron');

describe('Counter', () => {
  let app;

  const getText = (selector) => app.client.$(selector).then((el) => el.getText());
  const click = (selector) => app.client.$(selector).then((el) => el.click());

  beforeEach(async () => {
    jest.setTimeout(6000);
    app = new Application({
      path: './node_modules/.bin/electron',
      args: ['.'],
      startTimeout: 5000,
      host: process.env.CHROMEDRIVER_HOST || 'localhost',
      port: process.env.CHROMEDRIVER_PORT || 9515,
    });

    await app.start();
    await app.browserWindow.isVisible();
  });

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it('Increases the count by one on click', async () => {
    expect(await getText('#value')).toEqual('0');

    await click('#increment');

    expect(await getText('#value')).toEqual('1');
  });

  it('Decreases the count by one on click', async () => {
    expect(await getText('#value')).toEqual('0');

    await click('#decrement');

    expect(await getText('#value')).toEqual('-1');
  });

  it('Increases the count by one on clicking the aliased action', async () => {
    expect(await getText('#value')).toEqual('0');

    await click('#incrementAliased');

    expect(await getText('#value')).toEqual('1');
  });
});
