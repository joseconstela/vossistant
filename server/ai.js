intelligence = {};

/**
* [description]
* @param  {[type]} function( [description]
* @return {[type]}           [description]
*/
normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
  to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
  mapping = {};

  for(var i = 0, j = from.length; i < j; i++ )
  mapping[ from.charAt( i ) ] = to.charAt( i );

  return function( str ) {
    var ret = [];
    for( var i = 0, j = str.length; i < j; i++ ) {
      var c = str.charAt( i );
      if( mapping.hasOwnProperty( str.charAt( i ) ) )
      ret.push( mapping[ c ] );
      else
      ret.push( c );
    }
    return ret.join( '' );
  }

})();

/**
* [function description]
* @param  {[type]} phrase [description]
* @param  {[type]} debug  [description]
* @return {[type]}        [description]
*/
textRequest = function(phrase, language, debug) {
  phrase = normalize(phrase).trim();
  var r = null;
  lodash.forOwn(intelligence[language], function(values, keys) {
    var match = null;
    if(match = phrase.match(new RegExp(values.phrase,'i'))) {
      if (match[1]) values.match = match[1];
      r = values;
      return false;
    }
  });
  if (!!debug) {
    console.log('TEST', '"' + phrase + '"', r);
  }
  return r;
}

/**
* [regrexMatch description]
* @param  {[type]} phrase [description]
* @param  {[type]} search [description]
* @param  {[type]} words  [description]
* @return {[type]}        [description]
*/
regrexMatch = function (phrase, search, words) {

  var ww = null;
  if (typeof words === 'string') {
    ww = words;
  } else if (typeof words === 'object') {
    ww = '('+words.join('|')+')';
  } else {
    return false;
  }

  return phrase.replace(new RegExp(search, 'ig'), ww);
};

/**
* [function description]
* @param  {[type]} object [description]
* @return {[type]}        [description]
*/
roughSizeOfObject = function( object ) {

  var objectList = [];
  var stack = [ object ];
  var bytes = 0;

  while ( stack.length ) {
    var value = stack.pop();

    if ( typeof value === 'boolean' ) {
      bytes += 4;
    }
    else if ( typeof value === 'string' ) {
      bytes += value.length * 2;
    }
    else if ( typeof value === 'number' ) {
      bytes += 8;
    }
    else if
    (
      typeof value === 'object'
      && objectList.indexOf( value ) === -1
    )
    {
      objectList.push( value );
      for( var i in value ) {
        stack.push( value[ i ] );
      }
    }
  }
  return (bytes/1024/1024).toFixed(2) + 'MB';
}

/**
* [function description]
* @param  {[type]} debug [description]
* @return {[type]}       [description]
*/
buildIntelligence = function() {

  var langs = Meteor.isTest ? ['es', 'en'] : lodash.keys(TAPi18n.getLanguages());

  var fs = require('fs');
  var path = require('path');

  console.log('Meteor.rootPath', Meteor.rootPath);
  console.log('Meteor.absolutePath', Meteor.absolutePath);
  console.log('process.env.PWD', process.env.PWD);
  console.log('TAPi18n', TAPi18next.options.resStore);

  if (Meteor.isTest) {
    Meteor.absolutePath = process.env.PWD;
  }

  langs.forEach( function(langCode) {
    var path = Meteor.absolutePath + '/i18n/' + langCode + '.i18n.json';
    var buff = fs.readFileSync( path );
    var translations = JSON.parse(buff);

    intelligence[langCode] = [];

    lodash.map(translations.intentions, function(v, k) {
      var intention = k;
      var phrases = v;

      lodash.map(phrases, function(phrase) {

        var _entities = phrase.match(/%(\w+(-\w+)*)%/g);

        var _uniqueEntities = lodash.uniq(_entities);

        if (!_uniqueEntities.length) {
          intelligence[langCode].push({
            intention: intention,
            phrase: normalize(phrase)
          });
        } else {
          lodash.forEach(_uniqueEntities, function(_ue) {
            var _uec = _ue.replace(/\%/gi,'');

            lodash.forOwn(translations.entities[_uec], function(values, keys) {
              var data = {};
              data[_uec] = keys;
              values = lodash.map(values, function(v) { return normalize(v); });
              intelligence[langCode].push({
                intention: intention,
                phrase: regrexMatch(normalize(phrase), _ue, values),
                data: data
              });
            });

          });
        }

      });

    });
  } );

  console.log('intelligence size', roughSizeOfObject(intelligence));

}
