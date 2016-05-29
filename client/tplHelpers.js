Template.registerHelper( 'chatText', (txt) => {
  return linkify(txt);
});

Template.registerHelper('sess', function(name){
  return !!Session.get(name);
});
