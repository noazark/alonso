var hookio = require('hook.io')
  , path   = require('path');

var alonso = hookio.createHook({ 
  'name': 'alonso',
  'debug': true
});

alonso.on('hook::ready', function() {
  alonso.spawn([
    {
      src: path.resolve('./lib/harvester.js'),
      name: 'harvester'
    },
    {
      src: path.resolve('./lib/counter.js'),
      name: 'counter'
    }
  ]);

  // spawn follower hooks for each individual file to watch
  alonso.alonso.paths.forEach(function(file) {
    alonso.spawn({
      src: path.resolve('./lib/follower.js'),
      name: 'follower',
      path: file
    })
  })
});

alonso.on('spawn::error', function(err) {
  console.log(err);
});

alonso.listen();