var _ = require('lodash')
var Transform = require('stream').Transform

// Pools documents in sets of `options.limit`
module.exports = function (options) {
	if (options == null) {
		options = {}
	}

	_.defaults(options, {
		limit: 200,
		debounce: 1000
	})

	var batch = []
	var batchCounter = 0
	var batchLimit = options.limit * 2 // batch limit is 2x because of the create command
	var timerId
	var stream = new Transform({objectMode: true})

	stream._transform = function(data, encoding, callback) {
		if (timerId) clearTimeout(timerId)

		// ElasticSearch bulk API action and metadata
		batch[batchCounter] = {
			create: {
				_index: 'alonso',
				_type: 'logs',
			}
		}
		batchCounter++

		batch[batchCounter] = data
		batchCounter++

		var send = function () {
			this.push(batch)

			// reset
			batch = []
			batchCounter = 0
		}.bind(this)

		if (batchCounter == batchLimit) {
			send()
		} else {
			timerId = setTimeout(send, options.debounce)
		}


		callback()
	}

	return stream
}
