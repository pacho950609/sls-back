# Serverless

## Getting Started

First, install the project dependence:

```bash
npm i
```

Second, run the development server:

```bash
npm run start:dev
```

## Test

To run test you only have to run the following command

```bash
npm run test
```

It is important to know that tests are connected to a local Postgres DB named `potter-test-db`, so you must have it in your local machine or change the DB name and credentials in the `.test.env` file.


## Deploy

This is a serverless project, if you want to deploy it in your AWS account you only have to run the following command

```bash
npm run deploy
```

To run this command you must configure your aws credentials in the `~/.aws` folder