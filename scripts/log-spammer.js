var fs = require('fs')
var path = require('path')

var filePath = path.join(__dirname, '../tmp/demo.log')
var logStream = fs.createWriteStream(filePath, {flags: 'a'})
var times = process.env.TIMES || 10
var version = process.env.VERSION || 1

writeLoop(logStream, 'I am Ironman', times)

function writeLoop(writer, data, times, encoding, callback) {
	var timestamp = (new Date()).toISOString()

	write();
	function write() {
		var ok = true;
		do {
			times -= 1;
			if (times === 0) {
				writer.write('{"v": ' + version + ', "say":"' + data + '","timestamp":"' + timestamp + '"}\n', encoding, callback);
			} else {
				ok = writer.write('{"v": ' + version + ', "say":"' + data + '","timestamp":"' + timestamp + '"}\n', encoding);
			}
		} while (times > 0 && ok);

		if (times > 0) {
			writer.once('drain', write);
		}
	}
}
