var Hook = require('hook.io').Hook
  , util = require('util')

var Counter = exports.Counter = function(options) {
  var self = this;
  Hook.call(this, options);

  self.on('hook::ready', function () {
    self.on('harvester::message::saved', self._incr);
    self.on('*::harvester::message::saved', self._incr);
  });
}

util.inherits(Counter, Hook);

Counter.prototype._incr = function(data, callback, sender) {
  var date = new Date(data.date)
    , year = date.getFullYear()
    , month = date.getMonth() + 1
    , day = date.getDate()
    , hour = date.getHours()
    , minute = date.getMinutes()
    , key = [data.hostname, data.id, year, month, day, hour, minute].join(':')

  // increment redis key
};
