Meteor.startup(() => {

  buildIntelligence();

  Meteor.methods({
    'inbound': function(text, language, textId) {

      _ = function(txt, opts) {
        return TAPi18n.__(txt, opts, language);
      }
      moment.locale(language);

      console.log('inbound', text);
      var analysis = textRequest(text, language);
      console.log('analysis', analysis);

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
