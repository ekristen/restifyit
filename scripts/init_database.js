var config = require('config');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(config.database)

db.serialize(function() {
	db.run("CREATE TABLE keys (keyId VARCHAR, publicKey TEXT)");
});

db.close();