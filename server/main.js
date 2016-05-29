Meteor.startup(() => {

  jobsC.allow({
    admin: function (userId, method, params) {
      return !!Meteor.userId();
    }
  });

  Job.processJobs(jobsC, 'default', function (job, cb) {
    var data = job.data;
    commands.execute({command: {
      application: data.command,
      parameters: data.parameters
    }}, false, function() {
      cb();
    });
  });

  buildIntelligence();

  Meteor.methods({
    'loginOrSignup': function(credentials) {
      var account = Meteor.users.findOne({ 'emails.address' : credentials.email });

      if (account) {
        return 'login';
      } else {
        var accountId = Accounts.createUser(credentials);
        var res = Accounts.sendVerificationEmail(accountId);
        return 'signup';
      }
    },

    'inbound': function(text, language, textId) {

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      _ = function(txt, opts) {
        return TAPi18n.__(txt, opts, language);
      }
      moment.locale(language);

      var analysis = textRequest(text, language, true);

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
