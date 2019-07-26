'use strict';

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var dotenv = require('dotenv');
dotenv.config();

var app = express();
var dbURL = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_URL : process.env.DB_URL;
var routes = require('./api/routes');
var User = require('./api/models/user.model');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found', method: req.method})
});

var port = process.env.PORT || (process.argv[2] || 3001);
port = (typeof parseInt(port) === "number") ? port : 3001;

mongoose.connect(dbURL, { useNewUrlParser: true })

if(!module.parent){
	app.listen(port);
}

console.log(`\n
			\tOTP RESTful API server listening on ${port}\n
			\tEnvironment => ${process.env.NODE_ENV}\n
			\tDate: ${new Date()}`);

module.exports = app;
