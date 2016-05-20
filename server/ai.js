intentions = {
  'vo-name': [
    'Llámame (.+)',
    'Mi nombre es (.+)',
    'Me llamo (.+)',
    'De ahora en adelante me llamo (.+)',
    'De ahora en adelante me llamaré (.+)',
    'A partir de ahora llámame (.+)',
    'A partir de ahora quiero que me llames (.+)',
    'Desde ahora llámame (.+)'
  ],
  'vo-logout': [
    'Cerrar sesión'
  ],
  'wiki': [
    'Cuál es (.+)',
    'Quién es un (.+)',
    'Quién es una (.+)',
    'Quién era la (.+)',
    'Quién era el (.+)',
    'Quién era (.+)',
    'Qué es un (.+)',
    'Qué es una (.+)',
    'Qué son los (.+)',
    'Qué son las (.+)',
    'Qué era (.+)',
    'Qué es (.+)'
  ],
  'greeting': [
    'Hola %greetings%',
    'Hola'
  ],
  'know-date-time': [
    'Qué %datetime-period%',
    'Qué %datetime-period% es',
    'Me pregunto qué %datetime-period% es',
    'Me pregunto a qué %datetime-period% estamos'
  ],
  'mmedia-search': [
    'Quiero ver (.+) en %mmedia-sources%',
    'Ver (.+) en %mmedia-sources%'
  ],
  'mmedia-netflix': [
    'Quiero ver %mmedia-video-type%',
    'Quiero ver (.+)'
  ],
  'internet-search': [
    'Quiero buscar (.+) en %internet-search-sources%',
    'Buscar (.+) en %internet-search-sources%',
    '(.+) en %internet-search-sources%'
  ]
};

entities = {
  'internet-search-sources': {
    'youtube': ['Youtube'],
    'google maps': ['Google Maps', 'Mapas de google'],
    'google': ['Google'],
    'bing': ['Bing'],
    'twitter': ['Twitter']
  },
  'mmedia-sources': {
    'youtube': ['Youtube', 'internet']
  },
  'greetings': {
    'morning': [ 'buenos días' ]
  },
  'mmedia-video-type': {
    'show': [ 'una serie' ],
    'action': [ 'una película de acción' ],
    'rewarded': [ 'película premiada' ],
    'all-family': [ 'una película para la familia', 'una película en familia', 'una película para toda la familia' ],
    'commedy': [ 'una comedia', 'una película de humor' ],
    'docummentary': [ 'un documental' ],
    'drama': [ 'una película de drama', 'un drama', 'un dramón' ],
    'terror': [ 'una película de terror', 'una película de miedo', 'una peli de terror', 'una peli de miedo' ],
    'independent': [ 'una película independiente' ],
    'romantic': [ 'una película romántica' ],
    'scify': [ 'una película de ciencia ficción' ],
    'humorist': [ 'un humorista', 'un monólogo' ],
    'thriller': [ 'un thriller' ],
    'film': [ 'una peli', 'una película' ]
  },
  'datetime-period': {
    'day-of-month': [ 'día del mes', 'día de mes' ],
    'day-of-week': [ 'día de la semana', 'día de semana' ],
    'time': [ 'hora' ],
    'day': [ 'día' ]
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

textRequest = function(phrase, debug) {
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

  if (!!debug) {
    console.log('test', '"' + phrase + '"', r);
  }
  return r;
}

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

buildIntelligence = function(debug) {

  lodash.forOwn(intentions, function(phrases, intention) {

    lodash.map(phrases, function(phrase) {

      var _entities = phrase.match(/%(\w+(-\w+)*)%/g);

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

        });
      }

    });

  } );

  if(debug) {
    console.log('intelligence size', roughSizeOfObject(intelligence));
  }

}

buildIntelligence(false);
/* [
  'Quiero buscar aa en Twitter',
  'Buscar Celanova en Google Maps'
].forEach(function(r) {
  if (!textRequest(r, true)) {
    console.log('FAIL', r);
  }
}); */
