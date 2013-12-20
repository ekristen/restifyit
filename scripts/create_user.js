var config = require('config');
var crypto = require('crypto');
var pem = require('pem');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(config.database)

db.serialize(function() {
	pem.createPrivateKey(2048, function(err, private_key) {
		if (err) throw new Error(err);

		pem.getPublicKey(private_key.key, function(err, public_key) {
			var shasum = crypto.createHash('sha1');
			shasum.update(public_key.publicKey);
			var keyId = shasum.digest('hex');

			var stmt = db.prepare("INSERT INTO keys (keyId, publicKey) VALUES (?, ?)");
			stmt.run(keyId, public_key.publicKey);
			stmt.finalize();

			console.log('Here is the information you will need to make API calls');
			console.log('keyId: ' + keyId);
			console.log('privateKey: ');
			console.log(private_key.key);

			db.close();
		});
	});
})