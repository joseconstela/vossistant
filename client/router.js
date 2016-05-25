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

Router.route('/', function () {
  this.render('home');
}, {
  subscriptions: function() {
    return Meteor.subscribe('chat', Meteor.userId(), 0);
  },
  data: function() {
    if (this.ready) {
      return { chat: chat.find({}, {sort: {createdAt: -1}}) };
    }
  }
});
