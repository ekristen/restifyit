# Overview
The purpose of this API framework is to provide a rapid development capability for API based services. It is a RESTful API service, with built in HTTPS capability, API versioning, authentication using HTTP Signature. Its also designed to be self-documenting, this functionality is not 100% there yet, but it is being worked on. 

# Installation
1. git clone URL_TO_REPO
2. cd restify
3. npm install
4. node server.js

# Quick Start
From the root directory, run `node scripts/init_database.js`, then `node scripts/create_user.js`, save the private key to key.pem to the root directory, and edit the scripts/test_api_call.js and put the keyId on line 30. The API service runs by HTTP as default for testing, easily switching to HTTPS. Then start up the server `node server.js`, then in another terminal, `node scripts/test_api_call.js`, you should see {"auth": "success"}, if not check the console output of the server.

# Dependencies
* Restify
* HTTP Signature (for auth)
* SQLite3 (for auth db)
* Crypto
* Winston (for logging)

# Endpoints
Look at endpoints/default.js for examples. Endpoints are loaded automatically when placed in the endpoints directory properly. 

There is an Endpoint function that should be used when defining endpoints, its purpose is to validation checking on the Endpoint configuration, this is still a work in progress.

See: lib/endpoint.js, endpoints/default.js

# Built-In Framework API Endpoints

WIP

# Built-In Middleware

* Auth Middleware using HTTP Signature

## Auth Middleware
An Authentication middleware comes with the framework and is designed to work with the SQLite3 auth database and HTTP Signature to provide authentication for users and endpoints.


# Client Authentication
Client authentication is done by using HTTP Signature in the HTTP Headers using the HTTP Signature module.

Client authentication is done using PKI, using a Private and Public SSL (not SSH) key pair.

The public key/cert is associated with a unique keyId, while the private key is used by the client to authenticate connections to the API server.

There is no key management in this framework and keys are currently added manually to the source, retrieving them from a MongoDB is in the works.


# More Information
* Restify API Guide: http://mcavage.github.com/node-restify/
* HTTP Signature: https://github.com/joyent/node-http-signature/blob/master/http_signing.md
