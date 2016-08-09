Intents = new Mongo.Collection('Intents');

Intents.allow({
  insert: function () { return !!Meteor.user(); },
  update: function () { return !!Meteor.user(); },
  remove: function () { return false; }
});

Intents.attachSchema(new SimpleSchema({

  /*
  id:   id,
  u:    userId
  c:    createdAt     // When was created
  t:    title,
  d:    description,
  uat:  updatedAt,
  tr:   triggers,
  ac:   actions,
  sr    speechResponse
  */

  u: {
    type: String,
    autoValue: function () {
      if (this.isInsert && !this.isSet) {
        return Meteor.userId();
      }
    },
    autoform: {
      type: 'hidden'
    }
  },
  c: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
    denyUpdate: true,
    autoform: {
      type: 'hidden'
    }
  },
  t: {
    label: "Title",
    type: String
  },
  d: {
    label: "Description",
    type: String,
    optional: true,
    autoform: {
      type: 'textarea'
    }
  },
  uat: {
    type: Date,
    autoValue: function() {
      return new Date();
    },
    autoform: {
      type: 'hidden'
    }
  },
  tr: {
    label: "User says",
    type: Array
  },
  'tr.$': {
    type: String,
    autoform: {
      placeholder: "Add user expression...",
      class: "form-control textcomplete textcomplete-entities"
    }
  },
  ac: {
    label: "Action",
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 10,
        class: "codemirror"
      }
    }
  },
  sr: {
    label: "Speech response",
    type: Array
  },
  'sr.$': {
    type: String,
    autoform: {
      placeholder: "Speech response...",
      class: "form-control"
    }
  }

}));
