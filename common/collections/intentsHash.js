IntentsHash = new Mongo.Collection('IntentsHash');

IntentsHash.allow({
  insert: function () { return !!Meteor.user() },
  update: function () { return false },
  remove: function () { return !!Meteor.user() }
});

IntentsHash.attachSchema(new SimpleSchema({

  u: {
    type: String,
    autoValue: function () {
      if (this.isInsert && !this.isSet) {
        return Meteor.userId()
      }
    },
    autoform: {
      type: 'hidden'
    }
  },
  i: {
    type: String,
    optional: false,
    autoform: {
      type: 'hidden'
    }
  },
  c: {
    type: Date,
    autoValue: function() {
      return new Date()
    },
    autoform: {
      type: 'hidden'
    }
  }

}))
