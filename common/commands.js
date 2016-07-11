commands = {

  /**
  * Main method of command execution
  * @param  {Object}  action   commands method to be executed.
  * @param  {Boolean} isClient Allows you to filter where your command is meant to run.
  * @return {Boolean} executed Retunr tru if was executed. (to prevent multiple triggers)
  */
  execute: (action, callback) => {
    console.log(action);
    if (!!commands[action.co.a]) {
      var r = commands[action.co.a](action.co.p)
      if (typeof callback === 'function') callback()
      return r
    }
    return false
  },

  app: (data) => {

    if (!Meteor.isClient) {
      return false
    }
    Router.go(data.url)
    return true;
  },

  reminder: (data) => {
    if (!Meteor.isClient) {
      cards.insert({
        u: data.userId,
        d: soundCloudSong('242394750')
      })
      return true
    }
  },

  meteor: (data) => {

    if (Meteor.isClient && data[0] === 'logout') {
      Meteor.logout()
      return true
    }

    return false
  },

  browser: (data) => {

    if (!data.length) { return false }

    if (Meteor.isClient) {
      let externalUrl = window.open(data.join(''), '_blank')
      try {
        externalUrl.focus()
      } catch (ex) {
        speechSay({
          t: TAPi18n.__('speech.errorWindowFocus')
        })
      }
      return true
    }
    return false

  }
};
