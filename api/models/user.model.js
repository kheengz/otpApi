'use strict';

var Validator = require('validatorjs');
var moment = require('moment-timezone');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utilHelper = require('../util');

var UserModel = new Schema({
  phoneOrEmail: {
    type: String,
    required: true,
  },
  otp: {
    code: {
      type: String,
      get: utilHelper.decrypt, set: utilHelper.encrypt
    },
    code_expiration: {
      type: Date,
    },
  },
  otpType: {
    type: String,
    enum: [utilHelper.PHONE_OTP, utilHelper.EMAIL_OTP],
    default: utilHelper.EMAIL_OTP,
  },
  created: {
    type: Date,
    default: moment()
  }
});

UserModel.pre('save', function(next) {
  var user = this;
  const validator = new Validator(
    {phoneOrEmail: user.phoneOrEmail},
    {phoneOrEmail: 'email' }
  );
  user.otpType = validator.passes() ? utilHelper.EMAIL_OTP : utilHelper.PHONE_OTP
  
  if (user.isNew) {
    user.otp = {
      code: utilHelper.generateOTCode(),
      code_expiration: moment().add(1, 'hours'),
    };  
  }
  
  next();
});

module.exports = mongoose.model('User', UserModel);
