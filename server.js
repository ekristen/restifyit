var config = require('config');
var restify = require('restify');
var winston = require('winston');

// Load Endpoints
var endpoints = require('./endpoints');

// Load Custom Middleware
var middleware = require('./middleware');

// Create the RESTful Server
var server = restify.createServer({
	name: config.api.name || 'restifyit',
	version: config.api.version || '1.0.0',
	key: config.ssl.key || null,
	cert: config.ssl.cert || null,
	passphrase: config.ssl.passphrase || null
});

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({colorize: true, timestamp: true, level: config.api.log_level || 'info'}),
	],
	colors: {
		silly: 'magenta',
		verbose: 'cyan',
		info: 'green',
		data: 'grey',
		warn: 'yellow',
		debug: 'blue',
		error: 'red'
	}
});


// If SSL is required, force redirect to root.
server.use(function (req, res, next) {
	if (typeof(req.connection.encrypted) == 'undefined') {
		if (typeof(req.headers['x-forwarded-proto']) != 'undefined' && req.headers['x-forwarded-proto'].indexOf('https') == -1) {
			if (typeof(config.api.enforce_ssl) != 'undefined' && config.api.enforce_ssl == true) {
				console.log('Redirecting to HTTPS ...');
				res.redirect('https://' + req.headers['host']);
			}
		}
	}
	
	return next();
});

server.use(function (req, res, next) {
	var found = false;

	// Loop through allowed ips if a match is not found, throw permission denied.
	for (var i=0; i<config.api.allowed_ips.length; i++) {
		var ip = config.api.allowed_ips[i];

		// Look through the x-forward-for header to get the original IP
		if (typeof(req.headers['x-forwarded-for']) != 'undefined') {
			if (req.headers['x-forwarded-for'].indexOf(ip) !== -1) {
				found = true;
			}
		}

		// Look at the last connection remote address
		if (typeof(req.connection.remoteAddress) != 'undefined') {
			if (req.connection.remoteAddress == ip) {
				found = true;
			}
		}
	}

	// If not found throw 503 error, otherwise just continue on.
	if (found == false) {
		res.send(503, {error: 503, message: 'permission denied'});
	}

	return next();
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.conditionalRequest());

// Log all requests here (this includes latency)
server.on('after', function(req, res, route, error) {
	var latency = res.get('Response-Time');
	if (typeof (latency) !== 'number')
		latency = Date.now() - req._time;

	logger.log('info', 'REQUEST -', {method: req.method, url: req.url, code: res.statusCode, latency: latency, remote: req.connection.remoteAddress});
	logger.log('debug', 'REQUEST HEADERS - ', req.headers);
});

// Catch all unhandled errors so the server does not crash.
server.on('uncaughtException', function(req, res, route, error) {
	logger.log('error', 'Uncaught Exception:', error);
	res.send({"error": "InternalError", "message": "Well this is embarrassing, something happened that we were not expecting. Please try again."});
});

var auth_exemptions = Array();

Object.keys(endpoints).forEach(function (c) {
	var ends = endpoints[c].endpoints;
	for (var i = 0; i < ends.length; i++) {
		var endpoint = ends[i];

		if (endpoint.auth == false) {
			auth_exemptions.push(endpoint.path);
		}
	}
});

// Authenticate all requests
server.use(middleware.auth({exemptions: auth_exemptions}));

// Load all of the endpoints
Object.keys(endpoints).forEach(function (c) {
	var ends = endpoints[c].endpoints;
	for (var i = 0; i < ends.length; i++) {
		var endpoint = ends[i];

		if (endpoint.method == 'GET' && typeof(endpoint.fn) != 'Function') {
			server.get({path: endpoint.path, version: endpoint.version}, endpoint.fn);
		}

		if (endpoint.method == 'POST' && typeof(endpoint.fn) != 'Function') {
			server.post({path: endpoint.path, version: endpoint.version}, endpoint.fn);
		}

		if (endpoint.method == 'PUT' && typeof(endpoint.fn) != 'Function') {
			server.put({path: endpoint.path, version: endpoint.version}, endpoint.fn);
		}

		if (endpoint.method == 'DEL' && typeof(endpoint.fn) != 'Function') {
			server.del({path: endpoint.path, version: endpoint.version}, endpoint.fn);
		}
	}
});

// Start Listening for calls
server.listen(config.api.port, function() {
	console.log('%s server is listening at %s', server.name, server.url);
});
