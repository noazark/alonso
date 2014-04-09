var assert = require('assert')
var exec = require('child_process').exec
var fs = require('fs')
var path = require('path')
var watch = require('../lib/watch')

describe('Rotating watched files', function () {
	const rand = (Math.random() * 99999).toFixed()
	const logFilename = 'rotated-watch.' + rand + '.log'
	const logDir = path.join(__dirname, '../tmp')
	const logPath = path.join(logDir, logFilename)

	// start watching file a.log
	var watcher = new watch(logPath, 1)

	var test = function (callback) {
		const rand = (Math.random() * 99999).toFixed()

		// assert message was detected
		watcher.once('data', function (data) {
			assert.equal(data.message, 'hello world ' + rand)
			callback()
		})

		// write to file
		exec('echo "hello world ' + rand + '" >> ' + logPath, callback)
	}

	before(function (done) {
		try {
			fs.mkdirSync(logDir)
		} catch (e) {
			// directory is already created, or it will fail during append
		}

		test(done)
	})

	before(function (done) {
		// logrotate does not _necessarily_ create a new file once rotated
		// so we're not doing it here, we're just doing the renaming
		fs.rename(logPath, logPath + '.1', done)
	})

	after(function () {
		// indelicately handling cleanup of files
		try {
			fs.unlinkSync(logPath)
		} catch (e) {}

		try {
			fs.unlinkSync(logPath + '.1')
		} catch (e) {}
	})

	it('continues emit events for the original log file', function (done) {
		test(done)
	})
})

