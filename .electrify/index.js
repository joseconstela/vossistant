var app       = require('app');
var browser   = require('browser-window');
var electrify = require('electrify')(__dirname);

var window    = null;

  app.on('ready', function() {
    electrify.start(function(meteor_root_url) {
      // creates a new electron window
      window = new browser({
        width: 400, height: 400,
        'node-integration': false
      });
      console.log('meteor_root_url', meteor_root_url);
      window.loadURL('index.html');
    });
  });

app.on('window-all-closed', function() {
  app.quit();
});

app.on('will-quit', function terminate_and_quit(event) {
  if(electrify.isup() && event) {
    event.preventDefault();
    electrify.stop(function(){
      app.quit();
    });
  }
});

//
// =============================================================================
//
// the methods bellow can be called seamlessly from your Meteor's
// client and server code, using:
//
//    Electrify.call('methodname', [..args..], callback);
//
// ATENTION:
//    From meteor, you can only call these methods after electrify is fully
//    started, use the Electrify.startup() convenience method for this
//
//
// Electrify.startup(function(){
//   Electrify.call(...);
// });
//
// =============================================================================
//
// electrify.methods({
//   'method.name': function(name, done) {
//     // do things... and call done(err, arg1, ..., argN)
//     done(null);
//   }
// });
//
