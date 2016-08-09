Template.registerHelper( 'cardText', (type, txt) => {
  return linkify(txt);
});

Template.registerHelper( 'any', (arr) => {
  return arr.length
});

Template.registerHelper('cardDisplayHtml', function(html){
  html = html.replace('{{settings.public.google.maps}}', Meteor.settings.public.google.maps)
  if (validUrl(html)) {
    return '<iframe src="'+html+'" allowfullscreen></iframe>'
  } else {
    return html
  }

});

Template.registerHelper('sess', function(name){
  return !!Session.get(name);
});

Template.registerHelper('currentRouteIs', function (name) {
  try {
    return Router.current().route.getName().indexOf(name) === 0;
  } catch (Ex) {
    return false;
  }
});

Template.registerHelper('length', (thing) => {
  try {
    return thing ? thing.fetch().length : true;
  } catch (ex) {
    return false;
  }
});

Template.registerHelper('user', (p, profile) => {
  if (!Meteor.user()) { return false; }
  try {
    return profile ? Meteor.user().profile[p] : Meteor.user()[p];
  } catch (ex){
    return false;
  }
});

Template.registerHelper('userEmail', function(){
  if (!Meteor.user()) { return false; }
  try {
    return Meteor.user().profile.name;
  } catch (ex){
    return false;
  }
});

Template.registerHelper('userAvatar', function(){
  if (!Meteor.user()) { return false; }
  try {
    return Meteor.user().profile.profile_image_url;
  } catch (ex){
    return false;
  }
});

Template.registerHelper('servicesIsEnabled', function(argument){
  if (!!Meteor.user() && !!Meteor.user().services)
  return typeof Meteor.user().services[argument] !== 'undefined';
});

Template.registerHelper('debug', function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});
