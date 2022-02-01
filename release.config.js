module.exports = {
    release: {
        branches: [
            'master',
            { name: 'alpha', prerelease: true },
            { name: 'beta', prerelease: true },
        ],
    },
}
