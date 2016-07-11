Template.applicationLayout.onCreated(function() {
  var self = this

  self.autorun(() => {
    self.subscribe('cards', Meteor.userId(), 1)
    self.subscribe('jobs', Meteor.userId())
  })

})

Template.currentUserNavBar.rendered = function() {
  //$('.dropdown-toggle').dropdown()
}
