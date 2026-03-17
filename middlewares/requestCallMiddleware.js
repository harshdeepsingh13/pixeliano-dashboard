const mongoose = require('mongoose');
const APIRequest = mongoose.model('APIRequest', require('../schemas/APIRequest.schema'));
const {logger} = require('../config/config');

const saveNewRequest = (requestInfo) => {
	const newRequest = new APIRequest({...requestInfo});
	return newRequest.save();
};

module.exports = async (req, res, next) => {
	if (
		req.method === 'OPTIONS' ||
		req.path === '/favicon.ico' ||
		req.path === '/manifest.json' ||
		req.path === '/robots.txt' ||
		req.path.startsWith('/static/')
	) {
		return next();
	}

	try {
		const {method, url} = req;
		const {requestId} = await saveNewRequest({method, route: url});
		req.request = {callId: requestId};
		next();
	} catch (e) {
		logger.warn(`[requestCallMiddleware.js] Request log skipped: ${e.message}`);
		req.request = {};
		next();
	}
};
