Template.applicationLayout.onCreated(function() {
  var self = this

  self.autorun(() => {
    self.subscribe('intentsHash', Meteor.userId())
    self.subscribe('jobs', Meteor.userId())
  })
})

Template.applicationLayout.rendered = function() {
  //$('.dropdown-toggle').dropdown()
}
