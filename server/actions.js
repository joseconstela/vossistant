actions = {};

actions['vo-name'] = function(analysis) {
  console.log(analysis);
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
  var type = analysis.data['mmedia-video'];
  var u = 'https://www.netflix.com/browse/genre/';

  if (type === 'film') { return openBrowser(u, '83'); }
  if (type === 'show') { return openBrowser(u, '83'); }
  if (type === 'action') { return openBrowser(u, '1365'); }
  if (type === 'rewarded') { return openBrowser(u, '89844'); }
  if (type === 'all-family') { return openBrowser(u, '783'); }
  if (type === 'commedy') { return openBrowser(u, '6548'); }
  if (type === 'docummentary') { return openBrowser(u, '6839'); }
  if (type === 'drama') { return openBrowser(u, '5763'); }
  if (type === 'terror') { return openBrowser(u, '8711'); }
  if (type === 'independent') { return openBrowser(u, '7077'); }
  if (type === 'romantic') { return openBrowser(u, '8883'); }
  if (type === 'scify') { return openBrowser(u, '1492'); }
  if (type === 'humorist') { return openBrowser(u, '1516534'); }
  if (type === 'thriller') { return openBrowser(u, '8933'); }
}

openBrowser = function(url, sub) {
  return {
    command: 'browser',
    parameters: [url+sub],
    say: 'Ok, abriendo Netflix',
    text: 'Abriendo ' + url+sub
  }
}
