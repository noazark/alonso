var async = require('async')
var elasticsearch = require('elasticsearch')
var os = require('os')

module.exports = (function () {
	function ship(config) {
		this.lines = []
		this.client = new elasticsearch.Client(config)
		this.host = os.hostname()

		this._beginLoop()
	}

	ship.prototype.add = function (line) {
		this.lines.unshift(line)
	}

	ship.prototype._beginLoop = function () {
		async.forever(function (callback) {
			if (this.lines.length > 0) {
				console.log('found', this.lines.length);
				var transaction = []

				this.lines.forEach(function (line) {
					var record = {}

					if (typeof line == "string") {
						record.message = line
					} else {
						record = line
					}

					record.host = this.host

					// convert timestamp to @timestamp
					record["@timestamp"] = record.timestamp
					delete record["timestamp"]

					transaction.push({
						create: {
							_index: 'alonso-logs',
							_type: 'logs',
						}
					})

					transaction.push(record)
				}.bind(this))


				// empty the lines array, let it fill up again
				this.lines.length = 0

				this.client.bulk({body:transaction}, callback)
			} else {
				setTimeout(callback, 500)
			}
		}.bind(this), function (err) {
			throw err
		})
	}

	return ship
})()
