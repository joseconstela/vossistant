Meteor.startup(() => {

  Accounts.validateLoginAttempt((att) => {
    if (!!att.user) {
      let img = att.user.services.twitter.profile_image_url;

      Meteor.users.update({
        _id: att.user._id
      }, {
        $set: {
          'profile.profile_image_url': img
        }
      });

    }
    return true;
  })

  jobsC.allow({
    admin: function (userId, method, params) {
      return !!Meteor.userId();
    }
  });

  Job.processJobs(jobsC, 'default', function (job, cb) {
    var data = job.data;
    commands.execute({co: {
      a: data.command,
      p: data.parameters
    }}, function() {
      cb();
    });
  });

  buildIntelligence();

  Meteor.methods({

    entitiesSearch: function(text) {
      return Entities.aggregate([
        {
          $match: {
            t: 'title'
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "u",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            t: 1, d: 1, 'user.profile.name': 1
          }
        }
      ]);
    },

    inbound: function(text, language, textId) {

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      _ = function(txt, opts) {
        return TAPi18n.__(txt, opts, language);
      }
      moment.locale(language);

      var analysis = textRequest(text, language, true);

      {
        let keys = lodash.keys(analysis)
        if(keys.length === 1 && keys[0] === 'c') {
          analysis = false;
        }
      }

      if (!!analysis) {
        cards.update({_id: textId}, {
          $set: {a:analysis}
        });

        if (!!actions[analysis.i]) {

          var action = actions[analysis.i](analysis, text);

          if (!action) return false;

          if (!!action.co) {

            if (action.co.a === 'mongo') {
              Meteor.users.update({
                _id: Meteor.userId()
              }, {$set: action.co.p});
              delete action.co;

            } else {

              if (commands.execute(action)) {
                delete action.co;
              }

            }
          }

          // Flag the message as parsed, with all the details
          if (!!action && action.store === false) {
            delete action.store;
            cards.update({_id: textId}, {
              $set: {da: new Date()}
            });
          } else {
            delete action.store

            let u = {}
            lodash.map(action, (p, k) => {
              u[k] = p
            })

            cards.update({_id: textId}, {
              $set: u
            })
          }

          return action;
        }
        return analysis;
      } else {
        cards.update({_id: textId}, {
          $set: {at: true}
        });
      }
    }
  });

});
