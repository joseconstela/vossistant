Meteor.startup(() => {

  buildIntelligence();

  Meteor.methods({
    'inbound': function(text, language, textId) {

      _ = function(txt, opts) {
        return TAPi18n.__(txt, opts, language);
      }
      moment.locale(language);

      // Make sure the user is logged in before inserting a task
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      var analysis = textRequest(text, language);

      if (!!analysis) {

        if (!!actions[analysis.intention]) {

          var action = actions[analysis.intention](analysis);

          if (!action) return false;

          if (!!action.command) {

            if (action.command.application === 'mongo') {
              Meteor.users.update({
                _id: Meteor.userId()
              }, {$set: action.command.parameters});
              delete action.command;
            } else {
              if (commands.execute(action, false)) {
                delete action.command;
              }
            }
          }

          var data = {};
          Object.assign(data, action, analysis);

          chat.update({_id: textId}, {
            $set: {data:data}
          });

          return action;
        }
      } else {
        chat.update({_id: textId}, {
          $set: {data: {} }
        });
      }

      return analysis;

    }
  });

});
