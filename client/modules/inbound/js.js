Template.inboundBox.onCreated(function conversationOnCreated() {

  $(function() {
    $("#inbound").focus(function(){
      $("#cuboid form").addClass("ready");
    })
    //remove '.ready' when user blus away but only if there is no content
    $("#inbound").blur(function(){
      if($(this).val() == "")
      $("#cuboid form").removeClass("ready");
    })

    //If the user is typing something make the arrow green/.active
    $("#inbound").keyup(function(){
      //this adds .active class only if the input has some text
      $(".submit-icon").toggleClass("active", $(this).val().length > 0);
    })
  });

  recognition.continuous = true;
  recognition.interimResults = true
  recognition.lang = 'es-ES';
  recognitionToggle(true);
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
    inbound('...');

    Meteor.call('inbound', txt, textId, function(error, result){
      final_transcript = interim_transcript = '';
      if(error){
        inbound(error.reason);
        var msg = new SpeechSynthesisUtterance('¡Oh! Algo ha ido mal...');
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
