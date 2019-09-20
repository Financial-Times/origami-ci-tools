# origami-ci-tools

Continuous Integration tools for Origami components

Origami CI Tools is a wrapper around the tools used to build and test Origami components, to make it easier to keep the steps up to date across components.

It will run the component's tests, and publish the component to npm.

## Usage

Install it as a devDependency in your component, and use it in circle-ci!

```shell
$ npm install -D origami-ci-tools
```

```yaml
jobs:
  test:
    docker:
      - image: circleci/node:10-browsers
    steps:
      - checkout
      - npx origami-ci branch
  publish_to_npm:
    docker:
      - image: circleci/node:10
    steps:
      - checkout
      - npx origami-ci release
```

## Environment Variables

`origami-ci` expects the following Environment Variables to be set:

| name | description | example |
| ==== | =========== | ====== |
| ORIGAMI_CI_NAME | the project namesuch as `o-colors`used when a package.json) |
| CIRCLE_PROJECT_REPONAME | used for 
