var config = require('config');
var restify = require('restify');

var Endpoint = require('../lib/endpoint.js');

exports = module.exports = {
	endpoints: [
		new Endpoint({
			name: 'Root Endpoint',
			description: 'Provide default endpoint for the API service.',
			path: '/',
			method: 'GET',
			fn: function (req, res, next) {
				res.send({'status': 'ok'});
				return next();
			}
		}),
		new Endpoint({
			name: 'Test Endpoint',
			description: 'Test Endpoint',
			path: '/test',
			method: ['GET', 'POST'],
			fn: function (req, res, next) {
				res.send({'name': 'testing'});
				return next();
			}
		}),
		new Endpoint({
			name: 'Auth Testing Endpoint',
			description: 'Auth Testing Endpoint',
			path: '/auth',
			auth: true,
			method: 'GET',
			fn: function (req, res, next) {
				res.send({'auth': 'success'});
				return next();
			}
		})
	]
}