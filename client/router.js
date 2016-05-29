Router.configure({
  layoutTemplate: 'app'
});

Router.route('/', function () {
  this.render('home');
}, {
  data: function() {
    return {};
  },
  name: 'home'
});

Router.route('/verify-email/:token', function () {
  this.redirect('/');
}, {
  data: function() {
    return { token: this.params.token };
  },
  name: 'verify-email'
});

Router.route( 'pageNotFound', {
  path: '/(.*)',
  where: 'client',
  action: function() {
    this.redirect('/');
  }
});
