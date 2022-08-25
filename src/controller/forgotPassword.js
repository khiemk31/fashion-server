const { decodeOTP, encodeOTP, generateOTP, sendOTP } = require('../utils/otp');

const forgotPassword = async (req, res) => {
    res.render('forgot_password');
};

module.exports = {
    forgotPassword,
}