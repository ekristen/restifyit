module.exports = {
	api: {
		name: 'restify-framework',
		version: '1.0.0',
		port: process.env.PORT || 3000,
		allowed_ips: ['127.0.0.1'],
		log_level: 'debug'
	},
	ssl: {
		key: null,
		cert: null,
		passphrase: null,
	},
	database: 'data/database.db'
}
