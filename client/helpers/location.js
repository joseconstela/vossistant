getGeoDetails = function(callback) {
  $.getJSON('http://ipinfo.io', function(data){
  })
};

getGeoLocation = function(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          callback(null, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        });
    }
};
