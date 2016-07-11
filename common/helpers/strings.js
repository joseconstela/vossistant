linkify = function(inputText) {

  if (!inputText) {return;}

  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
}

isEmailValid = function(address) {
  return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(address);
};

isPasswordValid = function(password) {
  return password.length >= 6;
};

regex_urls = /\b(https?|ftp|file):\/\/\S+/g;
getUrls = function(str) {
  var match = str.match(regex_urls);
  var parser = document.createElement('a');
  return lodash.map(match, function(url) {
    parser.href = url;
    return {
      original: url,
      protocol: parser.protocol, // => "http:"
      host: parser.host,     // => "example.com:3000"
      hostname: parser.hostname, // => "example.com"
      port: parser.port || 80,     // => "3000"
      pathname: parser.pathname, // => "/pathname/"
      hash: parser.hash || null,     // => "#hash"
      search: parser.search || null,   // => "?search=test"
      origin: parser.origin   // => "http://example.com:3000"
    };
  });
};
