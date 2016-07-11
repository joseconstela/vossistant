actions = {}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['app-section-open'] = (data) => {
  let section = data.d['app-section-name']

  var phrase = lodash.sample([
    _('actions.app-section-open.phrase_1', {section:data.m}),
    _('actions.app-section-open.phrase_2', {section:data.m}),
    _('actions.app-section-open.phrase_3', {section:data.m})
  ])

  return {
    co: {
      a: 'app',
      p: {url: 'plugin.' + section + '.home'}
    },
    r: {
      s: phrase
    },
    store: false
  }
}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['app-section-close'] = (data) => {

  return {
    co: {
      a: 'app',
      p: {url: 'app.index'}
    },
    store: false
  }
}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['meteor-change-name'] = (data) => {

  let phrase = lodash.sample([
    _('actions.meteor-change-name.phrase_1', {name:data.m}),
    _('actions.meteor-change-name.phrase_2', {name:data.m})
  ])

  return {
    co: {
      a: 'mongo',
      p: {'profile.name': data.m}
    },
    r: {
      s: phrase
    },
    store: false
  }

}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['meteor-get-name'] = (data) => {

  var name = ''
  var phrase = ''

  try {
    name = Meteor.user().profile.name
  } catch (ex) { console.log(ex) }

  if (name) {
    phrase = lodash.sample([
      _('actions.meteor-get-name.phraseName_1', {name:name})
    ])
  } else {
    phrase = lodash.sample([
      _('actions.meteor-get-name.phraseNoName_1')
    ])
  }

  return {
    r: {
      s: phrase
    },
    store: false
  }

}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['dilbert'] = (data) => {

  try {
    var feed = _getRss('http://rss.latunyi.com/dilbert.rss')
    var entry = feed.responseData.feed.entries[0]
    return {
      d: {
        t: entry.title,
        l: entry.link,
        h: entry.content
      }
    }
  } catch (exception) {
    return false
  }

}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['vo-logout'] = (data) => {

  var phrase = lodash.sample([
    _('actions.vo-logout.phrase_1', {})
  ])

  return {
    co: {
      a: 'meteor',
      p: ['logout']
    },
    r: {
      s: phrase
    },
    store: false
  }
}

/**
 * [function description]
 * @param  {[type]} data     [description]
 * @param  {[type]} original [description]
 * @return {[type]}          [description]
 */
