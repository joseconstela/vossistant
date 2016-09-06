var result = (err, result) => {
  if (err || typeof result !== 'object') {
    postMessage(null)
  } else {
    postMessage(result)
  }
}

onmessage = function (oEvent) {
  eval(oEvent.data.ac)
}
