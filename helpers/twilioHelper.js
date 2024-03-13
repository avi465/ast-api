require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const twilio = require('twilio')(accountSid, authToken);

// Send OTP to the user's phone number
async function sendOTP(phoneNumber) {
    try {
        await twilio.verify.v2.services(verifyServiceSid).verifications.create({
            to: phoneNumber,
            channel: 'sms',
        });

    } catch (error) {
        throw new Error('Failed to send OTP');
    }
}

// Verify OTP entered by the user
async function verifyOTP(phoneNumber, otp) {
    try {
        const verification = await client.verify.services(verifyServiceSid).verificationChecks.create({
            to: phoneNumber,
            code: otp,
        });

        return verification.status === 'approved';
    } catch (error) {
        throw new Error('Failed to verify OTP');
    }
}

module.exports = {
    sendOTP,
    verifyOTP,
};
