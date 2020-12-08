import { Application } from 'spectron'

describe('End to End Tests', () => {
    let app: Application

    const getText = (selector: string) => app.client.$(selector).then((el) => el.getText())
    const click = (selector: string) => app.client.$(selector).then((el) => el.click())

    beforeEach(async () => {
        jest.setTimeout(6000)
        app = new Application({
            path: './node_modules/.bin/electron',
            args: ['./dist/main/main.js'],
            startTimeout: 5000,
            host: process.env.CHROMEDRIVER_HOST || 'localhost',
            port: parseInt(process.env.CHROMEDRIVER_PORT || '9515'),
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

    it('+ button should increse counter on both renderer & main thread', async () => {
        expect(await getText('#value')).toEqual('10')
        expect(await app.browserWindow.getTitle()).toEqual('10')

        await click('#increment')

        expect(await getText('#value')).toEqual('11')
        // eslint-disable-next-line @typescript-eslint/await-thenable
        expect(await app.browserWindow.getTitle()).toEqual('11')
    })

    it('- button should decrease counter on both renderer & main thread', async () => {
        expect(await getText('#value')).toEqual('10')
        expect(await app.browserWindow.getTitle()).toEqual('10')

        await click('#decrement')

        expect(await getText('#value')).toEqual('9')
        // eslint-disable-next-line @typescript-eslint/await-thenable
        expect(await app.browserWindow.getTitle()).toEqual('9')
    })

    it('should be able to increment value from main process', async () => {
        expect(await getText('#value')).toEqual('10')
        expect(await app.browserWindow.getTitle()).toEqual('10')

        await click('#mainIncrement')

        expect(await getText('#value')).toEqual('11')
        // eslint-disable-next-line @typescript-eslint/await-thenable
        expect(await app.browserWindow.getTitle()).toEqual('11')
    })

    it('should be able to use middleware when dispatching from renderer process', async () => {
        expect(await getText('#value')).toEqual('10')
        expect(await app.browserWindow.getTitle()).toEqual('10')

        await click('#setCountMiddleware')

        expect(await getText('#value')).toEqual('99')
        // eslint-disable-next-line @typescript-eslint/await-thenable
        expect(await app.browserWindow.getTitle()).toEqual('99')
    })

    it('should be able to use middleware when dispatching from main process', async () => {
        expect(await getText('#value')).toEqual('10')
        expect(await app.browserWindow.getTitle()).toEqual('10')

        await click('#mainsetCountMiddleware')

        expect(await getText('#value')).toEqual('99')
        // eslint-disable-next-line @typescript-eslint/await-thenable
        expect(await app.browserWindow.getTitle()).toEqual('99')
    })
})
