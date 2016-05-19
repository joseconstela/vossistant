actions = {
  'know-date-time': function(analysis) {
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
      response.push( date.getDate() );

      return {
        say: response.join(' ')
      };
    }

  }
};
