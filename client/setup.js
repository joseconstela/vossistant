menuOptions = new Mongo.Collection(null);
Meteor.startup(() => {

  Meteor.isElectron = Meteor.settings.public.isElectron ? Meteor.settings.public.isElectron : false;

  getUserLanguage = function () {
    return Session.get('language') ? Session.get('language') : 'en';
  };

  TAPi18n.setLanguage(getUserLanguage())
  .done(function () {
    recognition.lang = TAPi18n.__('languageCode');
  })
  .fail(function (error_message) {
    // Handle the situation
    console.log(error_message);
    recognition.lang = 'en-GB';
  });

});
