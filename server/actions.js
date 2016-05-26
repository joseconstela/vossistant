actions = {};

actions['vo-login'] = function(analysis) {

  // Logout user
  if (Meteor.userId()) {
    commands.execute({command: {
      application: 'meteor',
      parameters: ['logout']
    }}, false);
  }

  var phrase = lodash.sample([
    _('actions.vo-login.phrase_1', {name: analysis.match})
  ]);

  // TODO slugify analysis.match
  var parsedUserName = analysis.match.toLowerCase();

  // Find user by username
  var user = Meteor.users.findOne({username : parsedUserName});

  if (user) {

    return {
      command: {
        application: 'meteor',
        parameters: ['login', parsedUserName + '@app.com', 'password']
      },
      say: phrase,
      text: phrase
    };

  } else {
    Accounts.createUser({
      email: parsedUserName + '@app.com',
      password: 'password',
      username: parsedUserName,
      profile: {
        name: analysis.match
      }
    });

    return {
      command: {
        application: 'meteor',
        parameters: ['login', parsedUserName + '@app.com', 'password']
      },
      say: phrase
    };
  }

};

actions['vo-meteor-name'] = function(analysis) {

  var phrase = lodash.sample([
    _('actions.vo-meteor-name.phrase_1', {name:analysis.match}),
    _('actions.vo-meteor-name.phrase_2', {name:analysis.match})
  ]);

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

actions['vo-logout'] = function(analysis) {

  var phrase = lodash.sample([
    _('actions.vo-logout.phrase_1', {})
  ]);

  return {
    command: {
      application: 'meteor',
      parameters: ['logout']
    },
    say: phrase
  };
};

actions['wiki'] = function(analysis) {

  var url = ['https://es.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='];
  var termUrl = encodeURI(analysis.match);
  url.push(termUrl);

  var fallback = function(termUrl) {
    var googleUrl = 'https://www.google.es/#q=' + termUrl;

    var phrase = lodash.sample([
      _('actions.wiki.notSure_1', {})
    ]);

    var tryAt = lodash.sample([
      _('actions.wiki.tryAt_1', {googleUrl: googleUrl})
    ]);

    return {
      command: {
        application: 'browser',
        parameters: [googleUrl]
      },
      say: phrase,
      text: tryAt
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

  var phrase = lodash.sample([
    _('actions.greeting.phrase_1', {}),
    _('actions.greeting.phrase_2', {})
  ]);

  return {
    say: phrase,
    text: phrase
  };
};

actions['know-date-time'] = function(analysis) {
  var period = analysis.data['datetime-period'];
  var date = new Date();

  var phrase = '';

  if (period === 'time') {

    var translationParams = {
      count: date.getHours(),
      hour: moment().format('HH'),
      minute: moment().format('mm'),
    };

    phrase = lodash.sample([
      _('actions.know-date-time.time_1', translationParams),
    ]);
  } else if (period === 'day-of-month') {

    var translationParams = {
      dayOfMonth: moment().format('D')
    };

    phrase = lodash.sample([
      _('actions.know-date-time.day-of-month_1', translationParams),
    ]);
  } else if (period === 'day-of-week') {

    var translationParams = {
      dayOfWeek: moment().format('dddd')
    };

    phrase = lodash.sample([
      _('actions.know-date-time.day-of-week_1', translationParams),
    ]);
  } else if (period === 'day') {

    var translationParams = {
      dayOfWeek: moment().format('dddd'),
      dayOfMonth: moment().format('D'),
      month: moment().format('MMMM'),
      year: moment().format('YYYY')
    };

    phrase = lodash.sample([
      _('actions.know-date-time.day_1', translationParams)
    ]);
  } else {
    return false;
  }

  return {
    say: phrase,
    text: phrase
  };
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

actions['maps-search'] = function(analysis) {
  var match = encodeURI(analysis.match);
  return _browser(['https://www.google.com/maps/search/', match], ['Google Maps']);
};

actions['mmedia-search'] = function(analysis) {

  var source = analysis.data['mmedia-sources'];

  if (source === 'youtube') {
    var searchUrl = 'https://www.youtube.com/results?search_query=';
    var match = encodeURI(analysis.match);
    return _browser([searchUrl, match], ['Youtube']);
  } else {
    return false;
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
    say: _('actions._browser.say', {provider: provider.join('/')}),
    text: _('actions._browser.text', {url: url.join('')})
  }

}
