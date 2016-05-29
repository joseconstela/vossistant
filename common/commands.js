commands = {

  /**
  * Main method of command execution
  * @param  {Object}  action   commands method to be executed.
  * @param  {Boolean} isClient Allows you to filter where your command is meant to run.
  * @return {Boolean} executed If isClient is false and executed is TRUE, command is not sent to the browser, so it won't be triggered twice.
  */
  execute: function(action, isClient, callback) {
    if (!!commands[action.command.application]) {
      var r = commands[action.command.application](action.command.parameters, isClient);
      if (typeof callback === 'function') callback();
      return r;
    }
    return true;
  },

  reminder: function(data, isClient) {

    console.log('data', data);

    if (!isClient) {
      chat.insert({
        "direction" : "outbound",
        "text" : data.text,
        "userId" : data.userId,
        "data" : {
          "display" : soundCloudSong('242394750')
        }
      });
    }

  },

  meteor: function(data, isClient) {

    var method = data[0];

    if (isClient) {

      if (method === 'logout') {
        Meteor.logout();
        return true;
      }
      return true;

    }

  },

  browser: function(data, isClient) {

    if (!data.length) { return false; }

    if (isClient) {
      var externalUrl = window.open(data.join(''), '_blank');
      try {
        externalUrl.focus();
      } catch (ex) {
        speechSay({
          text: TAPi18n.__('speech.errorWindowFocus')
        });
        return false;
      }
      return true;
    }
  }
};
