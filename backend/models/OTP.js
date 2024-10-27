const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const {otpTemplate} = require('../template/otpTemplate');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpiry: { type: Date, required: true, default: () => Date.now() + 10 * 60 * 1000 },
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(otpTemplate(otp), email, otp);
        console.log("email = ", email, "otp = ", otp);
        return mailResponse;
    } catch (error) {
        console.log("This error occurred in OTP Model ", error);
    }
}

otpSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

module.exports = OTP;

