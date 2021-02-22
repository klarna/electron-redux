/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const base = require('./webpack.config')

module.exports = {
    ...base,
    mode: 'production',
    entry: {
        main: './src/main/index.ts',
    },
    target: 'electron-main',
    node: {
        __dirname: false,
    },
}
