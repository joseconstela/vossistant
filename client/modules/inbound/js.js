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

        let trigger = lodash.find(triggersRaw, {_id: req.i})

        if (!!trigger.ac) {

          let w = new Worker('worker.js');

          w.onmessage = function (oEvent) {
            console.log('worker result', oEvent.data)

            w.terminate()
            w = undefined

            if(!!trigger.sr) {
              let hb = new Handlebars()
              let tpl = hb.compile(
                lodash.sample(trigger.sr)
              );

              speechSay({
                t: tpl(oEvent.data)
              })
            }

            recognitionToggle('restart')

          }

          w.postMessage(trigger) // start the worker.

        } else {

          if(!!trigger.sr) {
            speechSay({
              t: lodash.sample(trigger.sr)
            })
          }

          recognitionToggle('restart')

        }

      } else {
        recognitionToggle('restart')
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
