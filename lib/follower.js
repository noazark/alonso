var Hook = require('hook.io').Hook
  , util = require('util')

var Follower = exports.Follower = function(options) {
  var self = this;
  Hook.call(this, options);

  self.on('hook::ready', function () {
    self._watch(self.path);
  });
}

util.inherits(Follower, Hook);

Follower.prototype.path = null;
Follower.prototype.tail = null;

Follower.prototype._watch = function(path) {
  var self = this;
  self.tail = spawn("tail", ["--follow=name", "--lines=0", self.path]);

  self.tail.stdout.on("data", function(data) {
    self._send(data.toString('utf8'));
  });

  self.emit("follower::file::started", {
    "path": self.path,
    "pid": self.tail.pid
  });
};

Follower.prototype._send = function(message) {
  var self = this;

  self.emit("follower::message::recieved", {
    "path": self.path,
    "message": message,
    "date": new Date().getTime()
  });
};
