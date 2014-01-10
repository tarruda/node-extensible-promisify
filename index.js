/*jshint evil: true */
var Promise = require('bluebird');


function hasPromisifyMarker(method) { return method.promisify; }


module.exports = function(predicate) {
  var rv = {};

  if (!predicate) predicate = hasPromisifyMarker;

  for (var i = 0, l = this.methods.length; i < l; i++) {
    var method = this.methods[i];
    if (!predicate(method)) continue;
    var fargs = method.args.slice();
    var nargs = method.args.slice();
    fargs.push('next'); // append the 'next' argument to the method
    nargs.pop();        // remove the 'cb' argument as we will replace it
    var c = nargs.length && ',' || ''; // comma between callback and args
    
    // construct a function that will wrap the call into a bluebird promise
    rv[method.name] =
      new Function(fargs.join(','),
        '\n  var resolver = this.BluebirdPromise.defer();' +
        '\n  next(' + nargs.join(',') + c + 'function(err, rv) {' +
        '\n    if (err) return resolver.reject(err);' +
        '\n    resolver.resolve(rv);' +
        '\n  });' +
        '\n  return resolver.promise;');
  }

  this.BluebirdPromise = Promise;

  return rv;
};
