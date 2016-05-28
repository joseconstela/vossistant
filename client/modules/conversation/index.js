
Template.conversation.helpers({
  chat: function(){
    return chat.find({}, {sort: {createdAt: -1}});
  }
});
