# 1. Quick overview

SCREAM is for authoring node API & web app tests faster and terser. Test any 
JavaScript function, but complicated user stories are where it shines.
SCREAM provides a set of simplified conventions 
to handle test data, make API calls, authenticate users and stub parts of
your code (like an API call to your payment gateway) which might slow you
test suite.

## 2. Dependencies

1. [node v8+](https://nodejs.org/download/)
2. [mongodb v3+](https://www.mongodb.org/downloads)

## 3. Run it!

### Example mini projects

````
npm run-script ex1
npm run-script ex2
npm run-script ex3
npm run-script ex4
```

### Run tests for scream itself

`npm test`

## 4. Choose your own poison

SCREAM is flexible enough to mix and match from one spec to another. Thus 
individual team members can code in JS and/or other CoffeeScript without
arguments.

<!-- ## 5. But what is SCREAM and how will it help?

SCREAM is an opinionated set of solutions to 

1) `db.js` Efficiently dealing with test data and (mongodb) test databases
2) `data.js` Using static json data (fixtures)
3) `flavors.js` Some assertion functions we found useful
4) `http` Easily managing sessions / logins / logouts and making api calls
on behalf of users for express apps
5) `runner.js` More efficient file based spec setup and automation
6) `stubs.js` Stubbing done right from the beginning of your project

## 6. Roadmap

There's nothing like real data to debug and fix code issues.

We believe an efficient loop should exist between application errors, the data
that caused them and tests that should be created to guide code fixes.

Eventually we hope to automate catching application erros and save related data
- request info, identity/user info and application info about the functionality
being called - automatically into mongo and use this information to automatically
create specs and tests to be filled in by devs.
 -->