actions['reminder-wake-up'] = function(data, original) {

  var date = moment()

  var fullTime = !Number(data.m)
  if (!fullTime) {
    data.m += ':00'
  }

  var hourSplit = data.m.split(':')
  hourSplit[0] = Number(hourSplit[0])
  hourSplit[1] = Number(hourSplit[1])

  if (!!data.d) {

    if(!!data.d['moment-period']) {
      date.add(hourSplit[0], data.d['moment-period'])
    } else if(!!data.d['day-period']) {
      date.set('hour', hourSplit[0])
      date.set('minutes', hourSplit[1])
      var period = data.d['day-period']

      if (isThisTime(date.get('hour'), 1) && period === 'evening') {
        date.set('hour', date.get('hour') + 12)
      } else if (isThisTime(date.get('hour'), 2), period === 'night') {
        if (date.get('hour') > timeRanges[0][0]) {
          date.set('hour', date.get('hour') + 12)
        }
      } else if (!period) {
        if (hourSplit[0] <= moment().get('hour')) {
          date.set('hour', date.get('hour') + 12)
        }
      }
    } else if(!!data.d['time-period']) {

      if ( hourSplit[0] < 13 && data.d['time-period'] === 'pm' ) {
        date.set('hour', hourSplit[0] + 12)
      } else if ( hourSplit[0] === 12 && data.d['time-period'] === 'am' ) {
        date.set('hour', 0)
      } else {
        date.set('hour', hourSplit[0])
      }

      date.set('minutes', hourSplit[1])
    }
  } else {
    date.set('hour', hourSplit[0])
    date.set('minutes', hourSplit[1])
  }

  new Job(jobsC, 'default', {
    title: original,
    command: 'reminder',
    parameters: {
      userId: Meteor.userId()
    }
  }).delay( date.diff(moment(), 'seconds') *1000).save()

  var phrase = lodash.sample([
    _('actions.reminder-wake-up.phrase_1', {
      time: date.format('hh:mm a')
    })
  ])

  return {
    r: {
      s: phrase
    },
    store: false
  }

}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['wiki'] = (data) => {

  var url = ['https://es.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=']
  var termUrl = encodeURI(data.m)
  url.push(termUrl)

  var fallback = function(termUrl) {
    var googleUrl = 'https://www.google.com/#q=' + termUrl

    var phrase = lodash.sample([
      _('actions.wiki.notSure_1', {})
    ])

    var tryAt = lodash.sample([
      _('actions.wiki.tryAt_1', {googleUrl: googleUrl})
    ])

    return {
      co: {
        a: 'browser',
        p: [googleUrl]
      },
      r: {
        s: phrase
      },
      text: tryAt
    }

  }

  try {
    var res = request.sync(url.join(''))
    var r = JSON.parse(res.body)

    var phrase = lodash.values(r.query.pages)[0].extract.split('.')

    var phrase = phrase.slice(0,2)
    if (phrase.join('.') === '') { return fallback(termUrl) }

    return {
      r: {
        t: phrase.join('.') + '.',
        s: phrase.join('.') + '.'
      },
    }

  } catch (ex) {
    return fallback(termUrl)
  }

}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['greeting'] = (data) => {

  var phrase = lodash.sample([
    _('actions.greeting.phrase_1', {}),
    _('actions.greeting.phrase_2', {})
  ])

  return {
    r: {
      s: phrase
    },
    store: false
  }
}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['know-date-time'] = (data) => {
  var period = data.d['datetime-period']
  var date = new Date()

  var phrase = ''

  if (period === 'time') {

    var translationParams = {
      count: date.getHours(),
      hour: moment().format('HH'),
      minute: moment().format('mm'),
    }

    phrase = lodash.sample([
      _('actions.know-date-time.time_1', translationParams),
    ])
  } else if (period === 'day-of-month') {

    var translationParams = {
      dayOfMonth: moment().format('D')
    }

    phrase = lodash.sample([
      _('actions.know-date-time.day-of-month_1', translationParams),
    ])
  } else if (period === 'day-of-week') {

    var translationParams = {
      dayOfWeek: moment().format('dddd')
    }

    phrase = lodash.sample([
      _('actions.know-date-time.day-of-week_1', translationParams),
    ])
  } else if (period === 'day') {

    var translationParams = {
      dayOfWeek: moment().format('dddd'),
      dayOfMonth: moment().format('D'),
      month: moment().format('MMMM'),
      year: moment().format('YYYY')
    }

    phrase = lodash.sample([
      _('actions.know-date-time.day_1', translationParams)
    ])
  } else {
    return false
  }

  return {
    r: {
      s: phrase
    },
    store: false
  }
}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['internet-search'] = (data) => {
  var source = data.d['internet-search-sources']
  var sSources = {
    'youtube': 'https://www.youtube.com/results?search_query=',
    'google images': 'https://www.google.es/search?tbm=isch&q=',
    'google': 'https://www.google.com/#q=',
    'bing': 'https://www.bing.com/search?q=',
    'google maps': 'https://www.google.com/maps/search/',
    'twitter': 'https://twitter.com/search?q='
  }

  var match = encodeURI(data.m)
  return _browser([sSources[source], match], [source])
}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['maps-search'] = (data) => {

  try {
    var map = _embededMap(null, data)
    return {
      d: {
        t: data.m,
        // l: entry.link,
        h: map.url
      }
    }
  } catch (exception) {
    return false
  }

}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['mmedia-search'] = (data) => {

  var source = data.d['mmedia-sources']

  if (source === 'youtube') {
    var searchUrl = 'https://www.youtube.com/results?search_query='
    var match = encodeURI(data.m)
    return _browser([searchUrl, match], ['Youtube'])
  } else {
    return false
  }

}

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
actions['mmedia-netflix'] = (data) => {

  if (!!data.d && !!data.d['mmedia-video-type']) {

    var type = data.d['mmedia-video-type']
    var genderUrl = 'https://www.netflix.com/browse/genre/'

    if (type === 'film') { return _browser(['https://www.netflix.com/browse'], ['Netflix']) }
    if (type === 'show') { return _browser([genderUrl, '83'], ['Netflix']) }
    if (type === 'action') { return _browser([genderUrl, '1365'], ['Netflix']) }
    if (type === 'rewarded') { return _browser([genderUrl, '89844'], ['Netflix']) }
    if (type === 'all-family') { return _browser([genderUrl, '783'], ['Netflix']) }
    if (type === 'commedy') { return _browser([genderUrl, '6548'], ['Netflix']) }
    if (type === 'docummentary') { return _browser([genderUrl, '6839'], ['Netflix']) }
    if (type === 'drama') { return _browser([genderUrl, '5763'], ['Netflix']) }
    if (type === 'terror') { return _browser([genderUrl, '8711'], ['Netflix']) }
    if (type === 'independent') { return _browser([genderUrl, '7077'], ['Netflix']) }
    if (type === 'romantic') { return _browser([genderUrl, '8883'], ['Netflix']) }
    if (type === 'scify') { return _browser([genderUrl, '1492'], ['Netflix']) }
    if (type === 'humorist') { return _browser([genderUrl, '1516534'], ['Netflix']) }
    if (type === 'thriller') { return _browser([genderUrl, '8933'], ['Netflix']) }

  } else if (!!data.m) {
    return _browser([
      'https://www.netflix.com/search/',
      encodeURI(data.m)
    ], ['Netflix'])
  }

}

/**
 * [function description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
_getRss = function(url) {
  var url = [
    'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&q=',
    url
  ]

  var res = request.sync(url.join(''))
  return JSON.parse(res.body)
}

/**
 * [function description]
 * @param  {[type]} url      [description]
 * @param  {[type]} provider [description]
 * @return {[type]}          [description]
 */
_browser = function(url, provider) {

  return {
    co: {
      a: 'browser',
      p: url
    },
    r: {
      s: _('actions._browser.say', {provider: provider[0]}),
      t: _('actions._browser.text', {
        url: url.join(''),
        provider: provider.join('/')
      })
    }
  }

}

/**
 * [function description]
 * @param  {[type]} mode [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
_embededMap = function(mode, data) {
  var search = encodeURI(data.m)
  return {
    url: 'https://www.google.com/maps/embed/v1/search?q='+search+'&key={{settings.public.google.maps}}'
  }
}
