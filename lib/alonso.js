var hookio = require('hook.io')
  , path   = require('path');

var alonso = hookio.createHook({ 
  'name': 'alonso',
  'debug': true
});

alonso.on('hook::ready', function() {

  // TODO: Hook.io issue https://github.com/hookio/hook.io/issues/191 prevents
  // spawing from the module name. Will fix once bug is resolved.
  alonso.spawn([
    {
      src: 'alonso-harvester',
      name: 'harvester',
      autoheal: true
    },
    {
      src: 'alonso-counter',
      name: 'counter',
      autoheal: true
    }
  ]);

  // spawn follower hooks for each individual file to watch
  alonso.alonso.paths.forEach(function(file) {
    alonso.spawn({
      src: 'alonso-follower',
      name: 'follower',
      path: file,
      autoheal: true
    })
  })
});

alonso.on('spawn::error', function(err) {
  console.log(err);
});

alonso.listen();