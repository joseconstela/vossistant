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

replacer = (template, obj) => {
  var keys = Object.keys(obj);
  var func = Function(...keys, "return `" + template + "`;");

  return func(...keys.map(k => obj[k]));
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
      let req = textRequest(txt, 'es');

      if (req) {

        let trigger = lodash.find(triggersRaw, {_id: req.i})

        if (!!trigger.ac) {

          let w = new Worker('worker.js');

          w.onmessage = function (oEvent) {
            w.terminate()
            w = undefined

            if(!!oEvent.data && !!trigger.sr) {
              speechSay({
                t: replacer(_.sample(trigger.sr), oEvent.data)
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
