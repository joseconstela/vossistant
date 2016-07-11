Meteor.startup(() => {
  ServiceConfiguration.configurations.remove({});
  for (var ls in Meteor.settings.public.loginServices) {
    console.log('Service ~ >', ls);
    var setup = Meteor.settings.public.loginServices[ls];
    Object.assign(setup, Meteor.settings.private.loginServices[ls]);
    ServiceConfiguration.configurations.upsert( { service: ls }, { $set: setup } );
  }
});
