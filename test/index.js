var assert = require('assert');
var extensible = require('extensible');
var promisify = require('../index');

require('setimmediate');

var obj = extensible();
obj.method('m1', 'cb', {promisify: true});
obj.method('m2', 'a1, cb', {promisify: true});
obj.method('m3', 'a1, a2, cb', {promisify: true});
obj.method('m4', 'a1, a2, a3, cb', {promisify: true});
obj.method('m5', 'a1, a2, a3, cb');
obj.method('m6', 'a1, a2, a3, cb', {promisify: true});
obj.layer({
  m1: function(cb) {
    setImmediate(function() {
      cb(null, '0');
    });
  },


  m2: function(a1, cb) {
    setImmediate(function() {
      cb(null, a1 + ', 0');
    });
  },


  m3: function(a1, a2, cb) {
    setImmediate(function() {
      cb(null, [a1, a2].join(', ') + ', 0');
    });
  },


  m4: function(a1, a2, a3, cb) {
    setImmediate(function() {
      cb(null, [a1, a2, a3].join(', ') + ', 0');
    });
  },


  m5: function(a1, a2, a3, cb) {
    setImmediate(function() {
      cb(null, [a1, a2, a3].join(', ') + ', 0');
    });
  },


  m6: function(a1, a2, a3, cb) {
    setImmediate(function() {
      cb(null, a1, a2, a3);
    });
  },
});
obj.layer(promisify);


describe('promisify', function() {
  describe('m1', function() {
    it('should return promise', function(done) {
      obj.m1().then(function(r) {
        assert.equal('0', r);
        done();
      });
    });
  });


  describe('m2', function() {
    it('should return promise', function(done) {
      obj.m2(1).then(function(r) {
        assert.equal('1, 0', r);
        done();
      });
    });
  });


  describe('m3', function() {
    it('should return promise', function(done) {
      obj.m3(1, 2).then(function(r) {
        assert.equal('1, 2, 0', r);
        done();
      });
    });
  });


  describe('m4', function() {
    it('should return promise', function(done) {
      obj.m4(1, 2, 3).then(function(r) {
        assert.equal('1, 2, 3, 0', r);
        done();
      });
    });
  });


  describe('m5', function() {
    it('should not be affected since it was not marked', function(done) {
      obj.m5(1, 2, 3, function(err, r) {
        assert.equal('1, 2, 3, 0', r);
        done();
      });
    });
  });
});
