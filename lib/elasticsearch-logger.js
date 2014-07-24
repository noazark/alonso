var log = require('./log');

module.exports = function (config) {
	this.error = log.error.bind(log);
	this.warning = log.warn.bind(log);
	this.info = log.info.bind(log);
	this.debug = log.debug.bind(log);
	this.trace = function (method, requestUrl, body, responseBody, responseStatus) {
		log.trace({
			method: method,
			requestUrl: requestUrl,
			body: body,
			responseBody: responseBody,
			responseStatus: responseStatus
		});
	};
	this.close = function () {};
}
