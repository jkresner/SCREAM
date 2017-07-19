module.exports = {

  jk: {
    _id: ObjectId("514825fa2a26000000000001"),
    name: 'Jono',
    company: 'Test Inc.',
    age: 30
  },

  al: {
    _id: ObjectId("514825fa2a26000000000002"),
    name: 'Ari',
    company: 'Fullstack Inc.',
    age: 30
  },

  ag: {
    _id: ObjectId("514825fa2a26000000000003"),
    name: 'Andy',
    company: 'SF Growth Labs',
    age: 32,
    auth: { gh: {
      name: "Andy G",
      emails: [{email:'andy@growth.sf',verified:true}] }
    }
  }

}
