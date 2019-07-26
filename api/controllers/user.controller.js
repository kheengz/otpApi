'use strict';

var moment = require('moment-timezone');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var utilHelper = require('../util');
var NotificationServices = require('../services/notification');

exports.generateOtp = function(req, res) {
  // ensure those parameters are provided
  if (!req.body.phoneOrEmail) {
    return res.status(412).send('Phone or Email is required');
  }

  var newUser = new User(req.body);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(403).send(err);
    }

    if (user.otpType === utilHelper.EMAIL_OTP) {
      // send mail
      NotificationServices.sendMail({
        templateId: process.env.SENDGRID_OTP_TEMPLATE,
        recipients: [user.phoneOrEmail],
        substitutions: {
          subject: 'OTP API - Code',
          otp_code: `${user.otp.code}`,
        },
      });

    } else if (user.otpType === utilHelper.PHONE_OTP) {
      // send sms
      NotificationServices.sendSms({
        phoneNumber: user.phoneOrEmail,
        messageBody: `Your OTP code is ${user.otp.code}, which is due to expire in the next hour @ ${user.otp.code_expiration}`,
      });
    }
    
    res.send("SUCCESS");
  });
};

exports.verifyOtp = async function(req, res) {
  // ensure those parameters are provided
  const {otp, phoneOrEmail} = req.body;
  if (!otp || !phoneOrEmail) {
    return res.status(412).send("PhoneOrEmail and OTP are required");
  }

  // attempt to find the record with phoneOrEmail and otp
  var user = await User.findOne({ phoneOrEmail, 'otp.code': otp });
  if (!user) {
    return res.status(404).send("INVALID");
  }

  // check if the code has expired
  const { otp: {code_expiration}} = user;
  if (moment().isAfter(code_expiration)) {
    return res.status(412).send("INVALID");
  }
  
  return res.send("VERIFIED");
};
