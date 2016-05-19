Meteor.startup(() => {

  buildIntelligence();

  insertMessage = function(direction, text) {
    var docId = chat.insert({
      userId: Meteor.userId(),
      createdAt: new Date(),
      direction: direction,
      text: text
    });
  }

  Meteor.methods({
    'inbound': function(text) {

      // Make sure the user is logged in before inserting a task
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      console.log('save...', text);
      insertMessage('inbound', text);

      var analysis = textRequest(text);
      if (!!analysis) {
        if (!!analysis.autoReply) {
          insertMessage('outbound', analysis.autoReply);
          return {say: analysis.autoReply};
        } else if (!!actions[analysis.intention]) {
          var response = actions[analysis.intention](analysis);
          console.log('response', response);
          // Save to DB
          if (!!response.say) {
            insertMessage('outbound', response.say);
            return {say: response.say};
          }
        }
      }

      return {};

    }
  });

});
