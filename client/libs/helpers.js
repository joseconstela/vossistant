// F12 and F5 for electron
document.addEventListener("keydown", function (e) {
  if (e.which === 123) {
    require('remote').getCurrentWindow().toggleDevTools();
  } else if (e.which === 116) {
    location.reload();
  }
});

// Strings helpers
first_char = /\S/;
two_line = /\n\n/g;
one_line = /\n/g;
capitalize = function(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

linebreak = function(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
