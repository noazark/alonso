var Hook = require('hook.io').Hook
  , util = require('util')

var Indexer = exports.Indexer = function(options) {
  var self = this;
  Hook.call(this, options);

  self.on('hook::ready', function () {
    self.on('harvester::message::saved', self._incr);
    self.on('*::harvester::message::saved', self._incr);
  });
}

util.inherits(Indexer, Hook);

Indexer.prototype._index = function(data, callback, sender) {
  // index message here
};
