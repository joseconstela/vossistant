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

    console.log('data ~ > ', data);

    if (data.say) {
      speechSay({
        text: data.say,
        callback: function() {
          recognitionToggle(true);

          chat.insert({
            "direction" : "outbound",
            "text" : data.say,
            "userId" : data.userId,
            "data" : {
              "display" : {
                "title" : "Some music...",
                "link" : "",
                "html" : '<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257717036&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>'
              }
            }
          });
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
      } else if (method === 'login') {
        Meteor.loginWithPassword(data[1], data[2]);
      }
      return true;

    } else {
      if (method === 'logout') {
        Meteor.users.update({
          _id: Meteor.userId(),
        }, {$set: { "services.resume.loginTokens" : [] }});
        return true;
      }
    }

  },

  browser: function(data, isClient) {

    if (!data.length) { return false; }

    if (isClient || !Meteor.isElectron) {
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
    } else {
      if (!Meteor.isElectron) { return true; }
      var spawn = require('child_process').spawn;
      var bat = spawn('open', [data.join('')]);
      return true;
    }
  }
};
