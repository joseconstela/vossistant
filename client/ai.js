triggers = {}
triggersRaw = []
entitiesRaw = []

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
  var r = {};
  lodash.forOwn(triggers[language], function(values, keys) {
    var match = null;
    if(match = phrase.match(new RegExp(values.p,'i'))) {
      if (match[1]) values.m = match[1];
        Object.assign(r, values);
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
* Builds the ```intelligence``` object for all languages.
*/
buildIntelligence = function(input, entities) {

  triggers = {}
  triggersRaw = input
  entitiesRaw = entities

  // When running meteor tests, TAPi18n's method returns null.
  var langs = Meteor.isTest ? ['es', 'en'] : lodash.keys(TAPi18n.getLanguages())

  langs = ['es']

  langs.forEach( function(langCode) {

    var translations = {}

    triggers[langCode] = []

    lodash.map(input, function(intention) {

      lodash.map(intention.tr, function(phrase) {

        var _entities = phrase.match(/%(\w+(-\w+)*)%/g)

        var _uniqueEntities = lodash.uniq(_entities)

        if (!_uniqueEntities.length) {
          triggers[langCode].push({
            i: intention._id,
            p: normalize(phrase)
          })
        } else {

          lodash.forEach(_uniqueEntities, function(_ue) {
            var _uec = _ue.replace(/\%/gi,'')

            lodash.forOwn(entities[_uec], function(values, keys) {
              let data = {}
              data[_uec] = keys
              values = lodash.map(values, (v) => { return normalize(v) })
              triggers[langCode].push({
                i: intention._id,
                p: regrexMatch(normalize(phrase), _ue, values),
                d: data
              })
            })

          })
        }

      })

    })
  } )

}
