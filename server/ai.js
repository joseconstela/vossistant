intentions = {
  'greeting': [
    'Hola %greetings%',
    'Hola'
  ],
  // 'who-is': 'Quién es %*%',
  // 'what-is': 'Quién es %*%',
  'know-date-time': [
    'Que %datetime-period% es',
    'Me pregunto que %datetime-period% es',
    'Me pregunto a que %datetime-period% estamos'
  ]
};

entities = {
  'greetings': {
    'morning': [ 'buenos días' ]
  },
  'datetime-period': {
    'time': [ 'hora' ],
    'day-of-month': [ 'día del mes', 'día de mes' ],
    'day-of-week': [ 'día de la semana', 'día de semana' ]
  }
};

autoReply = {
  greeting: '¡Hola! ¿Qué tal estás?'
};

intelligence = [];

normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
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

    if(phrase.match(new RegExp(values.phrase,'ig'))) {
      var aR = autoReply[values.intention];
      if (!!aR) {
        values.autoReply = aR;
      }

      r = values;
      return false;
    }
  });

  if (!!test) {
    console.log('test', r);
  } else {
    return r;
  }
}

regrexMatch = function (phrase, search, words) {
  var ww = '('+words.join('|')+')';
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

      var _entities = phrase.match(/%(\w+(-\w+)*)%/g);

      var _uniqueEntities = lodash.uniq(_entities);
      var _listEntities = [];

      if (!_uniqueEntities.length) {
        intelligence.push({
          intention: intention,
          phrase: phrase
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
              phrase: regrexMatch(phrase, _ue, values),
              data: data
            });
          });

        });
      }

    });

  } );
}

buildIntelligence();
