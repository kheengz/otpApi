'use strict';

module.exports = function(app) {
  var user = require('./controllers/user.controller');

  // OTP Routes
  app.route('/generate')
    .post(user.generateOtp);


  app.route('/verify')
    .post(user.verifyOtp);
};
