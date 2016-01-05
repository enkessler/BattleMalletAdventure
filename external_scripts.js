// Courtesy of 	http://creativenotice.com/2013/07/regular-expression-in-array-indexof/

if (typeof Array.prototype.regXIndexOf === 'undefined') {
  Array.prototype.regXIndexOf = function (rx) {
    for (var i in this) {
      if (this[i].toString().match(rx)) {
        return i;
      }
    }
    return -1;
  };
}
