Meteor.startup(() => {

  Meteor.isElectron = (Meteor.server.method_handlers['electrify.get.socket.port']() !== null);

  buildIntelligence();

  Meteor.methods({
    'openVossistanWindow': function(isDevelopment) {
      var port = isDevelopment ? 3000 : Meteor.server.method_handlers['electrify.get.socket.port']();
      commands.execute({command: {
        application: 'browser',
        parameters: ['http://localhost:' + port]
      }}, false);
    },
    'inbound': function(text, language, textId) {

      _ = function(txt, opts) {
        return TAPi18n.__(txt, opts, language);
      }
      moment.locale(language);

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
