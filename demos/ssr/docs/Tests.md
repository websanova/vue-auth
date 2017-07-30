# Tests

There are two kind of tests we are using, unit and end-to-end tests.

You can run tests by executing `yarn run test`

The tests run inside a PhantomJS instance.

## Unit testing

Unit tests are for testing single components and isolated functionalities.

Unit tests are carried out by [karma](https://karma-runner.github.io/1.0/index.html) and written using [mocha](http://mochajs.org/) (and sinon-chai for stubbing).

You can run unit tests by executing `yarn run test:unit`

## End-to-end testing

End-to-end (E2E) testing is for testing complete workflows and user interaction at the browser and UI level.

For E2E testing we are using [Nightwatch.js](http://nightwatchjs.org/) with the `PhantomJS` backend.

You can run E2E tests by executing `yarn run test:e2e`

You can specify to run the test in Chrome or Firefox using the `--env` flag: `yarn run test:e2e -- --env chrome`. You can define custom environments (or tweak existing one) inside `test/e2e/nightwatch.conf.js`.
