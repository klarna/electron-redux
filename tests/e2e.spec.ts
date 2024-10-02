import { Application } from 'spectron'

describe('End to End Tests', () => {
    let app: Application

    const getText = (selector: string) => app.client.$(selector).then((el) => el.getText())
    const click = (selector: string) => app.client.$(selector).then((el) => el.click())
    describe.each(['basic'])('for [%s] example', (example) => {
        beforeEach(async () => {
            jest.setTimeout(6000)
            app = new Application({
                path: `./examples/${example}/node_modules/.bin/electron`,
                args: [`./examples/${example}/dist/main.js`],
                startTimeout: 5000,
                host: process.env.CHROMEDRIVER_HOST || 'localhost',
                port: parseInt(process.env.CHROMEDRIVER_PORT || '9222'),
                env: {
                    SPECTRON: 'true',
                },
            })

            await app.start()

            await app.client.waitUntilWindowLoaded()
        })

        afterEach(async () => {
            if (app && app.isRunning()) {
                await app.stop()
            }
        })

        it('should start app with initial state and it should be in-sync', async () => {
            expect(await app.browserWindow.getTitle()).toEqual(
                'Global counter: [1] | Local counter: [1]'
            )
            expect(await getText('#globalCounter')).toEqual('1')
            expect(await getText('#localCounter')).toEqual('1')
        })

        it('should forward actions and update both states in main & renderer', async () => {
            await click('#incrementGlobalCounter')

            expect(await app.browserWindow.getTitle()).toEqual(
                'Global counter: [2] | Local counter: [1]'
            )
            expect(await getText('#globalCounter')).toEqual('2')
        })

        it('should not forward local scoped actions', async () => {
            await click('#decrementGlobalCounter')
            await click('#incrementLocalCounter')

            expect(await app.browserWindow.getTitle()).toEqual(
                'Global counter: [0] | Local counter: [1]'
            )
            expect(await getText('#globalCounter')).toEqual('0')
            expect(await getText('#localCounter')).toEqual('2')
        })
    })
})
