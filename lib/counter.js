var Hook = require('hook.io').Hook
  , redis = require('redis')
  , util = require('util')
  , database;

var Counter = exports.Counter = function(options) {
  var self = this;
  Hook.call(this, options);

  database = redis.createClient();

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
    , keys = [data.hostname, data.id, year, month, day, hour, minute]
    , keyLength = keys.length;

  // increment redis key
  for(var i=0; i < keyLength; i++) {
    var key = keys.join(':');
    keys.pop();
    
    database.incr(key)
  }
};
