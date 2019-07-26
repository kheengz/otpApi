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


describe("/verify Verify user using phoneOrEmail and otp test cases: ", function(){
    this.afterAll(function (done) {
        mongoose.connection.dropCollection('users');
        done();
    });

    var user;
    var expiredUser;
    before(async function () {
        user = new User({ phoneOrEmail: '0123456789' });
        expiredUser = new User({ phoneOrEmail: '9876543210' });
        await user.save();
        await expiredUser.save();
    });

    it("should verify a user with otp using and phoneOrEmail", function(done){
        const {phoneOrEmail, otp: {code}} = user;
        request
            .post('/verify')
            .send({phoneOrEmail, otp: code})
            .then((res) => {
                res.status.should.equal(200);
                res.text.should.equal("VERIFIED");
                done();
            });
    });

    it("should not verify a user with wrong otp or phoneOrEmail", function(done){
        request
            .post('/verify')
            .send({phoneOrEmail: "00000000000", otp: '00000'})
            .then((res) => {
                res.status.should.equal(404);
                res.text.should.equal("INVALID");
                done();
            });
    });

    it("should not verify a user with expired otp", function(done){
        expiredUser.otp.code_expiration = moment().subtract(1, 'hours');
        expiredUser.save();
        const {phoneOrEmail, otp: {code}} = expiredUser;

        request
            .post('/verify')
            .send({phoneOrEmail, otp: code})
            .then((res) => {
                res.status.should.equal(412);
                res.text.should.equal("INVALID");
                done();
            });
    });

    it("should generate otp using phone number 1", function(done){
        request
            .post('/verify')
            .then((res) => {
                // console.log('res.body 2: ', res.text);
                res.status.should.equal(412);
                res.text.should.equal("PhoneOrEmail and OTP are required");
                done();
            });
    });
});
