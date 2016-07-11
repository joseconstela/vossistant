jobsC.startJobServer();
console.log('Jobs server ~ > started');

Meteor.publish('cards', function (userId, limit) {
  return cards.find({u: userId, da: null, at: null}, {limit: limit, sort: {c: -1}});
});

Meteor.publish('jobs', function (userId) {
  return jobsC.find({'data.parameters.userId': userId});
});

Meteor.publish('intentsByUser', function (userId) {
  return Intents.find({u: userId});
});

Meteor.publish('intent', function (intentId) {
  return Intents.find({_id: intentId});
});

Meteor.publish('intentsCommunity', function () {
  return Intents.find({});
});



Meteor.publish('entitiesByUser', function (userId) {
  return Entities.find({u: userId});
});

Meteor.publish('entities', function (entitieId) {
  return Entities.find({_id: entitieId});
});

Meteor.publish('entitiesCommunity', function () {
  return Entities.find({});
});
