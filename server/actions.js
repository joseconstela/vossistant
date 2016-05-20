actions = {};

actions['vo-name'] = function(analysis) {
  var phrase = 'De acuerdo. A partir de ahora te llamaré ' + analysis.match;
  return {
    command: {
      application: 'mongo',
      parameters: {'profile.name':analysis.match}
    },
    say: phrase,
    text: phrase
  };
}

actions['vo-logout'] = function(analysis) {
  return {
    command: {
      application: 'meteor',
      parameters: ['logout']
    },
    say: 'Hasta pronto.'
  };
};

actions['wiki'] = function(analysis) {

  var termUrl = encodeURI(analysis.match);
  var url = ['https://es.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='];
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
      text: analysis.match + ': ' + phrase.join('.'),
      say: phrase.join('.')
    };
  } catch (ex) {
    return fallback(termUrl);
  }

}

actions['greeting'] = function(analysis) {
  return {
    say: lodash.sample(['Hola', 'Hola, ¿Qué tal?'])
  };
};

actions['know-date-time'] = function(analysis) {
  var period = analysis.data['datetime-period'];
  var date = new Date();

  var response = [];

  if (period === 'time') {
    response.push(date.getHours() === 1 ? 'Es la' : 'Son las');
    response.push(date.getHours() + ':' +  date.getMinutes());
    return {
      say: response.join(' ')
    };
  } else if (period === 'day-of-month') {
    response.push('Estamos a día');
    response.push( moment().format('D') );
    return {
      say: response.join(' ')
    };
  } else if (period === 'day') {
    response.push('Hoy es');
    response.push( moment().format('dddd, D \\d\\e MMMM \\d\\e\\l YYYY') );

    return {
      say: response.join(' ')
    };
  }

};

actions['multi-media'] = function(analysis) {

  if (!!analysis.data && !!analysis.data['mmedia-video-type']) {

    var type = analysis.data['mmedia-video-type'];
    var genderUrl = 'https://www.netflix.com/browse/genre/';

    if (type === 'film') { return openBrowser(genderUrl, '83'); }
    if (type === 'show') { return openBrowser(genderUrl, '83'); }
    if (type === 'action') { return openBrowser(genderUrl, '1365'); }
    if (type === 'rewarded') { return openBrowser(genderUrl, '89844'); }
    if (type === 'all-family') { return openBrowser(genderUrl, '783'); }
    if (type === 'commedy') { return openBrowser(genderUrl, '6548'); }
    if (type === 'docummentary') { return openBrowser(genderUrl, '6839'); }
    if (type === 'drama') { return openBrowser(genderUrl, '5763'); }
    if (type === 'terror') { return openBrowser(genderUrl, '8711'); }
    if (type === 'independent') { return openBrowser(genderUrl, '7077'); }
    if (type === 'romantic') { return openBrowser(genderUrl, '8883'); }
    if (type === 'scify') { return openBrowser(genderUrl, '1492'); }
    if (type === 'humorist') { return openBrowser(genderUrl, '1516534'); }
    if (type === 'thriller') { return openBrowser(genderUrl, '8933'); }

  } else if (!!analysis.match) {
    var searchUrl = 'https://www.netflix.com/search/';
    var match = encodeURI(analysis.match);
    return openBrowser(searchUrl, match);
  }

}

openBrowser = function() {
  return {
    command: {
      application: 'browser',
      parameters: lodash.values(arguments)
    },
    say: 'Ok, abriendo Netflix',
    text: 'Abriendo ' + lodash.values(arguments).join('')
  }
}
