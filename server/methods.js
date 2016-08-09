Meteor.methods({
  'intent-switch': (i) => {

    let ieData = {
      u: Meteor.userId(),
      i: i.i
    }

    if (i.e) {
      IntentsHash.insert(ieData)
    } else {
      IntentsHash.remove(ieData, {multiple: true})
    }

  },

  'build-intents': () => {

    let iIds = _.map(
      IntentsHash.find({u: Meteor.userId()}, {fields: {i:true}}).fetch(), (h) => {
        return h.i
      }
    )

    let intents = Intents.find({_id: {$in: iIds}}, {fields: { tr: 1, sr: 1, ac: 1 }}).fetch()

    let eIs = []
    _.map(intents, (i) => {
      return _.map(i.tr, (tr) => {
        _.forEach(tr.match(/%(\w+(-\w+)*)%/g), (e) => {
          eIs.push( e.replace(/%/g, '') )
        })
      })
    })

    let entitiesQuery = Entities.find({i: {$in: eIs}}).fetch()

    let entities = {}
    _.map(entitiesQuery, (e) => {
      entities[e.i] = {}

      _.map(e.e, (i) => {
        entities[e.i][i.v] = i.s
      })

    })

    return {
      intents: intents,
      entities: entities
    }

  }
})
