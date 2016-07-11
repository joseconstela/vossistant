Entities = new Mongo.Collection('Entities');

Entities.allow({
  insert: function () { return !!Meteor.user(); },
  update: function () { return !!Meteor.user(); },
  remove: function () { return false; }
});

Entities.attachSchema(new SimpleSchema({

  /*
  id:   id,
  u:    userId
  c:    createdAt     // When was created
  t:    title,
  d:    description,
  uat:  updatedAt,
  e:    entities
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
  e: {
    label: "Entities",
    type: [Object]
  },
  'e.$': {
    label: "Entity",
    type: Object
  },
  'e.$.v': {
    label: "Value",
    type: String,
    autoform: {
      placeholder: "Enter reference value...",
      class: "form-control"
    }
  },
  'e.$.s': {
    type: [String],
    autoform: {
      placeholder: "Enter synonim...",
      class: "form-control tokenizer"
    }
  }

}));
