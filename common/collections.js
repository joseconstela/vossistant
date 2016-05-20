chat = new Mongo.Collection('chat');

chat.allow({
  insert: function () { return !!Meteor.user(); },
  update: function () { return !!Meteor.user(); },
  remove: function () { return !!Meteor.user(); }
});

chat.attachSchema(new SimpleSchema({

  'userId': {
    type: String
  },
  'createdAt': {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  'direction': {
    type: String,
    allowedValues: ['outbound', 'inbound']
  },
  'text': {
    type: String
  },
  'response': {
    type: String,
    optional: true
  }

}));
