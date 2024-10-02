/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const base = require('./webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    ...base,
    mode: 'production',
    entry: {
        renderer: './src/renderer/index.ts',
        preload: './src/renderer/preload.ts',
    },
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/renderer/index.html',
            publicPath: './',
        }),
    ],
}
