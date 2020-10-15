import nodeResolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const extensions = ['.ts']

const basePlugins = [
    commonjs(),
    nodeResolve({
        extensions,
    }),
    typescript({ useTsconfigDeclarationDir: true }),
]

export default [
    // CommonJS
    {
        input: 'src/index.ts',
        output: { file: 'lib/electron-redux.js', format: 'cjs', indent: false },
        external: Object.keys(pkg.peerDependencies || {}),
        plugins: [
            ...basePlugins,
            babel({
                extensions,
            }),
        ],
    },

    // ES
    {
        input: 'src/index.ts',
        output: { file: 'es/electron-redux.js', format: 'es', indent: false },
        external: Object.keys(pkg.peerDependencies || {}),
        plugins: [
            ...basePlugins,
            babel({
                extensions,
            }),
        ],
    },

    // ES for Browsers
    {
        input: 'src/index.ts',
        output: { file: 'es/electron-redux.mjs', format: 'es', indent: false },
        plugins: [
            ...basePlugins,
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            babel({
                extensions,
                exclude: 'node_modules/**',
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false,
                },
            }),
        ],
    },

    // UMD Development
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/electron-redux.js',
            format: 'umd',
            name: 'ElectronRedux',
            indent: false,
        },
        plugins: [
            ...basePlugins,
            babel({
                extensions,
                exclude: 'node_modules/**',
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('development'),
            }),
        ],
    },

    // UMD Production
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/electron-redux.min.js',
            format: 'umd',
            name: 'ElectronRedux',
            indent: false,
        },
        plugins: [
            ...basePlugins,
            babel({
                extensions,
                exclude: 'node_modules/**',
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false,
                },
            }),
        ],
    },
]
