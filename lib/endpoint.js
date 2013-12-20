var util = require('util');

var Endpoint = function (options) {

	if (!options.name) {
		throw new Error('Name is required field for endpoint')
		return {};
	}
	
	if (!options.description) {
		throw new Error('Description is a required field for an Endpoint')
		return {};
	}

	if (!options.method) {
		throw new Error('Method is a required field for an Endpoint')
		return {};
	}
	
	if (options.params && typeof(options.params) != 'object') { 
		throw new Error('Params must be an object')
		return {};
	}

	if (typeof(options.method) == 'string') {
		if (options.method != 'POST' && options.method != 'GET' && options.method != 'DEL' && options.method != 'PUT') {
			throw new Error("Method is most be GET, POST, PUT, DEL")
			return {};
		}
	}
	else if (typeof(options.method) == 'object') {
		for (var i = 0; i < options.method.length; i++) {
			
			if (options.method[i] != 'POST' && options.method[i] != 'GET' && options.method[i] != 'DEL' && options.method[i] != 'PUT') {
				throw new Error('Method can be a string or an array, only GET, POST, PUT, DEL are valid options')
			}
		}
	}

	if (typeof(options.fn) != 'function') {
		throw new Error('fn must be a valid function')
		return {};
	}

	return options;
}

module.exports = Endpoint;
