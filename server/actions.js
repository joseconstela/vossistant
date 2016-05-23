actions = {};

actions['meteor-update-profile-name'] = function(analysis) {
  var phrase = 'De acuerdo. A partir de ahora te llamaré ' + analysis.match;
  return {
    command: {
      application: 'mongo',
      parameters: {'profile.name':analysis.match}
    },
    say: phrase,
    text: phrase
  };
};

actions['dilbert'] = function(analysis) {

  try {
    var feed = _getRss('http://rss.latunyi.com/dilbert.rss');
    var entry = feed.responseData.feed.entries[0];
    return {
      display: {
        title: entry.title,
        link: entry.link,
        html: entry.content
      }
    };
  } catch (exception) {
    return false;
  }

}

actions['meteor-logout'] = function(analysis) {
  return {
    command: {
      application: 'meteor',
      parameters: ['logout']
    },
    say: 'Hasta pronto.'
  };
};

actions['wiki'] = function(analysis) {

  var url = ['https://es.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='];
  var termUrl = encodeURI(analysis.match);
  url.push(termUrl);

  var fallback = function(termUrl) {
    var googleUrl = 'https://www.google.es/#q=' + termUrl;

    return {
      command: {
        application: 'browser',
        parameters: [googleUrl]
      },
      say: 'No lo tengo muy claro... pero puedes buscar aquí.',
      text: 'Prueba en: ' + googleUrl
    };

  }

  try {
    var res = request.sync(url.join(''));
    var r = JSON.parse(res.body);

    var phrase = lodash.values(r.query.pages)[0].extract.split('.');

    var phrase = phrase.slice(0,2);
    if (phrase.join('.') === '') { return fallback(termUrl); }

    return {
      text: phrase.join('.') + '.',
      say: phrase.join('.')
    };
  } catch (ex) {
    return fallback(termUrl);
  }

};

actions['greeting'] = function(analysis) {
  return {
    say: lodash.sample(['Hola', 'Hola, ¿Qué tal?']),
    text: 'Hola, ¿qué tal?'
  };
};

actions['know-date-time'] = function(analysis) {
  var period = analysis.data['datetime-period'];
  var date = new Date();

  var response = [];

  if (period === 'time') {
    response.push(date.getHours() === 1 ? 'Es la' : 'Son las');
    response.push( moment().format('HH:mm') );
    return {
      say: response.join(' '),
      text: response.join(' ')
    };
  } else if (period === 'day-of-month') {
    response.push('Estamos a día');
    response.push( moment().format('D') );
    return {
      say: response.join(' '),
      text: response.join(' ')
    };
  } else if (period === 'day-of-week') {
    response.push('Estamos a');
    response.push( moment().format('dddd') );
    return {
      say: response.join(' '),
      text: response.join(' ')
    };
  } else if (period === 'day') {
    response.push('Hoy es');
    response.push( moment().format('dddd, D \\d\\e MMMM \\d\\e\\l YYYY') );

    return {
      say: response.join(' '),
      text: response.join(' ')
    };
  }

};

actions['internet-search'] = function(analysis) {

  var source = analysis.data['internet-search-sources'];

  var sSources = {
    'youtube': 'https://www.youtube.com/results?search_query=',
    'google': 'https://www.google.es/#q=',
    'bing': 'https://www.bing.com/search?q=',
    'google maps': 'https://www.google.com/maps/search/',
    'twitter': 'https://twitter.com/search?q='
  };

  var match = encodeURI(analysis.match);
  return _browser([sSources[source], match], [source]);

};

actions['mmedia-search'] = function(analysis) {

  var source = analysis.data['mmedia-sources'];

  if (source === 'youtube') {
    var searchUrl = 'https://www.youtube.com/results?search_query=';
    var match = encodeURI(analysis.match);
    return _browser([searchUrl, match], ['Youtube']);
  }

};

actions['mmedia-netflix'] = function(analysis) {

  if (!!analysis.data && !!analysis.data['mmedia-video-type']) {

    var type = analysis.data['mmedia-video-type'];
    var genderUrl = 'https://www.netflix.com/browse/genre/';

    if (type === 'film') { return _browser(['https://www.netflix.com/browse'], ['Netflix']); }
    if (type === 'show') { return _browser([genderUrl, '83'], ['Netflix']); }
    if (type === 'action') { return _browser([genderUrl, '1365'], ['Netflix']); }
    if (type === 'rewarded') { return _browser([genderUrl, '89844'], ['Netflix']); }
    if (type === 'all-family') { return _browser([genderUrl, '783'], ['Netflix']); }
    if (type === 'commedy') { return _browser([genderUrl, '6548'], ['Netflix']); }
    if (type === 'docummentary') { return _browser([genderUrl, '6839'], ['Netflix']); }
    if (type === 'drama') { return _browser([genderUrl, '5763'], ['Netflix']); }
    if (type === 'terror') { return _browser([genderUrl, '8711'], ['Netflix']); }
    if (type === 'independent') { return _browser([genderUrl, '7077'], ['Netflix']); }
    if (type === 'romantic') { return _browser([genderUrl, '8883'], ['Netflix']); }
    if (type === 'scify') { return _browser([genderUrl, '1492'], ['Netflix']); }
    if (type === 'humorist') { return _browser([genderUrl, '1516534'], ['Netflix']); }
    if (type === 'thriller') { return _browser([genderUrl, '8933'], ['Netflix']); }

  } else if (!!analysis.match) {
    return _browser([
      'https://www.netflix.com/search/',
      encodeURI(analysis.match)
    ], 'Netflix');
  }

}

_getRss = function(url) {
  var url = [
    'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&q=',
    url
  ];

  var res = request.sync(url.join(''));
  return JSON.parse(res.body);
}

/**
* [function description]
* @param  {[type]} url      [description]
* @param  {object} provider [description]
* @return {[type]}          [description]
*/
_browser = function(url, provider) {

  return {
    command: {
      application: 'browser',
      parameters: url
    },
    say: 'Ok, abriendo ' + provider.join('/'),
    text: 'Abriendo ' + url.join('')
  }

}
