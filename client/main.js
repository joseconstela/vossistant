recognition = new webkitSpeechRecognition();
final_transcript = '';
recognizing = false;
ignore_onend = null;
start_timestamp = null;

recognition.onstart = function() {
  recognizing = true;
  sAlert.success('Habla, te escucho.');
};

recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    sAlert.info('No escucho nada');
    ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    sAlert.error('No escucho nada, ¿tienes un micrófono?');
    ignore_onend = true;
  }
  if (event.error == 'not-allowed') {
    sAlert.error('No escucho nada, no tengo permisos :(');
    ignore_onend = true;
  }
};

recognition.onend = function() {
  recognizing = false;
  if (ignore_onend) {
    return;
  }
  if (!final_transcript) {
    sAlert.success('Preparad@ para comenzar');
    return;
  }

  if (window.getSelection) {
    $('#inbound').val('');
    final_transcript = interim_transcript = '';
  }
};

recognition.onresult = function(event) {
  var interim_transcript = '';
  if (typeof(event.results) == 'undefined') {
    recognition.onend = null;
    recognition.stop();
    return;
  }
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
      console.log('final_transcript', final_transcript);
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  final_transcript = capitalize(final_transcript);
  $('#inbound').val(linebreak(interim_transcript));
  $('#interim_span').val(linebreak(interim_transcript));

  // execute here
  if (!!final_transcript)
  Meteor.call('inbound', final_transcript, function(error, result){
    $('#inbound').val('');
    final_transcript = interim_transcript = '';
    if(error){
      sAlert.error(error.reason);

      var msg = new SpeechSynthesisUtterance('¡Oh! Algo ha ido mal...');
      recognitionToggle(false);
      window.speechSynthesis.speak(msg);
      msg.onend = function(e) {
        recognitionToggle(true);
      };

    } else if (!!result && !!result.say) {
      var msg = new SpeechSynthesisUtterance(result.say);
      recognitionToggle(false);
      window.speechSynthesis.speak(msg);
      msg.onend = function(e) {
        recognitionToggle(true);
      };
    } else {
      recognitionToggle(true);
    }
  });
};

recognitionToggle = function(toggle) {
  console.log('tog', toggle);
  if (toggle) {
    try {
      recognition.start();
    } catch (ex) {

    }
  } else {
    recognition.stop();
  }
}

Template.conversation.onCreated(function conversationOnCreated() {
  // counter starts at 0
  recognition.continuous = true;
  recognition.interimResults = true
  recognition.lang = 'es-ES';
  recognitionToggle(true);
});

Template.conversation.helpers({
  chat() {
    return chat.find({}, {sort: {createdAt: -1}});
  },
});

Template.conversation.events({
  'click button'(event, instance) {

  },
});
