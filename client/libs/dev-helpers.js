// F12 and F5 for electron
document.addEventListener("keydown", function (e) {
  if (e.which === 123) {
    require('remote').getCurrentWindow().toggleDevTools();
  } else if (e.which === 116) {
    location.reload();
  }
});
