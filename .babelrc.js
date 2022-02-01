const { NODE_ENV } = process.env

module.exports = {
    presets: [
        '@babel/typescript',
        [
            '@babel/env',
            {
                targets: {
                    electron: '8',
                },
                modules: false,
                loose: true,
            },
        ],
    ],
    plugins: [NODE_ENV === 'test' && '@babel/transform-modules-commonjs'].filter(Boolean),
}
