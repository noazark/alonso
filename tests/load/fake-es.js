var http = require('http')
var count = 0

http.createServer(function (req, res) {
	req.setEncoding("utf8")
	req.content = ''
	res.writeHead(200, {'Content-Type': 'text/plain'})

	if (req.url === '/_stats') {
		res.end('' + count)
	} else if (req.url === '/_flush') {
		count = 0
		res.end('' + count)
	} else {
		var body = []

		req.addListener("data", function(chunk) {
			body.push(chunk)
		});

		req.addListener("end", function() {
			var lines = body.join().split(/[\n\r]+/g)
			console.log(lines);
			count += lines.length - 1
			res.end()
		});
	}
}).listen(3000)

console.log('Server running at http://localhost:3000/')
