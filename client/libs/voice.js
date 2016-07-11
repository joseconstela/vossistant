recognition_enabled = true;
speech_enabled = true;

final_transcript = '';
recognizing = false;
ignore_onend = null;
start_timestamp = null;

if (!('SpeechSynthesisUtterance' in window)) {
  speech_enabled = false;
}

// Recognition
recognition = {};

var SpeechRecognition = window.SpeechRecognition ||
window.webkitSpeechRecognition ||
window.mozSpeechRecognition ||
window.msSpeechRecognition ||
window.oSpeechRecognition;

if (!SpeechRecognition) {
  recognition_enabled = false;
} else {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-GB';
}

/**
* [function description]
* @return {[type]} [description]
*/
recognition.onstart = function() {
  recognizing = true;
  inbound();
};

/**
* [function description]
* @param  {[type]} event [description]
* @return {[type]}       [description]
*/
recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    recognitionToggle('restart');
    inbound(null, TAPi18n.__('app.inboundNotHear'));
  };

  if (event.error == 'network') {
    recognition_enabled = false;
    inbound();
  };

  if (event.error == 'audio-capture') {
    inbound( TAPi18n.__('app.inboundNotEarGotMic'), null);
    recognition_enabled = false;
    ignore_onend = true;
  };

  if (event.error == 'not-allowed') {
    inbound( TAPi18n.__('app.inboundNotEarNoPermissions'), null);
    recognition_enabled = false;
    ignore_onend = true;
  }
};

/**
* [function description]
* @return {[type]} [description]
*/
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

/**
* [function description]
* @param  {[type]} event [description]
* @return {[type]}       [description]
*/
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

/**
* [function description]
* @param  {[type]} options [description]
* @return {[type]}         [description]
*/
speechSay = function(options) {

  if (typeof options.c !== 'function') {
    options.c = function() {
      recognitionToggle('restart');
    };
  }

  if (!speech_enabled || !recognition_enabled) {
    inbound(null, options.t);
    return false;
  };

  recognitionToggle(false);
  inbound(null)

  var speech = new SpeechSynthesisUtterance();
  speech.text = options.t || '';
  speech.lang = TAPi18n.__('languageCode');

  speech.onend = function() {
    options.c();
    recognitionToggle(true);
  };

  speechSynthesis.speak(speech);
};

/**
* [function description]
* @param  {[type]} toggle [description]
* @return {[type]}        [description]
*/
recognitionToggle = function(toggle) {

  if(!recognition.stop) {
    return inbound();
  }

  if (toggle === true) {

    try {
      inbound();
      if (recognition_enabled) {
        if ($('#inbound:visible').length) {
          inbound();
          recognition.start();
        } else {
          recognition.top();
        }
      }
    } catch (ex) {
      console.log('ex', ex);
    }

    $('#inbound').focus();

  } else if (toggle === false) {
    if(!!recognition.stop) {
      recognition.stop();
    }
  } else if (toggle === 'restart') {
    if(!!recognition.stop) {
      recognition.stop();
      setTimeout(function() { recognitionToggle(true); }, 500);
    }
  }

};
