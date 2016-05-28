jobsC.startJobServer();

Meteor.publish('chat', function (userId, limit) {
  var query = userId ? {userId: userId} : {userId: {$exists: false}};
  return chat.find(query, {limit: limit, sort: {createdAt: -1}});
});
