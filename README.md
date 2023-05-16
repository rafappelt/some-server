# Some Server

## Architecture

The application has five layers separated by directories. They are [core](#core), [adapter](#adapter),
[api](#api), [cron](#cron) and [helper](#helper).

The main idea behind the layers is to provide the [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns).

It's dependencies rules are described on each respective section bellow and applied on [.eslintrc.yml](.eslintrc.yml).


### /core
This layer contains the core logic, composed of models, services abstractions, and use cases.

This layer has no dependency on any other layer.
It is a self-contained package. No external library can be imported on it.

### /adapter
This layer holds the implementation of the services specified on the domain layer.

It depends on `core` and `helper` layers and can import external libraries.

#### Development guidelines
Adapters are implementations of core services and should be as thin as possible, containing instructions strictly necessary to perform the the external service adaptation. Codes exclusivelly related to the external service, must be kept in an external library or in the `helper` layer.

### /api
The API layer is composed of an abstraction of the endpoints and their implementations.

It provides external access to the core logic.

#### Development guidelines
The endpoint classes should delegate all business rules to the UseCases objects.

It's scope should be limited to:

1. Validate and consume the HTTP parameters
2. Construct and execute the use cases
3. Build a success or error response

### /cron
The cron layer is composed of an abstraction of the cron tasks and their implementations.

### /helper
Every code that is not directly related to the domain has to be in this layer. 

It's composed of a set of self-contained packages that are candidates to became an external module that can be reused in any other applications.

## Requirments
This project requires the npm installed to build, test, and run.

## Environment variables

### SERVER_PORT
Port number which the server must to listen for incoming requests.
Default: 3000

### SERVER_BASE_PATH
Port number which the server must to listen for incoming requests.
Default: /api


## Instructions of use
Before run any command below, install the modules dependencies:

```bash
  npm install
```

### Lint

#### Verification
To run the EsLint validation, run the following npm script:

```bash
  npm run lint
```

#### Fix
To run the EsLint fix, run the following npm script:

```bash
  npm run lint:fix
```

### Testing

#### Internal tests
To run the tests of the internal packages, run the following npm script:

```bash
  npm run test
```

#### External tests
External tests are test that depends of external services to run successfuly. They can be identified by the `.external.test.ts` extension.

To run the tests, run the following npm script:

```bash
  npm run test:external
```

#### All tests
To run all Jest tests, run the following npm script:

```bash
  npm run test:all
```

### Running
To run the application, use one of the following methods:

```bash
  npm start
```
or

```bash
  node .
```

