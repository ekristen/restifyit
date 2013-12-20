var config = require('config');
var restify = require('restify');
var httpSignature = require('http-signature');
var winston = require('winston');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(config.database)

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({colorize: true, timestamp: true})
	],
});


function authenticateUser(options) {
	function authUser(req, res, next) {
		// Do not require authentication on root

		if (req.url == '/') return next();
		if (typeof(options.exemptions) != 'undefined') {
			for (var i=0; i<options.exemptions.length; i++) {
				if (options.exemptions[i] == req.url) {
					logger.warn("authentication exemption for " + req.url + " from IP: " + req.connection.remoteAddress);
					req.user = 'anonymous';
					return next();
				}
			}
		}

		// Figure out if there are any other exceptions to not authenticate
		for (var i in config.api.auth_exceptions) {
			if (req.url == config.api.auth_exceptions[i]) {
				logger.warn("authentication exemption for " + req.url + " from IP: " + req.connection.remoteAddress);
				req.user = 'anonymous';
				return next();
			}
		}

//		(function(req, res, next) {
			db.run("SELECT public_key FROM users WHERE username = '" + req.username + "'", function(err, results) {
				if (err) {
					logger.log('error', 'MySQL Error:', err);
					return next(err);
				}

				if (results.length > 0) {
					result = results[0];
					if (httpSignature.verifySignature(req.authorization.signature, result.public_key)) {
						logger.log('info', 'Sucessfully authenticated user');
						req.user = req.username;
						return next();
					}
					else {
						return next(new restify.NotAuthorizedError('Unable to validate signature'));
					}
				}
				else {
					return next(new restify.NotAuthorizedError('Unable to authenticate the user'));
				}
			});
//		})(req, res, next);
	}

	return (authUser);
}

exports = module.exports = authenticateUser;