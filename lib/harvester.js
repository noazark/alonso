var Hook = require('hook.io').Hook
  , util = require('util')

var Harvester = exports.Harvester = function(options) {
  var self = this;
  Hook.call(this, options);

  self.on('hook::ready', function () {
    
  });
}

util.inherits(Harvester, Hook);
