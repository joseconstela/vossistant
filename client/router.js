Router.configure({
  layoutTemplate: 'app'
});

Router.onBeforeAction(function () {
  if (!Meteor.userId()) {
    this.redirect('/login');
  }
  this.next();
}, {
  except: [ 'login' ]
});

Router.route('/login', function () {
  if(Meteor.user()) {
    return this.redirect('/');
  }
  this.render('login');
}, {
  name: 'login'
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
  },
  name: 'home'
});
