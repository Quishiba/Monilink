export interface SMSVerificationResponse {
  success: boolean;
  message?: string;
  verificationId?: string;
}

export async function sendVerificationCode(phoneNumber: string): Promise<SMSVerificationResponse> {
  try {
    console.log('Sending verification code to:', phoneNumber);
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated code:', code);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Verification code sent',
      verificationId: `verify_${Date.now()}`
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
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Failed to verify code:', error);
    return false;
  }
}
