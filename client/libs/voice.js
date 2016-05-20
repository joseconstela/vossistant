recognition = new webkitSpeechRecognition();
final_transcript = '';
recognizing = false;
ignore_onend = null;
start_timestamp = null;

inbound = function(text) {
  $('#inbound').attr('placeholder', text).focus();
}

recognition.onstart = function() {
  recognizing = true;
  inbound('Habla, te escucho.');
};

recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    inbound('No escucho nada');
    ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    inbound('No escucho nada, ¿tienes un micrófono?');
    ignore_onend = true;
  }
  if (event.error == 'not-allowed') {
    inbound('No escucho nada, no tengo permisos :(');
    ignore_onend = true;
  }
};

recognition.onend = function() {
  recognizing = false;
  if (ignore_onend) {
    return;
  }
  if (!final_transcript) {
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
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  final_transcript = capitalize(final_transcript);
  $('#inbound').val(linebreak(interim_transcript));
  $('#interim_span').val(linebreak(interim_transcript));

  // execute here
  if (!final_transcript) { return false; }

  $('#inbound-form').submit();
};

recognitionToggle = function(toggle) {
  if (toggle) {
    try {
      recognition.start();
    } catch (ex) {}
  } else {
    recognition.stop();
  }
}
