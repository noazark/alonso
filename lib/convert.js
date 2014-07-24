var os = require('os')
var Transform = require('stream').Transform

module.exports = function (options) {
	if (options == null) {
		options = {}
	}

	var stream = new Transform({objectMode: true})

	stream._transform = function(data, encoding, callback) {
		if (typeof data == "string") {
			data = {message: data}
		}

		// always set the hostname
		data.hostname = os.hostname()

		// convert timestamp to @timestamp
		if (data.hasOwnProperty('timestamp')) {
			data["@timestamp"] = data.timestamp
			delete data.timestamp
		}

		// convert msg to message
		if (data.hasOwnProperty('msg')) {
			data.message = data.msg
			delete data.msg
		}

		this.push(data)
		callback()
	}

	return stream
}
