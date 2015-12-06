# 1. Quick overview

SCREAM is a framework built for testing APIs & web apps. It can be used 
to test any JavaScript function, but is most helpful for complicated user 
stories (requirements) as it provides a set of simplified conventions 
to handle test data, make API calls, authenticate users and stub parts of
your code (like an API call to your payment gateway) which might slow you
test suite.

SCREAM is emphasised in capitals as the loud syntax will help you 
easily identify normal test code vs SCREAM enhanced helpers.

## 2. Dependencies

1. [node v4+](https://nodejs.org/download/)
2. [mongodb v3+](https://www.mongodb.org/downloads)

### Addtional dependencies for example projects

3. bower `npm i bower -g`
3. gulp `npm i gulp -g`

## 3. Run it!

### First download packages:

````
npm install
cd web/components
bower install
````

### Run the examples

````
npm run example1
...
npm run example4
// etc. etc.
```

### Run the tests for scream itself

\* Ironically the covereage for SCREAM right now is almost inexistant, but it has
been used to test multiple production deployed packages.

`npm test`

## 4. Choose your own poison

*Though we are strict about writing in JavaScript for our packages, we prefer 
coding tests in CoffeeScript as braces tend to waste time and reduce 
readibility.*

SCREAM however is flexible enough to mix and match from one spec to another. 
Thus individual team members code in JS and/or other CoffeeScript without
arguments :)

## 5. But what is SCREAM and how will it help?

SCREAM is an oppinionated set of solutions to 

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
