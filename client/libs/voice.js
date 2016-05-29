voice_enabled = true;
speech_enabled = true;

final_transcript = '';
recognizing = false;
ignore_onend = null;
start_timestamp = null;

// Speech
speech = {};

if (!('SpeechSynthesisUtterance' in window)) {
  speech_enabled = false;
} else {
  speech = new SpeechSynthesisUtterance();
}

// Recognition
recognition = {};

var SpeechRecognition = window.SpeechRecognition ||
                        window.webkitSpeechRecognition ||
                        window.mozSpeechRecognition ||
                        window.msSpeechRecognition ||
                        window.oSpeechRecognition;

if (!SpeechRecognition) {
  voice_enabled = false;
} else {
  recognition = new SpeechRecognition();
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
    recognitionToggle('restart');
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
    $('.main-input').val('');
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
  $('.main-input').val(linebreak(interim_transcript));

  // execute here
  if (!final_transcript) { return false; }

  $('#inbound-form').submit();
};

speechSay = function(options) {
  if (!speech_enabled) return false;
  recognitionToggle(false);
  inbound(null, '...');
  speech.text = options.text || '';
  speech.lang = TAPi18n.__('languageCode');
  if (typeof options.callback === 'function') {
    speech.onend = function() {
      options.callback();
      recognitionToggle(true);
    };
  } else {
    speech.onend = function() {
      recognitionToggle(true);
    };
  }
  speechSynthesis.speak(speech);
};

recognitionToggle = function(toggle) {
  if (toggle === true) {
    try {
      inbound();
      if (voice_enabled) {
        if ($('#inbound:visible').length) {
          recognition.start();
        }
        inbound();
      }
    } catch (ex) {
    }
  } else if (toggle === false) {
    if (voice_enabled)
    recognition.stop();
  } else if (toggle === 'restart') {
    recognition.stop();
    setTimeout(function() { recognitionToggle(true); }, 500);
  }
}
