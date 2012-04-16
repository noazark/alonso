#!/usr/bin/env node

var Counter = require('../lib/counter').Counter;

var counter = new Counter({
    name: "counter",
    debug: true
});

counter.start();