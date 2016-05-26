/**
* Sends the focus back to #inbound
* @return {[type]} [description]
*/
inboundFocus = function() {
  if ($('textarea, input:not(#inbound):visible').length) { return false; }
  $('#inbound').focus(); return true;
};

/**
* Sets the placehodler text in #inbound
* @param  {[type]} error [description]
* @param  {[type]} text  [description]
* @return {[type]}       [description]
*/
inbound = function(error, text) {
  if (error || voice_enabled === false) {
    if (error) { sAlert.error(error); }
    $('.navbar-brand .fa').attr('class', 'fa fa-microphone-slash');
    $('#inbound').attr('placeholder', TAPi18n.__('app.inboundWriteOk')).focus();
  } else {
    if(!text) text = TAPi18n.__('app.inboundTalkOk');
    $('.navbar-brand .fa').attr('class', 'fa fa-microphone');
    $('#inbound').attr('placeholder', text).focus();
  }
  $('#inbound').focus();
};

menuModule = function(module) {

  if (module === 'languageSelector') {
    menuOpts = lodash.map(TAPi18n.getLanguages(), function(v, k) {
      return { title: v.name, value:k };
    });
    var menu = menuOptions.insert({
      title: TAPi18n.__('app.languageSetup'),
      action: 'session',
      parameters: ['language'],
      options: menuOpts
    });

    speechSay({
      text: TAPi18n.__('app.languageSetup')
    });

    Session.set('menuOptions', menu);
  }

}

Template.inboundBox.onRendered(function inboundBoxRendered() {
  $( document ).ready(function() {
    recognitionToggle(true);
    inboundFocus();
  });
});

Template.inboundBox.events({

  /* HACK to use your OS voice recognition solution focused in #inbound */
  /*
  "input #inbound": function(event, template) {
    var $this = $(this);
    var delay = 500; // 2 seconds delay after last input
    clearTimeout($this.data('timer'));
    $this.data('timer', setTimeout(function(){
      $this.removeData('timer');
      $('#inbound-form').submit();
    }, delay));
  },
  */

  "submit #inbound-form": function(event, template){
    event.preventDefault();
    recognitionToggle(false);

    var txt = $('#inbound').val() ? $('#inbound').val() : final_transcript;

    if (txt === '') return false;

    var textId = chat.insert({
      direction: 'inbound',
      text: txt
    });

    $('#inbound').val('');
    inbound(null, '...');

    Meteor.call('inbound', txt, Session.get('language'), textId, function(error, result){
      final_transcript = interim_transcript = '';

      if(error){
        inbound(error.reason);
        speechSay({
          text: TAPi18n.__('speech.errorGeneral')
        });
        recognitionToggle(false);
        utterance.onend = function(e) {
          recognitionToggle(true);
        };
        return false;
      }

      if (result && !!result.command) {
        commands.execute(result, true);
        recognitionToggle(true);
      }

      if(result && !!result.say) {
        speechSay({
          text: result.say,
          callback: function() {
            recognitionToggle(true);
          }
        });
      } else {
        recognitionToggle(true);
      }

    });
  }
});
