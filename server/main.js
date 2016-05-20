Meteor.startup(() => {

  moment.locale('es');

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

      insertMessage('inbound', text);

      var analysis = textRequest(text);

      if (!!analysis) {

        if (!!actions[analysis.intention]) {

          var action = actions[analysis.intention](analysis);

          if (!action) return false;

          if (!!action.command) {
            if (action.command === 'profile') {
              Meteor.users.update({
                _id: Meteor.userId()
              }, {$set: action.parameters});
            }
          }

          if (!!action.text) {
            insertMessage('outbound', action.text);
          } else if (!!action.say) {
            insertMessage('outbound', action.say);
          }
          return action;
        }
      }

      return analysis;

    }
  });

});
