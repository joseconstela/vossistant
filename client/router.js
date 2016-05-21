Router.configure({
  layoutTemplate: 'app'
});

Router.onBeforeAction(function () {
  if (!Meteor.userId()) {
    this.redirect('/login');
  }
}, {
  except: [ 'login' ]
});

Router.route('login', {
  path: '/login',
  action: function () {
    if(Meteor.user()) {
      return this.redirect('/');
    }
  }
});

Router.route('home', {
  path: '/',
  waitOn: function () {
    return Meteor.subscribe('chat', Meteor.userId());
  },
  data: function() {
    if (this.ready) {
      return { chat: chat.find({}, {sort: {createdAt: -1}}) };
    }
  }
});
