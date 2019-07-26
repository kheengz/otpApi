
var crypto = require('crypto');

exports.PHONE_OTP = 'phone';
exports.EMAIL_OTP = 'email';

/**
 * @param {Number} size Code length
 * @param {Boolean} alpha Check if it's alpha numeral
 * @return {String} The code
 */
exports.generateOTCode = (size = 6, alpha = false) => {
  let characters = alpha ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' : '0123456789';
  characters = characters.split('');
  let selections = '';
  for (let i = 0; i < size; i++) {
	let index = Math.floor(Math.random() * characters.length);
	selections += characters[index];
	characters.splice(index, 1);
  }

  return selections;
};


/**
 * Encrpts a text to generate a ciphertext 
 *  @param {String} string
 * @return {String} params date
 */
exports.encrypt = (string) => {
  if (string === null || typeof string === 'undefined') {
	return string;
  }
  let key = process.env.APP_SECRET_KEY;
  let cipher = crypto.createCipher('aes-256-cbc', key);

  return cipher.update(string, 'utf8', 'hex') + cipher.final('hex');
};

/**
 * Decrpts a ciphertext to generate a text
 *  @param {String} encrypted
 * @return {String} params date
 */
exports.decrypt = (encrypted) => {
  if (encrypted === null || typeof encrypted === 'undefined') {
	return encrypted;
  }
  let key = process.env.APP_SECRET_KEY;
  let decipher = crypto.createDecipher('aes-256-cbc', key);
  try {
	return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  } catch (e) {
	return encrypted;
  }
};

exports.response = (res, code, rest) => {
    return res.status(code).send({
        ...rest
    });
};