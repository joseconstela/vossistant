voice_enabled = true;
speech_enabled = true;

final_transcript = '';
recognizing = false;
ignore_onend = null;
start_timestamp = null;

recognition = {};
speech = {};

if (!('SpeechSynthesisUtterance' in window)) {
  speech_enabled = false;
} else {
  speech = new SpeechSynthesisUtterance();
}

speechSay = function(options) {
  if (!speech_enabled) return false;
  speech.text = options.text;
  speech.lang = TAPi18n.__('languageCode');
  if (typeof options.callback === 'function') {
    speech.onend = function() {
      options.callback();
    };
  } else {
    speech.onend = function() {};
  }
  speechSynthesis.speak(speech);
};

if (!('webkitSpeechRecognition' in window)) {
  voice_enabled = false;
} else {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-GB';
}

recognition.onstart = function() {
  recognizing = true;
  inbound();
};

recognition.onerror = function(event) {

  console.log('Recognition error', event);

  if (event.error == 'no-speech') {
    inbound(null, TAPi18n.__('app.inboundNotHear'));
  };

  if (event.error == 'network') {
    voice_enabled = false;
    inbound();
  };

  if (event.error == 'audio-capture') {
    inbound( TAPi18n.__('app.inboundNotEarGotMic'), null);
    voice_enabled = false;
    ignore_onend = true;
  };

  if (event.error == 'not-allowed') {
    inbound( TAPi18n.__('app.inboundNotEarNoPermissions'), null);
    voice_enabled = false;
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
    recognitionToggle(false);
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

  // execute here
  if (!final_transcript) { return false; }

  $('#inbound-form').submit();
};

recognitionToggle = function(toggle) {
  if (toggle) {
    try {
      inbound();
      if (voice_enabled) {
        recognition.start();
      }
    } catch (ex) {
    }
  } else {
    if (voice_enabled)
    recognition.stop();
  }
}
