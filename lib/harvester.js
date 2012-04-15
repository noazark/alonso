var Hook = require('hook.io').Hook
  , util = require('util')

var Harvester = exports.Harvester = function(options) {
  var self = this;
  Hook.call(this, options);

  self.on('hook::ready', function () {
    self.on('follower::message::recieved', self._store);
    self.on('*::follower::message::recieved', self._store);
  });
}

util.inherits(Harvester, Hook);

Harvester.prototype._store = function(data, callback, sender) {
  // find or insert message
};
