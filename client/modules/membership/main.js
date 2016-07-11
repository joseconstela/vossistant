Template.loginForm.onRendered(function loginFormRendered() {
  if ($('input:eq(0)').val()) {
    $('input:eq(1)').focus();
  } else {
    $('input:eq(0)').focus();
  }
});

Template.socialLoginsLogin.events({
  "click .login-with-twitter": function(event, template){
    Meteor.loginWithTwitter({
      requestOfflineToken: true
    }, function(error, result) {
      if (error && error.reason === 'Already account') {
        formFeedbackMessage(
          '.form-feedback',
          'danger',
          TAPi18n.__('membership.login.services.twitter.alreadyAccount')
        );
      } else if (error) {
        formFeedbackMessage(
          '.form-feedback',
          'danger',
          TAPi18n.__('membership.login.services.twitter.unknownError')
        );
      } else {
        Router.go('app.index');
      }
    });
  },
  "click .login-with-google": function(event, template){
    Meteor.loginWithGoogle({
      requestOfflineToken: true
    }, function(error, result) {
      if (error && error.reason === 'Already account') {
        formFeedbackMessage(
          '.form-feedback',
          'danger',
          TAPi18n.__('membership.login.services.google.alreadyAccount')
        );
      } else if (error) {
        formFeedbackMessage(
          '.form-feedback',
          'danger',
          TAPi18n.__('membership.login.services.google.unknownError')
        );
      } else {
        Router.go('app.index');
      }
    });
  },
  "click .login-with-github": function(event, template){
    Meteor.loginWithGithub({
      requestPermissions: ["user"],
      requestOfflineToken: true
    }, function(error, result) {
      if (error) {
        formFeedbackMessage(
          '.form-feedback',
          'danger',
          TAPi18n.__('membership.login.services.github.unknownError')
        );
      } else {
        Router.go('app.index');
      }
    });
  }
});
