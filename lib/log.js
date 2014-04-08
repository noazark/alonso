var bunyan = require('bunyan')

var log = module.exports = bunyan.createLogger({
	name: 'alonso',
	level: process.env.LOG_LEVEL || 'info'
})
