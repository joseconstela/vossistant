Template.inboundBox.onRendered(function inboundBoxRendered() {

  $().ready(() => {
    if ($('#inbound').length) {
      recognitionToggle(true)
    }

    $('#inbound').on('click', () => {
      $('#inbound').select()
    })
  })

})

/**
* Sets the placehodler text in #inbound
* @param  {[type]} error [description]
* @param  {[type]} text  [description]
* @return {[type]}       [description]
*/
inbound = (error, text) => {

  if (text && !recognition_enabled) {
    $('#inbound').attr('placeholder', text)
    return true
  }

  if (error || recognition_enabled === false) {
    $('#inbound').attr('placeholder', TAPi18n.__('app.inboundWriteOk'))
  } else {
    $('#inbound').attr('placeholder', TAPi18n.__('app.inboundTalkOk'))
  }

  if (Session.get('inboundFocused')) {
    $('#inbound').focus()
  }

}

Template.inboundBox.events({

  'submit #inbound-form': (evt, tpl) => {
    evt.preventDefault()

    Session.set('inboundFocused', !!$('#inbound:focus').length)

    let txt = $('#inbound').val() ? $('#inbound').val() : final_transcript

    recognitionToggle(false)

    if (txt === '') {
      return false
    }

    var cardId = cards.insert({
      i: {
        t: txt,
        ty: 't'
      }
    })

    $('#inbound').select()
    inbound(null)

    Meteor.call('inbound', txt, getUserLanguage(), cardId, (err, res) => {
      final_transcript = interim_transcript = ''

      if(err) {
        inbound(err.reason)
        recognitionToggle(false)
        speechSay({
          t: TAPi18n.__('speech.errorGeneral')
        })
        return false
      }

      if (!res) {
        return recognitionToggle('restart')
      }

      if (!!res.co) {
        commands.execute(res)
      }

      if(!!res.r && !!res.r.s) {
        speechSay({
          t: res.r.s
        })
      } else {
        recognitionToggle('restart')
      }

    })
  }
})
