import { Application } from 'spectron'

describe('End to End Tests', () => {
    let app: Application

    const getText = (selector: string) => app.client.$(selector).then((el) => el.getText())
    const click = (selector: string) => app.client.$(selector).then((el) => el.click())
    describe.each(['basic'])('for [%s] example', (example) => {
        beforeEach(async () => {
            jest.setTimeout(12000)
            app = new Application({
                path: `./examples/${example}/node_modules/.bin/electron`,
                args: [`${__dirname}/../examples/${example}/dist/main.js`],
                startTimeout: 10000,
                host: process.env.CHROMEDRIVER_HOST || 'localhost',
                port: parseInt(process.env.CHROMEDRIVER_PORT || '9222'),
            })

            await app.start()
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await app.browserWindow.isVisible()
        })

        afterEach(async () => {
            if (app && app.isRunning()) {
                await app.stop()
            }
        })

        it('should start app with initial state and it should be in-sync', async () => {
            expect(await getText('#globalCounter')).toEqual('1')
            expect(await getText('#localCounter')).toEqual('1')

            expect(await app.browserWindow.getTitle()).toEqual(
                'Global counter: [1] | Local counter: [1]'
            )
        })
    })

    // it('- button should decrease counter on both renderer & main thread', async () => {
    //     expect(await getText('#value')).toEqual('10')
    //     expect(await app.browserWindow.getTitle()).toEqual('10')

    //     await click('#decrement')

    //     expect(await getText('#value')).toEqual('9')
    //     // eslint-disable-next-line @typescript-eslint/await-thenable
    //     expect(await app.browserWindow.getTitle()).toEqual('9')
    // })

    // it('should be able to increment value from main process', async () => {
    //     expect(await getText('#value')).toEqual('10')
    //     expect(await app.browserWindow.getTitle()).toEqual('10')

    //     await click('#mainIncrement')

    //     expect(await getText('#value')).toEqual('11')
    //     // eslint-disable-next-line @typescript-eslint/await-thenable
    //     expect(await app.browserWindow.getTitle()).toEqual('11')
    // })

    // it('should be able to use middleware when dispatching from renderer process', async () => {
    //     expect(await getText('#value')).toEqual('10')
    //     expect(await app.browserWindow.getTitle()).toEqual('10')

    //     await click('#setCountMiddleware')

    //     expect(await getText('#value')).toEqual('99')
    //     // eslint-disable-next-line @typescript-eslint/await-thenable
    //     expect(await app.browserWindow.getTitle()).toEqual('99')
    // })

    // it('should be able to use middleware when dispatching from main process', async () => {
    //     expect(await getText('#value')).toEqual('10')
    //     expect(await app.browserWindow.getTitle()).toEqual('10')

    //     await click('#mainsetCountMiddleware')

    //     expect(await getText('#value')).toEqual('99')
    //     // eslint-disable-next-line @typescript-eslint/await-thenable
    //     expect(await app.browserWindow.getTitle()).toEqual('99')
    // })
})
