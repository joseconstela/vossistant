intentions = {
  'vo-name': [
    'Llámame _',
    'Mi nombre es _',
    'Me llamo _',
    'A partir de ahora llámame _',
    'Desde ahora llámame _'
  ],
  'greeting': [
    'Hola %greetings%',
    'Hola'
  ],
  'know-date-time': [
    'Qué %datetime-period% es',
    'Me pregunto que %datetime-period% es',
    'Me pregunto a que %datetime-period% estamos'
  ],
  'multi-media': [
    'Quiero ver %mmedia-video%'
  ]
};

entities = {
  'greetings': {
    'morning': [ 'buenos días' ]
  },
  'mmedia-video': {
    'film': [ 'una peli', 'una película' ],
    'show': [ 'una serie' ],
    'action': [ 'una película de acción' ],
    'rewarded': [ 'película premiada' ],
    'all-family': [ 'una película para la familia', 'una película en familia', 'una película para toda la familia' ],
    'commedy': [ 'una comedia', 'una película de humor' ],
    'docummentary': [ 'un documental' ],
    'drama': [ 'una película de drama' ],
    'terror': [ 'una película de terror' ],
    'independent': [ 'una película independiente' ],
    'romantic': [ 'una película romántica' ],
    'scify': [ 'una película de ciencia ficción' ],
    'humorist': [ 'un humorista', 'un monólogo' ],
    'thriller': [ 'un thriller' ]
  },
  'datetime-period': {
    'time': [ 'hora' ],
    'day': [ 'día' ],
    'day-of-month': [ 'día del mes', 'día de mes' ],
    'day-of-week': [ 'día de la semana', 'día de semana' ]
  }
};

intelligence = [];

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

textRequest = function(phrase, test) {
  phrase = normalize(phrase).trim();
  var r = null;
  lodash.forOwn(intelligence, function(values, keys) {
    var match = null;
    if(match = phrase.match(new RegExp(values.phrase,'i'))) {
      if (match[1]) values.match = match[1];
      r = values;
      return false;
    }
  });

  if (!!test) {
    console.log('test', '"' + phrase + '"', r);
  }
  return r;
}

regrexMatch = function (phrase, search, words) {

  var ww = null;
  if (words === '_') {
    return phrase.replace(new RegExp('_'), '(.+)');
  } else if (typeof words === 'string') {
    ww = words;
  } else if (typeof words === 'Object') {
    ww = '('+words.join('|')+')';
  } else {
    return false;
  }

  return phrase.replace(new RegExp(search, 'ig'), ww);
};

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
  return bytes/1024;
}

buildIntelligence = function() {

  lodash.forOwn(intentions, function(phrases, intention) {

    lodash.map(phrases, function(phrase) {

      var wildCard = phrase.match(/\_/g);
      var _entities = phrase.match(/%(\w+(-\w+)*)%/g);

      if (!!wildCard) {
        if (!!_entities) {
          _entities.push('_');
        } else {
          _entities = ['_'];
        }
      }

      var _uniqueEntities = lodash.uniq(_entities);
      var _listEntities = [];

      if (!_uniqueEntities.length) {
        intelligence.push({
          intention: intention,
          phrase: normalize(phrase)
        });
      } else {
        lodash.forEach(_uniqueEntities, function(_ue) {
          var _uec = _ue.replace(/\%/gi,'');

          if (_uec === '_') {

            intelligence.push({
              intention: intention,
              phrase: regrexMatch(normalize(phrase), _ue, _uec)
            });

          } else {
            lodash.forOwn(entities[_uec], function(values, keys) {
              var data = {};
              data[_uec] = keys;
              values = lodash.map(values, function(v) { return normalize(v); });
              intelligence.push({
                intention: intention,
                phrase: regrexMatch(normalize(phrase), _ue, values),
                data: data
              });
            });
          }

        });
      }

    });

  } );

  console.log('intelligence', intelligence);
  console.log('int', roughSizeOfObject(intelligence));

}
buildIntelligence();
textRequest('Hola', true);
textRequest('Quiero ver una peli', true);
textRequest('Llamame Jose', true);
