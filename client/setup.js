getUserLanguage = function () {
  return 'es';
};

Meteor.startup(() => {

  TAPi18n.setLanguage(getUserLanguage())
  .done(function () {
  })
  .fail(function (error_message) {
    // Handle the situation
    console.log(error_message);
  });

});
