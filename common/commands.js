commands = {

  execute: function(action, isClient) {
    if (!!commands[action.command.application]) {
      return commands[action.command.application](action.command.parameters, isClient);
    }
    return false;
  },

  meteor: function(data, isClient) {

    var method = data[0];

    if (isClient) {

      if (method === 'logout') {
        Meteor.logout();
        return true;
      }

    } else {
      if (method === 'logout') {
        Meteor.users.update({}, {$set: { "services.resume.loginTokens" : [] }});
        return true;
      }
    }

  },

  browser: function(data, isClient) {

    if (!data.length) { return false; }

    if (isClient) {
      window.open(data.join(''), '_blank').focus();
      return true;
    } else {
      var spawn = require('child_process').spawn;
      var bat = spawn('open', [data.join('')]);
      return true;
    }
  }
};
