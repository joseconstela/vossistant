# Vossistant
<img src="https://raw.githubusercontent.com/joseconstela/vossistant/master/private/appIcon.png" width="120" align="right" />
<a href="https://github.com/joseconstela/vossistant/blob/master/LICENSE">
  <img src="https://img.shields.io/badge/LICENSE-MIT-brightgreen.svg">
</a>
<a href="https://travis-ci.org/joseconstela/vossistant">
  <img src="https://img.shields.io/travis/joseconstela/vossistant.svg">
</a>
<a href="https://gitter.im/joseconstela/vossistant">
  <img src="https://img.shields.io/badge/JOIN%20THE%20CHAT-gitter-yellow.svg">
</a>
<a href="https://travis-ci.org/joseconstela/vossistant">
  <img src="https://img.shields.io/badge/DEVELOPER%3F-wiki-orange.svg">
</a>
<a href="https://waffle.io/joseconstela/vossistant">
  <img src="https://img.shields.io/badge/ROADMAP-waffle-blue.svg">
</a>

Voice-enabled personal assistant web application built in MeteorJS.

It uses [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice recognition and [Synthesis Utterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance) for Natural Language replies. Based on Intentions & Entities principle, using regular expressions.

<img src="https://raw.githubusercontent.com/joseconstela/vossistant/master/private/SCREENSHOT.png" />

## Install locally

At the moment there's no packaged version for Vossistant, but you still can run it running the following commands (OSX & Linux)

```
curl https://install.meteor.com/ | sh
git clone git@github.com:joseconstela/vossistant.git
cd vossistant
meteor
```

## Development and customization

Fork, commit, play and visit the [Wiki](https://github.com/joseconstela/vossistant/wiki)



## Example commands

*Vossistant supports multiple phrases and words that can trigger the same action. The following list is an example. It might be outdated.*

<table style="width:100% !important;">
    <tr style="color: white; background: #BB617A none repeat scroll 0% 0%;">
        <th>Actions</th>
        <th>Trigger(s)</th>
        <th>Other possibilities</th>
    </tr>
    <tr>
        <td>Login</td>
        <td>I'm ```your user name```</td>
        <td>_There's no need to signup_</td>
    </tr>
    <tr>
        <td>Logout</td>
        <td>Logout</td>
        <td></td>
    </tr>
    <tr>
        <td>Change username</td>
        <td>Call me ```___```</td>
        <td></td>
    </tr>
    <tr>
        <td>Greeting</td>
        <td>Hello</td>
        <td></td>
    </tr>
    <tr>
        <td>Search on wikipedia</td>
        <td>What is ```___```</td>
        <td></td>
    </tr>
    <tr>
        <td>Get the time</td>
        <td>What time is it</td>
        <td></td>
    </tr>
    <tr>
        <td>Search multimedia</td>
        <td>Search ```___``` in ```Youtube```</td>
        <td></td>
    </tr>
    <tr>
        <td>Netflix</td>
        <td>I want to see ```___```</td>
        <td>
          <ul>
            <li>a tv show</li>
            <li>an action movie</li>
            <li>a commedy</li>
            <li>a thriller</li>
            <li>...</li>
          </ul>
        </td>
    </tr>
    <tr>
        <td>Dilbert commic</td>
        <td>Dilbert</td>
        <td></td>
    </tr>
    <tr>
        <td>Google Maps search</td>
        <td>Show me a map for ```___```</td>
        <td></td>
    </tr>
    <tr>
        <td>Search on internet</td>
        <td>Search ```___``` at ```Google```</td>
        <td>
          <ul>
            <li>Youtube</li>
            <li>Google Maps</li>
            <li>Google</li>
            <li>Bing</li>
            <li>Twitter</li>
          </ul>
        </td>
    </tr>
</table>

# Licenses
* Vossistant: [MIT](https://github.com/joseconstela/vossistant/blob/master/LICENSE)
* App icon: Linkware. http://www.pelfusion.com
