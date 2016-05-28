commands = {

  /**
  * Main method of command execution
  * @param  {Object}  action   commands method to be executed.
  * @param  {Boolean} isClient Allows you to filter where your command is meant to run.
  * @return {Boolean} executed If true, command is not sent to the browser, (it prevents commands from being triggered twice)
  */
  execute: function(action, isClient) {
    if (!!commands[action.command.application]) {
      return commands[action.command.application](action.command.parameters, isClient);
    }
    return false;
  },

  terminal: function(data, isClient) {

    var method = data[0];

    if (isClient) {

      Session.set('application', 'nucleusTerminal');

    } else {

      NucleusTerminal.initialize({
        username: '123',
        password: '123',
        port: 3333,
        hostname: 'localhost',
        shell: 'zsh',
        cwd: '~',
        "term": {
          "termName": "xterm",
          "geometry": [80, 24],
          "scrollback": 1000,
          "visualBell": false,
          "popOnBell": false,
          "cursorBlink": false,
          "screenKeys": false,
          "colors": [
            "#2e3436",
            "#cc0000",
            "#4e9a06",
            "#c4a000",
            "#3465a4",
            "#75507b",
            "#06989a",
            "#d3d7cf",
            "#555753",
            "#ef2929",
            "#8ae234",
            "#fce94f",
            "#729fcf",
            "#ad7fa8",
            "#34e2e2",
            "#eeeeec"
          ]
        }
      });

      return false; // send the command back to the browser

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
