# SCREAMjs

## Testing Node.js apps

Testing real-world scenarios with real-world data is cumbersome. 

Efficiently setting up context and replaying stories involving many users 
interacting over long sequences isn't easy. It also requires serious 
amounts of vanilla JavaScipt code with a normal test runner like mocha, 
jasmine or jest.

SCREAM is a harness that wraps around mocha. It's packed with features and 
syntax to helps you write terse, legible, fast and maintainable tests. 

## Setup

1. [node v13+](https://nodejs.org/download/)
2. [mongodb v3+](https://www.mongodb.org/downloads)
3. `npm install screamjs`

## Features

### 1. Seed data 

Boostrap your database, the first or every time you run your test suit 
using MongoDB .bson files

### 2. FIXTURE conventions

Any file you dump into your projects /test/data/fixtures gets magically
packed onto FIX.{filename} (e.g. /test/data/fixture.users.js will be
available on FIX.users 

### 3. Check Http headers easily

```javascript
IT(`[GET/=>200:empty] missing user-agent header`, function() {
  PAGE(`/`, { ua:null, status: 200, contentType: /html/ }, html => {
    expect(html).to.equal('')
    DONE()
  })
})
```

### 4. Create and Login/Logout as different users

```coffeescript
IT "Sends appropriate email notifications", ->
  post = FIXTURE.posts.higherOrderFunctions
  STORY.newUser 'tiagorg', (sTiagorg, tiagSession) ->
    post.by.userId = sTiagorg._id
    STORY.newUser 'rev0', (rev0, rev0Key) ->
      spyReviewNotify = STUB.spy(mailman,'sendTemplate')
      POST "/posts/#{post._id}/review", postReview, (p1) ->
        reviewId = p1.reviews[0]._id
        STORY.newUser 'rev1', (rev1, rev1Key) ->
          spyReviewReplyNotify = STUB.spy(mailman,'sendTemplateMails')
          PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 1 reply to your review' }, (p2) ->
            expect(spyReviewNotify.callCount).to.equal(1)
            expect(spyReviewReplyNotify.callCount).to.equal(1)
            LOGIN {key:tiagSession}, (tiagorg) ->
              PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 2 reply to your review' }, (p3) ->
                expect(spyReviewReplyNotify.callCount).to.equal(2)
                toUsers3 = spyReviewReplyNotify.args[1][2]
                expect(toUsers3[0].name).to.equal(rev0.name)
                LOGIN {key:rev0Key}, (sRev2, rev2Key) ->
                  PUT "/posts/#{post._id}/review/#{reviewId}/reply", { comment: 'I say 3 reply to your review' }, (p4) ->
                    expect(spyReviewReplyNotify.callCount).to.equal(3)
                    expect(spyReviewReplyNotify.args[2][1].comment).to.equal('I say 3 reply to your review')
                    DONE()
})
```

### 5. STUB conventions

...

### 6. Config and command line flags

| flag | long             | effect                                  |
|:---:|:----------------- |:--------------------------------------- |
 -c  | --config \<name>   | Use config from file [name].json        
 -e  | --env \<name>      | Set process.env.ENV                    
 -g  | --grep \<title\>  | Compile all specs but run tests RegExp matching title 
 -l  | --log-flag \<flag> | Output (app).config.log flag e.g. MW_TRACE 
 -o  | --only \<name>     | Compile and run only <spec> and its dependencies (fast) 
 -s  | --db-seed         | BSON import dropping first clearing all existing data 
 -S  | --db-seed-dirty   | Seed data without wiping existing data (faster) 
 -q  | --quiet           | Quiet log output 
 -u  | --unstub          | Execute all STUB wrapped code without faking/mocking 
 -v  | --verbose         | Verbose log output 


## Example tested apps

##### **ex1** simple console app

`npm run-script ex1`

- js tests
- example SCREAM folder structure
- empty `scream.json` config

##### **ex2** express/mongodb app

`npm run-script ex2`

- coffee tests
- `scream.json` config with mongodb config

##### **ex3** mongodb data bootstrap,

`npm run-script ex3`

- Both coffee & js tests 
- Bootstrap db.Users collection from users.bson file before tests run
- FIXTURE.users 

##### **ex4** express/mongodb/passport app

`npm run-script ex4`

- coffee tests 
- LOGIN changes current users
- PAGE tests expected 200