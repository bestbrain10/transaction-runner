# Transaction Runner

[![Test](https://github.com/bestbrain10/transaction-runner/actions/workflows/test.yml/badge.svg)](https://github.com/bestbrain10/transaction-runner/actions/workflows/test.yml)


## API Documentation
https://documenter.getpostman.com/view/2210503/TzCP888F

## How to Install 

- Install NodeJS and NPM. Use this link and follow the steps for your own operating system https://nodejs.org/en/download/

- Install Git from https://git-scm.com/downloads

- From your terminal or command line run
    
    - `git clone git@github.com:bestbrain10/transaction-runner.git`

    - `cd transaction-runner`

    - `npm install`


## Running Application as API Locally

 - create a `.env` file in the project directory using `env.example` as template

 - run `npm run migrate:run` to setup the database

 - Run `npm run start` to start the server

 - From your browser or REST client visit `http://localhost:4000` 

 - If you make any changes, you will have to first close the running server, and the start it again using `npm run start`

## Using as SDK

- properties
    - User
    - Login
    - UserTransaction
- methods
    - databaseInit()
    - databaseClose()

## Running Test

To run test run

> `npm test`

## Running Test Coverage

To run test coverage

> `npm run coverage`