Meteor.startup(() => {

  getUserLanguage = function () {
    return 'en'

    if (Session.get('language')) {
      $('html').attr('lang', Session.get('language'))
      return Session.get('language')
    } else {
      let userLang = navigator.language || navigator.userLanguage
      try {
        userLang = userLang.split('-')[0]
      } catch (ex) {}

      let langs = lodash.keys(TAPi18n.getLanguages())
      if (langs.indexOf(userLang) >= 0) {
        $('html').attr('lang', userLang)
        return userLang
      } else {
        $('html').attr('lang', 'en')
        return 'en'
      }
    }
  };

  TAPi18n.setLanguage(getUserLanguage())
  .done(function () {
    moment.locale(getUserLanguage())
    recognition.lang = TAPi18n.__('languageCode')
  })
  .fail(function (error) {
    // TODO Handle the situation
    console.log('Error setting language', error)
    recognition.lang = 'en-GB'
  })

})
