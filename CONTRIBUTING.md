# As a contributor

## Installing this repo

To get set up, run these steps:

```
yarn && yarn bootstrap
yarn build
```

## Running tests

```
yarn test
```

# Publishing

```
yarn lerna run prepare
yarn lerna publish patch|minor|major
```
