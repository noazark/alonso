var assert = require('assert')
var fs = require('fs')
var path = require('path')


// Does not test Alonso!
// This is a simple test to ensure that fs events are sent and captured.
describe('Detecting FS Events', function () {
	var rand = (Math.random() * 99999).toFixed()
	var fileName = rand + '.tmp'
	var filePath = path.join(__dirname, '../tmp', fileName)

	before(function () {
		fs.writeFileSync(filePath, 'initialize')
	})

	after(function () {
		fs.unlinkSync(filePath)
	})

	context('when writing to an opened file', function () {
		it('a change event is emitted', function (done) {
			var watcher = fs.watch(filePath)

			watcher.once('change', function (event) {
				assert.equal(event, 'change', 'Expected a change event, instead got "' + event + '"')
				done()
			})

			setTimeout(function () {
				fs.appendFileSync(filePath, 'something happens!\n')
			}, 10)
		})
	})
})
