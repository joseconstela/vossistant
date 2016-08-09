jobsC.startJobServer();
console.log('Jobs server ~ > started');

Meteor.publish('jobs', (userId) => {
  return jobsC.find({'data.parameters.userId': userId});
})

Meteor.publish('intentsHash', (userId) => {
  return IntentsHash.find({u: userId})
})

Meteor.publish('intentsByUser', (userId) => {
  return Intents.find({u: userId});
})

Meteor.publish('intent', (intentId) => {
  return Intents.find({_id: intentId});
})

Meteor.publish('intentsCommunity', () => {
  return Intents.find({});
})

Meteor.publish('entitiesByUser', (userId) => {
  return Entities.find({u: userId});
})

Meteor.publish('entities', (entitieId) => {
  return Entities.find({_id: entitieId});
})

Meteor.publish('entitiesCommunity', () => {
  return Entities.find({});
})
