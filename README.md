# vossistant

Natural Language Understanding application built in MeteorJS, using [Web Speech API / webkitSpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice recognition and [SpeechSynthesisUtterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance) for Natural Language replies.

![screenshoot](private/screenshot.png)

Based on Intentions-Entities principle, using regular expressions.

Currently in spanish.

Any help is welcome.

(Originally made in a 24h hack rush)

## Flow

1. The server builds a huuuge list of regex-ready commands based on [intentions@server/ai.js](https://github.com/joseconstela/vossistant/blob/master/server/ai.js#L1) and [entities@server/ai.js](https://github.com/joseconstela/vossistant/blob/master/server/ai.js#54)
2. Matched requests, call [actions@server/actions.js](https://github.com/joseconstela/vossistant/blob/master/server/actions.js) (if any) to create actions.

Example of an action response:

    {
        command: {
          application: 'browser',            // Currently: 'browser' or 'meteor'
          parameters: [url]                  // ie ['example.com/?q=', 'mysearch']
        },
        say: 'Ok, abriendo ' + provider,     // What the FE will "say"
        text: 'Abriendo ' + url.join('')     // What will attached as the user's message reply
    }

## Available commands

Not documented. See [server/ai.js](https://github.com/joseconstela/vossistant/blob/master/server/ai.js)

## This is an <h2> tag
