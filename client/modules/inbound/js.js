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

    $('#inbound').select()
    inbound(null)

    final_transcript = interim_transcript = ''

    try {
      let req = textRequest(txt, 'es', true);

      if (req) {
        // Do all the stuff

        let trigger = lodash.find(triggersRaw, {_id: req.i})

        if (!!trigger.ac) {
          eval(trigger.ac)
        }

        if(!!trigger.sr) {
          speechSay({
            t: lodash.sample(trigger.sr)
          })
        }

        recognitionToggle('restart')
      } else {
        return recognitionToggle('restart')
      }

    } catch (ex) {
      inbound(TAPi18n.__('speech.errorGeneral'))
      recognitionToggle(false)
      speechSay({
        t: TAPi18n.__('speech.errorGeneral')
      })
    }

  }
})
