Template.inboundBox.onRendered(function inboundBoxRendered() {

  $( document ).ready(function() {
    recognitionToggle(true);
    inboundFocus();
  });

});

Template.inboundBox.events({
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

    Meteor.call('inbound', txt, textId, function(error, result){
      final_transcript = interim_transcript = '';
      if(error){
        inbound(error.reason);
        var msg = new SpeechSynthesisUtterance(TAPi18n.__('speech.errorGeneral'));
        recognitionToggle(false);
        window.speechSynthesis.speak(msg);
        msg.onend = function(e) {
          recognitionToggle(true);
        };
        return false;
      }

      if (!result) {
        recognitionToggle(true);
        return false;
      }

      if (!!result.command) {
        commands.execute(result, true);
        recognitionToggle(true);
      }

      if(!!result.say) {
        var msg = new SpeechSynthesisUtterance(result.say);
        window.speechSynthesis.speak(msg);
        msg.onend = function(e) {
          recognitionToggle(true);
        };
      } else {
        recognitionToggle(true);
      }

    });
  }
});
