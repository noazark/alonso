#!/usr/bin/env node

var Harvester = require('../lib/harvester').Harvester;

var harvester = new Harvester({
    name: "harvester",
    debug: true
});

harvester.start();