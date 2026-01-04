export interface SMSVerificationResponse {
  success: boolean;
  message?: string;
  verificationId?: string;
}

const TWILIO_ACCOUNT_SID = process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SERVICE_SID = process.env.EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID;

function base64Encode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  
  for (let i = 0; i < str.length; i += 3) {
    const a = str.charCodeAt(i);
    const b = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
    const c = i + 2 < str.length ? str.charCodeAt(i + 2) : 0;
    
    const bitmap = (a << 16) | (b << 8) | c;
    
    output += chars[(bitmap >> 18) & 63];
    output += chars[(bitmap >> 12) & 63];
    output += i + 1 < str.length ? chars[(bitmap >> 6) & 63] : '=';
    output += i + 2 < str.length ? chars[bitmap & 63] : '=';
  }
  
  return output;
}

function getAuthHeader(): string {
  const credentials = `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`;
  const base64Credentials = base64Encode(credentials);
  return `Basic ${base64Credentials}`;
}

export async function sendVerificationCode(phoneNumber: string): Promise<SMSVerificationResponse> {
  try {
    console.log('=== TWILIO VERIFY - SENDING CODE ===');
    console.log('Phone Number:', phoneNumber);
    console.log('Service SID configured:', !!TWILIO_VERIFY_SERVICE_SID);
    console.log('Account SID configured:', !!TWILIO_ACCOUNT_SID);
    console.log('Auth Token configured:', !!TWILIO_AUTH_TOKEN);
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('❌ Twilio credentials not configured');
      return {
        success: false,
        message: 'SMS service not configured'
      };
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    console.log('Formatted phone number:', formattedPhone);
    
    const url = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`;
    console.log('API URL:', url);
    
    const response = await fetch(
      url,
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
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.status === 'pending') {
      console.log('✅ SUCCESS: Verification code sent via SMS');
      console.log('Verification SID:', data.sid);
      console.log('Status:', data.status);
      console.log('To:', data.to);
      console.log('Channel:', data.channel);
      return {
        success: true,
        message: 'Verification code sent',
        verificationId: data.sid
      };
    }
    
    console.error('❌ TWILIO API ERROR');
    console.error('Status:', response.status);
    console.error('Error data:', JSON.stringify(data, null, 2));
    return {
      success: false,
      message: data.message || 'Failed to send code'
    };
  } catch (error) {
    console.error('❌ EXCEPTION while sending verification code');
    console.error('Error:', error);
    return {
      success: false,
      message: 'Failed to send code'
    };
  }
}

export async function verifyCode(phoneNumber: string, code: string): Promise<boolean> {
  try {
    console.log('=== TWILIO VERIFY - CHECKING CODE ===');
    console.log('Phone Number:', phoneNumber);
    console.log('Code:', code);
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('❌ Twilio credentials not configured');
      return false;
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    console.log('Formatted phone number:', formattedPhone);
    
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
    console.log('Verification response status:', response.status);
    console.log('Verification response data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.status === 'approved') {
      console.log('✅ CODE VERIFIED SUCCESSFULLY');
      return true;
    }
    
    console.error('❌ VERIFICATION FAILED');
    console.error('Response:', JSON.stringify(data, null, 2));
    return false;
  } catch (error) {
    console.error('❌ Failed to verify code:', error);
    return false;
  }
}
