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

  Meteor.methods({

    entitiesSearch: function(text) {

      let agg = [
        {
          $match: {
            i: 'jose-constela-job-positions'
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
            i: 1
          }
        }
      ]

      console.log(agg)
      console.log(Entities.aggregate(agg))

      return Entities.aggregate(agg)
    }
  });

});
