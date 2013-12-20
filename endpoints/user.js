var config = require('config');
var restify = require('restify');
var crypto = require('crypto');

var Endpoint = require('../lib/endpoint');

exports = module.exports = {
	endpoints: [
		new Endpoint({
			name: 'getUser',
			description: 'Get user data from the database',
			path: '/user/:id',
			auth: true,
			version: '1.0.0',
			method: 'GET',
			params: [
				{ name: 'id', require: true, type: 'number', description: 'blah' }
			],
			fn: function (req, res, next) {
				if (!req.params.id) return next(new restify.MissingParametersError('id'));

			}
		}),
		new Endpoint({
			name: 'Create User',
			description: 'Creates a new user with public key for authentication',
			path: '/user',
			auth: true,
			version: '1.0.0',
			method: 'POST',
			fn: function (req, res, next) {
				if (!req.params.email) return next(new restify.MissingParameterError('email'));
				if (!req.params.password) return next(new restify.MissingParameterError('password'));


			}
		}),
		new Endpoint({
			name: 'Update User',
			description: 'Update users key',
			path: '/user/:id',
			auth: true,
			version: '1.0.0',
			method: 'PUT',
			fn: function (req, res, next) {
				if (!req.params.id) return next(new restify.MissingParameterError('id'));
				if (!req.params.action) return next(new restify.MissingParameterError('action'));

			}
		}),
		new Endpoint({
			name: 'Delete User',
			description: 'Deletes user from the databsae',
			path: '/user/:id',
			auth: true,
			version: '1.0.0',
			method: 'DEL',
			fn: function (req, res, next) {
				if (!req.params.id) return next(new restify.MissingParameterError('id'));

			}
		})
	]
}