# SMS Phone Verification Integration Guide

This app includes a complete phone verification system integrated with **Twilio Verify**.

## ✅ Current Setup: Twilio Verify

The app is **already integrated** with Twilio Verify API. The following environment variables are configured:

- `EXPO_PUBLIC_TWILIO_ACCOUNT_SID`
- `EXPO_PUBLIC_TWILIO_AUTH_TOKEN`
- `EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID`

### How It Works

1. **Sending Verification Code**
   - User enters phone number during registration
   - App calls `sendVerificationCode()` which uses Twilio Verify API
   - Twilio sends a 6-digit code via SMS
   - No need to store codes - Twilio handles everything

2. **Verifying Code**
   - User enters the 6-digit code
   - App calls `verifyCode()` which checks with Twilio
   - Twilio validates and returns approval status

### Setup Your Own Twilio Account

1. **Create a Twilio Account**
   - Sign up at https://www.twilio.com
   - Get your Account SID and Auth Token from the console

2. **Create a Verify Service**
   - Go to: https://console.twilio.com/us1/develop/verify/services
   - Click "Create new Service"
   - Give it a name (e.g., "Monilink")
   - Copy the Service SID

3. **Your Credentials Are Already Set**
   The environment variables are already configured in the project.
   Make sure they contain your actual Twilio credentials.

### Phone Number Format

Twilio requires phone numbers in E.164 format:
- Must start with `+` and country code
- Example: `+237612345678` (Cameroon)
- Example: `+33612345678` (France)

The app automatically adds `+` if missing.

## Alternative: Firebase Phone Auth

1. **Setup Firebase**
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/auth
   ```

2. **Configure Firebase**
   - Create project at https://console.firebase.google.com
   - Enable Phone Authentication
   - Add your app

3. **Update `lib/sms-service.ts`**
   ```typescript
   import auth from '@react-native-firebase/auth';

   export async function sendVerificationCode(phoneNumber: string): Promise<SMSVerificationResponse> {
     try {
       const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
       
       return {
         success: true,
         message: 'Verification code sent',
         verificationId: confirmation.verificationId
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
       const confirmation = auth().confirmVerificationCode(code);
       await confirmation.confirm(code);
       return true;
     } catch (error) {
       console.error('Failed to verify code:', error);
       return false;
     }
   }
   ```

## Alternative: SMS.to

1. **Sign up at https://sms.to**
   - Get your API key

2. **Add to environment**
   ```
   EXPO_PUBLIC_SMS_TO_API_KEY=your_api_key
   ```

3. **Update `lib/sms-service.ts`**
   ```typescript
   export async function sendVerificationCode(phoneNumber: string): Promise<SMSVerificationResponse> {
     try {
       const code = Math.floor(100000 + Math.random() * 900000).toString();
       
       const response = await fetch('https://api.sms.to/sms/send', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SMS_TO_API_KEY}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           to: phoneNumber,
           message: `Your Monilink verification code is: ${code}`,
           sender_id: 'Monilink'
         })
       });
       
       const data = await response.json();
       
       if (data.success) {
         return {
           success: true,
           message: 'Verification code sent',
           verificationId: data.message_id
         };
       }
       
       throw new Error('SMS API error');
     } catch (error) {
       console.error('Failed to send verification code:', error);
       return {
         success: false,
         message: 'Failed to send code'
       };
     }
   }
   ```

## Security Best Practices

1. **Store codes on backend** - Never store verification codes in the app
2. **Set expiration time** - Codes should expire after 5-10 minutes
3. **Rate limiting** - Limit SMS sends per phone number per day
4. **Validate phone format** - Check phone number format before sending
5. **Use HTTPS** - Always use secure connections for API calls

## Testing

### Development Testing
The integration uses the **live Twilio Verify API**. During development:
- Real SMS will be sent to the phone number
- You'll receive actual verification codes
- This uses your Twilio credits

### Free Testing with Twilio
Twilio provides:
- Free trial credits ($15 USD)
- Verified phone numbers for testing (no SMS sent)
- Test credentials that log codes to console

To use test mode, add test credentials in Twilio Console.

## Flow Overview

1. User enters phone number during registration
2. App sends verification code via SMS service
3. User receives SMS with 6-digit code
4. User enters code in verification screen
5. App verifies code with service
6. Phone is marked as verified in user profile

## Files Modified

- `app/phone-verification.tsx` - Main verification screen
- `app/register.tsx` - Integration with registration
- `lib/sms-service.ts` - SMS service abstraction layer
- `context/AppContext.tsx` - State management for verification
- `constants/translations.ts` - Added verification translations
