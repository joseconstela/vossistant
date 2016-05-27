Template.registerHelper( 'chatText', (txt) => {
  return linkify(txt);
});

Template.registerHelper('sess', function(name){
  return !!Session.get(name);
});

Template.registerHelper('isElectronWindow', function(name){
  return navigator.userAgent.search('Electron') >= 0;
});
