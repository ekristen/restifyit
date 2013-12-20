# Overview

The purpose of this API framework is to provide a rapid development capability for API based services. It is a RESTful API service, with built in HTTPS capability, API versioning, authentication using HTTP Signature.

This application is designed to run on any server that supports Node.JS but is also designed to be deployed into a CloudFoundry environment. In server.js you will see VCAP_SERVICES (that is CloudFoundry).


# Installation
1. git clone URL_TO_REPO
2. cd api-framework
3. cp config.js.defaults config.js
4. npm install
5. npm start (for development `npm test`)

# Quick Start
From the root directory, run `node scripts/init_database.js`, then `node scripts/create_user.js`, save the private key to key.pem to the root directory, and edit the scripts/test_api_call.js and put the keyId on line 30. The API service runs by HTTP as default for testing, easily switching to HTTPS. Then start up the server `node server.js`, then in another terminal, `node scripts/test_api_call.js`, you should see {"auth": "success"}, if not check the console output of the server.

# Dependencies
* Restify
* HTTP Signature (for auth)
* SQLite3 (for auth db)
* Crypto
* Winston (for logging)


# Built-In Framework API Endpoints

These are built-in endpoints that come with the framework.

## `/user POST` - Creates New User Account

* __Returns__ - (Object) Object contains user's email address, keyId, and privateKey
* __Caveats__ - The privateKey is not stored on the server, if they don't retrieve it, it will have to be regenerated

## `/user/:id GET` - Gets User Account

* __Returns__ - (Object) Object contains user's email address, keyId, and publicKey

## `/user/:id PUT` - Updates User Account

* __Returns__ - (Object) Object contains user's email address, keyId, and publicKey, and any fields that were updated (except password)

## `/user/:id DELETE` - Deletes User Account

* __Returns__ - (Object) Object contains user's email address

## `/test GET` - Test Connection (no authentication require)

* __Returns__ - (Object) If successful a message stating the connection was successful, otherwise an error.

## `/test/db GET` - Test Connection to Database (no authentication required)

* __Returns__ - (Object) If successful a message stating the connection was successful, otherwise an error.

# Built-In Middleware

## Auth Middleware
An Authentication middleware comes with the framework and is designed to work with the SQLite3 auth database and HTTP Signature to provide authentication for users and endpoints.

# Custom API Endpoints
_Place user defined API endpoint documentation here_


# Client Authentication
Client authentication is done by using HTTP Signature in the HTTP Headers using the HTTP Signature module.

Client authentication is done using PKI, using a Private and Public SSL (not SSH) key pair.

The public key/cert is associated with a unique keyId, while the private key is used by the client to authenticate connections to the API server.

There is no key management in this framework and keys are currently added manually to the source, retrieving them from a MongoDB is in the works.


# More Information
* Restify API Guide: http://mcavage.github.com/node-restify/
* HTTP Signature: https://github.com/joyent/node-http-signature/blob/master/http_signing.md
