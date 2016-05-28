Template.home.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('chat', Meteor.userId(), 1);
  });
});

Template.app.onRendered(function appRendered() {
  var lang = Session.get('language');
  if (!lang) {
    menuModule('languageSelector');
  }
});

Template.inboundMenu.helpers({
  menu: function(){
    return menuOptions.findOne({_id:Session.get('menuOptions')});
  }
});

Template.electronWindow.events({
  "click a": function(event, template){
     event.preventDefault();
     Meteor.call('openVossistanWindow', Meteor.isDevelopment, function(error, result){
     });
  }
});

Template.inboundMenuOption.events({
  "click li": function(event, template){
    var menu = menuOptions.findOne({_id:Session.get('menuOptions')});

    if (menu.action === 'session') {
      Session.setPersistent(menu.parameters[0], template.data.value);

      if (menu.parameters[0] === 'language') {
        TAPi18n.setLanguage(getUserLanguage())
        .done(function () {
          recognition.lang = TAPi18n.__('languageCode');
          speechSay({
            text: TAPi18n.__('app.languageChanged')
          });

        })
        .fail(function (error_message) {
          // Handle the situation
          console.log(error_message);
          recognition.lang = 'en-GB';
        });
      }

    }

    Session.set('menuOptions', null)
  }
});
