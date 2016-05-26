chat = new Mongo.Collection('chat');

chat.allow({
  insert: function () { return true; },
  update: function () { return !!Meteor.user(); },
  remove: function () { return !!Meteor.user(); }
});

chat.attachSchema(new SimpleSchema({

  'userId': {
    type: String,
    optional: true,
    autoValue: function () {
      if (this.isInsert && Meteor.userId()) {
        return Meteor.userId();
      }
    }
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
  data: {
    type: Object,
    optional: true
  },
  'data.say': {
    type: String,
    optional: true
  },
  'data.text': {
    type: String,
    optional: true
  },
  'data.intention': {
    type: String,
    optional: true
  },
  'data.phrase': {
    type: String,
    optional: true
  },
  'data.match': {
    type: String,
    optional: true
  },
  'data.display': {
    type: Object,
    optional: true
  },
  'data.display.title': {
    type: String
  },
  'data.display.link': {
    type: String,
    optional: true
  },
  'data.display.html': {
    type: String,
    optional: true
  },
  'data.data': {
    type: Object,
    optional: true,
    blackbox: true
  }

}));
