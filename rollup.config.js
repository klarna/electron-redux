import nodeResolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

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
]
