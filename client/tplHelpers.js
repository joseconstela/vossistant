Template.registerHelper( 'chatText', (txt) => {
  return linkify(txt);
});

Template.registerHelper('sess', function(name, comparaWith){

  if(typeof comparaWith !== 'undefined') {
    return Session.get(name) === comparaWith;
  } else {
    return !!Session.get(name);
  }

});

Template.registerHelper('isElectronWindow', function(name){
  return navigator.userAgent.search('Electron') >= 0;
});
