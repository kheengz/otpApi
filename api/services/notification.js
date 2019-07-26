var sgMail = require('@sendgrid/mail');
var Validator = require('validatorjs');
var axios = require('axios');

exports.sendMail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
    
  try {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const rules = {
      recipients: 'required',
      templateId: 'required',
    };

    const validator = new Validator(options, rules);
    if (validator.fails()) {
      throw new Error('Email options validation error');
    }

    const message = {
      to: options.recipients,
      from: options.from || 'no-reply@jupiter.com',
      subject: options.subject || 'OTP Generated',
      templateId: options.templateId,
    };

    if (options.substitutions) {
      message.dynamic_template_data = Object.assign({}, options.substitutions, { appName: 'OTP API' });
    }
    
    return await sgMail.send(message);

  } catch (e) {
    console.log('email error : ', e);
  }
}

exports.sendSms = async (options) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const rules = {
      phoneNumber: 'required',
      messageBody: 'required',
    };

    const validator = new Validator(options, rules);
    if (validator.fails()) {
      throw new Error('Sms options validation error');
    }

    var messageBody = JSON.stringify(options.messageBody);
    var params = `CellNumber=${options.phoneNumber}&AccountKey=${process.env.SMS_ACCOUNT_KEY}&MessageBody=${messageBody}`
    var url = `http://smsgateway.ca/SendSMS.aspx?${params}`

    axios.get(url)
    .then(data => console.log(data.status))
    .catch(err => console.log(err.message));

  } catch (e) {
    console.log('sms error : ', e);
  }
}
