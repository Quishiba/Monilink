import { sendVerificationCode } from './lib/sms-service';

async function testSMS() {
  const phoneNumber = '+4915226304934';
  
  console.log('====================================');
  console.log('TESTING SMS VERIFICATION');
  console.log('====================================');
  console.log('Sending verification code to:', phoneNumber);
  console.log('Time:', new Date().toISOString());
  console.log('\n--- Environment Check ---');
  console.log('TWILIO_ACCOUNT_SID:', process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Missing');
  console.log('TWILIO_AUTH_TOKEN:', process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Missing');
  console.log('TWILIO_VERIFY_SERVICE_SID:', process.env.EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID ? '✓ Set' : '✗ Missing');
  console.log('====================================\n');
  
  const result = await sendVerificationCode(phoneNumber);
  
  console.log('\n====================================');
  console.log('RESULT:');
  console.log('====================================');
  console.log('Success:', result.success);
  console.log('Message:', result.message);
  console.log('Verification ID:', result.verificationId);
  console.log('====================================\n');
  
  if (result.success) {
    console.log('✅ SMS sent successfully!');
    console.log('📱 Check the phone +4915226304934 for the 6-digit code');
    console.log('📌 The code should arrive within 1-2 minutes');
    console.log('\n⚠️  IMPORTANT NOTES:');
    console.log('- If using Twilio trial account, +4915226304934 must be verified in Twilio Console');
    console.log('- Check Twilio Console > Verify > Logs for delivery status');
    console.log('- SMS might be delayed depending on carrier');
  } else {
    console.log('❌ Failed to send SMS');
    console.log('Error:', result.message);
    console.log('\n🔍 TROUBLESHOOTING:');
    console.log('1. Verify Twilio credentials are correct');
    console.log('2. Check if Verify Service is active in Twilio Console');
    console.log('3. For trial accounts, add +4915226304934 to Verified Caller IDs');
    console.log('4. Check Twilio account balance');
    console.log('5. Review error logs above for specific error codes');
  }
}

testSMS().catch(console.error);
