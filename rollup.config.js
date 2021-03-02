import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

const extensions = ['.ts']

const basePlugins = [commonjs(), typescript({ useTsconfigDeclarationDir: true })]

const baseConfig = {
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [
        ...basePlugins,
        babel({
            extensions,
        }),
    ],
}

export default [
    // CommonJS
    {
        ...baseConfig,
        input: ['src/index.ts', 'src/main.ts', 'src/renderer.ts', 'src/preload.ts'],
        output: [
            { dir: 'lib', format: 'cjs' },
            { dir: 'es', format: 'es' },
        ],
    },
]
