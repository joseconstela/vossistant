Template.loginForm.events({
  "submit #loginForm": function(event, template) {
    event.preventDefault();

    speechSay({
      text: TAPi18n.__('app.waitAMomentPlease'),
      callback: function() {

        // Perform login/signup
        Meteor.call('loginOrSignup', {
          email: $('[name="email"]').val(),
          password: $('[name="password"]').val()
        }, function(error, result) {

          if (error) {
            return false;
          }

          if (result === 'login') {
            Meteor.loginWithPassword(
              $('[name="email"]').val(),
              $('[name="password"]').val(),
              function(err, res) {
                if (err) {

                  speechSay({
                    text: TAPi18n.__('speech.incorrectLoginDetails')
                  });

                  $('[name="password"]').val('').addClass('hidden');
                  $('[name="email"]').val('').removeClass('hidden').focus('')
                }
              }
            );
          }

        });

      }
    });
  },
  "keydown #loginForm .form-control": function(event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.keyCode !== 13) { return false; }
    var input = $(event.currentTarget);
    var name = input.attr('name');
    var val = input.val();
    if (name === 'email') {
      // validate email
      if (!isEmailValid(val)) {
        input.val('').attr('placeholder', TAPi18n.__('speech.incorrectEmail'));
        speechSay({
          text: TAPi18n.__('speech.incorrectEmailSay')
        });
      } else {
        $('[name="email"]').addClass('hidden');
        $('[name="password"]').removeClass('hidden').focus();

        if (!Session.get('speech.typeYourPassword')) {
          speechSay({
            text: TAPi18n.__('speech.typeYourPassword')
          });
          Session.setPersistent('speech.typeYourPassword', true);
        }

      }
    } else if (name === 'password') {
      if (val === '') {
        // Recover password process
        speechSay({
          text: TAPi18n.__('app.waitAMomentPlease')
        });



      } else {
        // validate password
        if (!isPasswordValid(val)) {
          input.val('').attr('placeholder', TAPi18n.__('speech.incorrectPassword'));
          speechSay({
            text: TAPi18n.__('speech.incorrectPasswordSay')
          });
        } else {
          $('#loginForm').submit();
        }
      }
    }
  }
});

Template.loginForm.onRendered(function loginFormRendered() {
  $('input:first-child').focus();
});
