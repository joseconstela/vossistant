Meteor.startup(() => {

  Meteor.isElectron = (Meteor.server.method_handlers['electrify.get.socket.port']() !== null);

  jobsC.allow({
    admin: function (userId, method, params) {
      return Meteor.isElectron ? true : !!Meteor.userId();
    }
  });

  buildIntelligence();

  Meteor.methods({
    'openVossistanWindow': function(isDevelopment) {
      var port = 0;
      if (isDevelopment) { port = 3000; } else {
        var _port = Number(Meteor.server.method_handlers['electrify.get.socket.port']());
        port = ++_port;
      }
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

          // Flag the message as parsed, with all the details
          chat.update({_id: textId}, {
            $set: {data:data}
          });

          return action;
        }
      } else {
        // Flag the message as parsed
        chat.update({_id: textId}, {
          $set: {data: {} }
        });
      }

      return analysis;

    }
  });

});
