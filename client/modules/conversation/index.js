
Template.conversation.helpers({
  chat: function(){
    return chat.find({}, {limit: 1, sort: {createdAt: -1}});
  }
});
