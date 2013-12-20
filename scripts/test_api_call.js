var fs = require('fs');
var http = require('http');
var httpSignature = require('http-signature');

var key = fs.readFileSync('key.pem', 'ascii');

var options = {
  host: 'localhost',
  port: 3000,
  path: '/auth',
  method: 'GET',
  headers: {}
};

var data = '';

// Adds a 'Date' header in, signs it, and adds the
// 'Authorization' header in.
var req = http.request(options, function(res) {
	res.on('data', function(chunk) {
		data = data + chunk;
	});
	res.on('end', function() {
		console.log(data);
	});
});

httpSignature.sign(req, {
  key: key,
  keyId: 'REPLACE_WITH_KEY_ID'
});

req.end();
