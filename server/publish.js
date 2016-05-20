Meteor.publish('chat', function (userId) {
  return chat.find({userId: userId});
});
