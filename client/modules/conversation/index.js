Template.conversation.onRendered(function conversationRendered() {

});

Template.conversation.helpers({
  lastCards: function(){
    return cards.find({}, {sort: {h: -1, c: -1, }, limit: 1});
  }
});
