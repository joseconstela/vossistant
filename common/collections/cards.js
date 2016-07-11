cards = new Mongo.Collection('cards');

cards.allow({
  insert: function () { return !!Meteor.user(); },
  update: function () { return !!Meteor.user(); },
  remove: function () { return false; }
});

cards.attachSchema(new SimpleSchema({

    /*
    u:    userId
    c:    createdAt     // When was created
    t:    [title],
    f:    [files],
    f.i:  [id],
    f.a:  [addedAt],
    i:    [input]
    i.t:  [text]
    i.ty: [type]
    h:    historyCard,
    a:    [analysis]
    a.c:  [createdAt] // When was analised
    a.i:  [intention]
    a.p:  [phrase]
    a.m:  [match]
    a.d:  [data]
    r:    response {}
    r.s:  r{ say }
    r.t:  r{ text }
    d:    display {}
    d.t:  d{ title }
    d.l:  d{ link }
    d.h:  d{ html },
    da:   deletedAt,
    at:   attention
    */

  u: {
    type: String,
    autoValue: function () {
      if (this.isInsert && !this.isSet) {
        return Meteor.userId();
      }
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
    denyUpdate: true
  },
  t: {
    type: String,
    optional: true
  },
  f: {
    type: [Object],
    optional: true
  },
  'f.i': {
    type: String,
    optional: true
  },
  'f.a': {
    type: Date,
    optional: true
  },
  i: {
    type: Object,
    optional: true
  },
  'i.t': {
    type: String,
    optional: true
  },
  'i.ty': {
    type: String,
    allowedValues: ['t', 'u'],
    optional: true
  },
  h: {
    type: Boolean,
    optional: true
  },
  a: {
    type: Object,
    optional: true
  },
  'a.c': {
    type: Date,
    optional: true
  },
  'a.i': {
    type: String,
    optional: true
  },
  'a.p': {
    type: String,
    optional: true
  },
  'a.m': {
    type: String,
    optional: true
  },
  'a.d': {
    type: Object,
    optional: true,
    blackbox: true
  },
  r: {
    type: Object,
    optional: true
  },
  'r.s': {
    type: String,
    optional: true
  },
  'r.t': {
    type: String,
    optional: true
  },
  d: {
    type: Object,
    optional: true
  },
  'd.t': {
    type: String
  },
  'd.l': {
    type: String,
    optional: true
  },
  'd.h': {
    type: String,
    optional: true
  },
  co: {
    type: Object,
    optional: true,
    blackbox: true
  },
  da: {
    type: Date,
    optional: true
  },
  at: {
    type: Boolean,
    optional: true
  }

}));
