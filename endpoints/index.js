// A little bit of magic to autoload the the various files
// in the endpoint directory, only caveat is that each file
// has to be uniquely named, lowercase, no spaces, preferably
// alpha characters only.

var path = require('path');
var fs = require('fs');

var files = fs.readdirSync('endpoints');
var modules = {};

for (var i = 0; i < files.length; i++ ) {
	var extname  = path.extname(files[i]);
	var basename = path.basename(files[i], '.js');

	if (extname == '.js' && basename != 'index' && modules[files[i]] !== true) {
		module.exports[basename] = require('./' + files[i]);
		modules[files[i]] = true;
	}
}
