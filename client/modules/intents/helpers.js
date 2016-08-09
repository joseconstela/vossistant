Template.registerHelper('editableItem', (u) => {
  return u === Meteor.userId()
})

Template.registerHelper('intentEnabled', (i) => {
  console.log(i)
  return IntentsHash.findOne({i:i})
})

Template.intentsListItem.events({
  "click .intent-switch": (evt, tpl) => {
    let btn = $(evt.target)
    btn.find('.spinner').show()

    let data = {
      i: tpl.data._id,
      e: btn.hasClass('intent-enable')
    }

    Meteor.call('intent-switch', data, (error, result) => {
      btn.find('.spinner').hide()
    })
  }
})

Template.afArrayField_simpleArray.rendered = () => {
  $('.textcomplete').textcomplete([{
    match: /(^|\s)%(.*[^%])$/,
    search: (term, callback) => {
      Meteor.call('entitiesSearch', term, (error, results) => {
        callback($.map(results, (result) => {
          return result.i
        }))
      })
    },
    replace: (word) => {
      return ` %${word}% `
    }
  }])
}

let codeMirrorOpts = {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  tabSize: 2,
  gutters: [80],
  extraKeys: {'Ctrl-Q': 'toggleComment'}
}

Template.intentsNew.rendered = () => {
  if ($('textarea').length)
  var editor = CodeMirror.fromTextArea($('.codemirror')[0], codeMirrorOpts)
}

Template.intentsEdit.rendered = () => {
  if ($('textarea').length)
  var editor = CodeMirror.fromTextArea($('.codemirror')[0], codeMirrorOpts)
}
