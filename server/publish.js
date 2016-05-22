Meteor.publish('chat', function (userId, limit) {
  return chat.find({userId: userId}, {limit: limit});
});
