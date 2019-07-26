'use strict';

var moment = require('moment-timezone');
var app = require("../server");
var request = require("supertest").agent(app.listen());
var mongoose = require('mongoose');
var should = require('should');
var User = mongoose.model('User');

describe("/generate Generation of OTP test cases: ", function(){
    this.afterAll(function (done) {
        mongoose.connection.dropCollection('users');
        done();
    });

    it("should generate otp using phone number", function(done) {
        request
            .post('/generate')
            .send({phoneOrEmail : "07011992233"})
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err, res){
                // console.log('res.body 1: ', res.text);
                res.status.should.equal(200);
                res.text.should.equal("SUCCESS");
                done();
            });
    });

    it("should generate otp email address", function(done) {
        request
        .post('/generate')
        .send({phoneOrEmail : "test@case.com"})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err, res){
            res.status.should.equal(200);
            res.text.should.equal("SUCCESS");
            done();
        });
    });

    it("should not generate fail when no phoneOrEmail is provided", function(done) {
        request
        .post('/generate')
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err, res){
            res.status.should.equal(412);
            res.text.should.equal("Phone or Email is required");
            done();
        });
    });
});

