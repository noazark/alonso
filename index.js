var forever = require('forever-monitor')
var path = require('path')

var elasticsearchHosts = process.env.ELASTICSEARCH_HOSTS.split(',')
var logs = process.env.LOGS.split(',')
var scriptPath = path.join(__dirname, './bin/alonso')

logs.forEach(function (log) {
	var child = forever.start([scriptPath, log], {env: process.env})
})
