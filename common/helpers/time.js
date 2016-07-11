isThisTime = function(h, period) {
  // morning evening night
  var ranges = [{min:6,max:11}, {min:11,max:20}, {min:20,max:6}];
  ranges.forEach(function(p,k){
    if (h >= p.min && h < p.max) { r = k; }
  });
  return (typeof period !== 'undefined') ? r === period : r;
};

// morning evening night
timeRanges = [[5,7,8,9,10,11], [11,12,1,2,3,4,5,6,7,8], [8,9,10,11,12,1,2,3,4,5]];
isThisTime = function(h, p) {
  return timeRanges[p].indexOf(Number(h));
};
