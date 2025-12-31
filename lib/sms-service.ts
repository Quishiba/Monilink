export interface SMSVerificationResponse {
  success: boolean;
  message?: string;
  verificationId?: string;
}

const TWILIO_ACCOUNT_SID = process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SERVICE_SID = process.env.EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID;

function getAuthHeader(): string {
  const credentials = `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`;
  return `Basic ${btoa(credentials)}`;
}

export async function sendVerificationCode(phoneNumber: string): Promise<SMSVerificationResponse> {
  try {
    console.log('Sending verification code to:', phoneNumber);
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('Twilio credentials not configured');
      return {
        success: false,
        message: 'SMS service not configured'
      };
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `To=${encodeURIComponent(formattedPhone)}&Channel=sms`,
      }
    );

    const data = await response.json();
    
    if (response.ok && data.status === 'pending') {
      console.log('Verification code sent successfully:', data.sid);
      return {
        success: true,
        message: 'Verification code sent',
        verificationId: data.sid
      };
    }
    
    console.error('Twilio API error:', data);
    return {
      success: false,
      message: data.message || 'Failed to send code'
    };
  } catch (error) {
    console.error('Failed to send verification code:', error);
    return {
      success: false,
      message: 'Failed to send code'
    };
  }
}

export async function verifyCode(phoneNumber: string, code: string): Promise<boolean> {
  try {
    console.log('Verifying code:', code, 'for phone:', phoneNumber);
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('Twilio credentials not configured');
      return false;
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `To=${encodeURIComponent(formattedPhone)}&Code=${encodeURIComponent(code)}`,
      }
    );

    const data = await response.json();
    
    if (response.ok && data.status === 'approved') {
      console.log('Verification successful');
      return true;
    }
    
    console.error('Verification failed:', data);
    return false;
  } catch (error) {
    console.error('Failed to verify code:', error);
    return false;
  }
}
