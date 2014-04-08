// Catches exit signals and executes one last function before releasing the
// process.
//
// Example:
//
// exitPrompt(function exit() {
//   //... could do some cleanup here
//   console.log('I\'m exiting now')
// })
//
var exitPrompt = module.exports = function (handler) {
	var wrappedHandler = function (err) {
		handler.apply(this, arguments)
		process.exit(!!err)
	}

	//catches ctrl+c event
	process.on('SIGINT', wrappedHandler);

	//catches uncaught exceptions
	process.on('uncaughtException', wrappedHandler);
}
