var _ = require('lodash')
var async = require('async')
var elasticsearch = require('elasticsearch')
var Writable = require('stream').Writable

module.exports = function (options) {
	if (options == null) {
		options = {}
	}

	_.defaults(options, {
		elasticsearch: {},
		retries: 5,
	})

	var client = new elasticsearch.Client(options.elasticsearch)
	var stream = new Writable({objectMode: true})

	stream._write = function(data, encoding, callback) {
		async.retry(options.retries, client.bulk.bind(client, {body: data}), function (err) {
			callback(err)
		})
	}

	return stream
}
