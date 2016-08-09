Template.conversation.rendered = () => {
  Meteor.call('build-intents', {}, (error, result) => {
    if (result) {
      buildIntelligence(result.intents, result.entities)
    }
  })
}
