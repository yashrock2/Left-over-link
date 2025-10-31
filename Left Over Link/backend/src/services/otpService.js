import twilio from 'twilio';

const {
  MOCK_OTP,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_VERIFY_SERVICE_SID,
} = process.env;

const twilioClient =
  !MOCK_OTP && TWILIO_ACCOUNT_SID
    ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;

// Simple in-memory store for mock OTPs
const mockOtpStore = new Map();

export const otpService = {
  /**
   * Sends an OTP to a given phone number.
   * @param {string} phone - The phone number in E.164 format (e.g., +15551234567)
   */
  async sendOtp(phone) {
    if (MOCK_OTP === 'true' || !twilioClient) {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      mockOtpStore.set(phone, mockCode);
      console.log(`==== MOCK OTP for ${phone}: ${mockCode} ====`);
      return { success: true, message: 'Mock OTP sent (check console).' };
    }

    try {
      await twilioClient.verify.v2
        .services(TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: phone, channel: 'sms' });
      return { success: true, message: 'OTP sent via Twilio.' };
    } catch (error) {
      console.error('Twilio Error:', error);
      return { success: false, message: 'Failed to send OTP.' };
    }
  },

  /**
   * Verifies an OTP code for a given phone number.
   * @param {string} phone - The phone number in E.164 format.
   * @param {string} code - The 6-digit OTP code.
   */
  async verifyOtp(phone, code) {
    if (MOCK_OTP === 'true' || !twilioClient) {
      const storedCode = mockOtpStore.get(phone);
      if (storedCode === code) {
        mockOtpStore.delete(phone);
        return { success: true, message: 'Mock OTP verified.' };
      }
      return { success: false, message: 'Invalid mock OTP.' };
    }

    try {
      const verificationCheck = await twilioClient.verify.v2
        .services(TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: phone, code: code });

      if (verificationCheck.status === 'approved') {
        return { success: true, message: 'OTP verified.' };
      }
      return { success: false, message: 'Invalid OTP code.' };
    } catch (error) {
      console.error('Twilio Verify Error:', error);
      return { success: false, message: 'Failed to verify OTP.' };
    }
  },
};