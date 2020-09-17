const { NODE_ENV } = process.env

module.exports = {
  presets: [
    '@babel/typescript',
    [
      '@babel/env',
      {
        targets: {
          electron: '8'
        },
        modules: false,
        loose: true
      }
    ]
  ],
  plugins: [
    // don't use `loose` mode here - need to copy symbols when spreading
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    NODE_ENV === 'test' && '@babel/transform-modules-commonjs'
  ].filter(Boolean)
}