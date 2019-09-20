# origami-ci-tools

Continuous Integration tools for Origami components

Origami CI Tools is a wrapper around the tools used to build and test Origami components, to make it easier to keep the steps up to date across components.

It will help you run the component's tests, and publish the component to npm.

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
| --- | --- | --- |
| `ORIGAMI_CI_NAME` | The project name (used when generating a package.json) | `o-colors` |
| `CIRCLE_PROJECT_REPONAME` | CircleCI-specific alternative to `ORIGAMI_CI_NAME`. Set automatically by CircleCI | `o-colors` |
| `ORIGAMI_CI_VERSION` | the version of the project being built | `1.0.0` |
| `CIRCLE_TAG` | CircleCI-specific alternative to `ORIGAMI_CI_VERSION`. Set automatically by CircleCI | `v1.0.0` |
| `ORIGAMI_PULL_REQUEST` | the url of a pull request for the build, if any | `https://github.com/Financial-Times/o-test-component/pull/1` |
| `CIRCLE_PULL_REQUEST` | CircleCI-specific alternative to `ORIGAMI_PULL_REQUEST`. Set automatically by CircleCI | `https://github.com/Financial-Times/o-test-component/pull/1` |
| `NPM_TOKEN` | The auth token used to publish npm packages | ` 09448d16328f2c7...`|
| `GITHUB_TOKEN` | The auth token used to comment on Github pull requests | `r0wANL3eJ4keacHee1234o==`|
