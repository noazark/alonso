var async = require('async')
var EventEmitter = require('events').EventEmitter
var fs = require('fs')
var inherits = require('util').inherits
var path = require('path')

var watch = module.exports = (function () {
	function watch(file, frequency) {
		if (frequency == null) {
			frequency = 50
		}

		this.file = path.resolve(file)
		this.frequency = frequency
		this.isWatching = false
		this.lastOffset = undefined
		this.offset=0

		this._beginWatchLoop()
		this._beginIngestLoop()
	}

	inherits(watch, EventEmitter)

	watch.prototype.parse = function (line) {
		if (line.length > 0) {
			var dat = {}

			if (line[0] === '{') {
				dat = JSON.parse(line)
			} else {
				dat = {message: '' + line}
			}

			if (!dat.hasOwnProperty('timestamp')) {
				dat.timestamp = (new Date()).toISOString()
			}

			dat.source = this.file

			return dat
		}
	}

	watch.prototype._beginWatchLoop = function () {
		async.forever(function (callback) {
			var watcher

			fs.stat(this.file, function (err, stats) {
				if (err && err.code === 'ENOENT') {
					this.isWatching = false
					this.lastOffset = 0
					return setTimeout(callback, this.frequency)
				} else if (err) {
					return callback(err)
				}

				if (this.lastOffset == null) this.lastOffset = stats.size

				if (stats.isFile()) {
					watcher = fs.watch(this.file)

					watcher.on('change', function (event) {
						if (event !== 'rename') {
							this.isWatching = true
							this._updateOffset()
						} else {
							this.lastOffset = 0
							this.isWatching = false
							setTimeout(callback, this.frequency)
						}
					}.bind(this))

					watcher.on('error', function (err) {
						if (err && err.code === 'ENOENT') {
							this.isWatching = false
							this.lastOffset = 0
							return setTimeout(callback, this.frequency)
						} else {
							callback(err)
						}
					})
				}
			}.bind(this))
		}.bind(this), this._handleError)
	}

	watch.prototype._beginIngestLoop = function () {
		async.forever(function (callback) {
			if (this.isWatching && this.offset > this.lastOffset) {
				this._ingest(this.file, this.lastOffset, this.offset, callback)
				this.lastOffset = this.offset
			} else {
				setTimeout(callback, this.frequency)
			}
		}.bind(this), this._handleError)
	}

	watch.prototype._ingest = function (file, begin, end, callback) {
		fs.open(file, 'r', function (err, fd) {
			if (err && err.code === 'ENOENT') {
				return callback()
			} else if (err) {
				return callback(err)
			}

			var offset = begin
			var length = end - begin
			var buffer = new Buffer(length)

			fs.read(fd, buffer, 0, length, offset, function (err, bytes, buff) {
				if (err) return callback(err)

				var lines = buff.toString()
					.split(/\n+/g)
					.map(this.parse.bind(this))
					.filter(function (line) {if (line) return true})

				lines.forEach(this.emit.bind(this, 'data'))

				callback(err)
				fs.close(fd)
			}.bind(this))
		}.bind(this))
	}

	watch.prototype._handleError = function (err) {
		console.trace();
		this.emit('error', err)
	}.bind(watch.prototype)

	watch.prototype._updateOffset = function (callback) {
		fs.stat(this.file, function (err, stats) {
			if (err && err.code === 'ENOENT') {
				return
			} else if (err) {
				throw err
			}

			this.offset = stats.size
		}.bind(this))
	}

	return watch
})()
