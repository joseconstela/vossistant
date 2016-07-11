sectionTitle = function(arr) {
  arr = lodash.map(arr, function(i) {
    return TAPi18n.__(i);
  });
  document.title = arr.join(' - ');
  document.title += arr.length? ' - ' : '';
  document.title += ' Vossistant';
};

Router.configure({
  layoutTemplate: 'applicationLayout'
});

Router.route('/', function () {
  sectionTitle([]);
  this.render('conversation');
}, {
  title: 'Home',
  name: 'app.index'
});

Router.route('/intents/mine', function () {
  this.render('intentsMine')
}, {
  subscriptions: function() {
    return [
      Meteor.subscribe('intentsByUser', Meteor.userId())
    ]
  },
  data: function() {
    if (this.ready) {
      return {
        intents: Intents.find({u: Meteor.userId()})
      }
    }
  },
  name: 'intents.mine',
  title: 'My intents',
  parent: 'app.index'
});

Router.route('/intents/community', function () {
  this.render('intentsCommunity')
}, {
  subscriptions: function() {
    return [
      Meteor.subscribe('intentsCommunity')
    ]
  },
  data: function() {
    if (this.ready) {
      return {
        intents: Intents.find({})
      }
    }
  },
  name: 'intents.community',
  title: 'Community intents',
  parent: 'app.index'
});

Router.route('/intents/new', function () {
  this.render('intentsNew')
}, {
  name: 'intents.new',
  title: 'New intention',
  parent: 'intents.index'
});


Router.route('/intents/:_id', function () {
  this.render('intentsView')
}, {
  subscriptions: function() {
    return [
      Meteor.subscribe('intents', this.params._id)
    ]
  },
  data: function() {
    if (this.ready) {
      return {
        intention: Intents.findOne({_id: this.params._id})
      }
    }
  },
  name: 'intents.view',
  title: 'Intention details',
  parent: 'intents.index'
});

Router.route('/intents/:_id/edit', function () {
  this.render('intentsEdit')
}, {
  subscriptions: function() {
    return [
      Meteor.subscribe('intent', this.params._id)
    ]
  },
  data: function() {
    if (this.ready) {
      return {
        intent: Intents.findOne({_id: this.params._id})
      }
    }
  },
  name: 'intents.edit',
  title: 'Edit intention details',
  parent: 'intents.index'
});

Router.route('/entities/mine', function () {
  this.render('entitiesMine')
}, {
  subscriptions: function() {
    return [
      Meteor.subscribe('entitiesByUser', Meteor.userId())
    ]
  },
  data: function() {
    if (this.ready) {
      return {
        entities: Entities.find({u: Meteor.userId()})
      }
    }
  },
  name: 'entities.mine',
  title: 'Entities',
  parent: 'app.index'
});

Router.route('/entities/community', function () {
  this.render('entitiesCommunity')
}, {
  subscriptions: function() {
    return [
      Meteor.subscribe('entitiesCommunity')
    ]
  },
  data: function() {
    if (this.ready) {
      return {
        entities: Entities.find({})
      }
    }
  },
  name: 'entities.community',
  title: 'Community entities',
  parent: 'app.index'
});

Router.route('/entities/new', function () {
  this.render('entitiesNew')
}, {
  name: 'entities.new',
  title: 'New entity',
  parent: 'entities.mine'
});

Router.route('/entities/:_id', function () {
  this.render('entitiesView')
}, {
  subscriptions: function() {
    return [
      Meteor.subscribe('entities', this.params._id)
    ]
  },
  data: function() {
    if (this.ready) {
      return {
        intention: Intents.findOne({_id: this.params._id})
      }
    }
  },
  name: 'entities.view',
  title: 'Entity details',
  parent: 'entities.mine'
});

Router.route('/entities/:_id/edit', function () {
  this.render('entitiesEdit')
}, {
  subscriptions: function() {
    return [
      Meteor.subscribe('entities', this.params._id)
    ]
  },
  data: function() {
    if (this.ready) {
      return {
        entity: Entities.findOne({_id: this.params._id})
      }
    }
  },
  name: 'entities.edit',
  title: 'Edit entity details',
  parent: 'entities.mine'
});

Router.route('/logout', function () {
  Meteor.logout()
  this.redirect('/')
}, {
  name: 'app.logout'
});

Router.route( 'pageNotFound', {
  path: '/(.*)',
  where: 'client',
  action: function() {
    this.redirect('/')
  }
});
