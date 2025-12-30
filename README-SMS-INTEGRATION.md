# SMS Phone Verification Integration Guide

This app includes a complete phone verification system. To use it with a real SMS service, follow these steps:

## Setup Instructions

### Option 1: Twilio (Popular & Free Trial)

1. **Create a Twilio Account**
   - Sign up at https://www.twilio.com
   - Get your Account SID and Auth Token
   - Get a phone number

2. **Install Twilio Package**
   ```bash
   npm install twilio
   ```

3. **Add Environment Variables**
   Add to your `.env` file:
   ```
   EXPO_PUBLIC_TWILIO_ACCOUNT_SID=your_account_sid
   EXPO_PUBLIC_TWILIO_AUTH_TOKEN=your_auth_token
   EXPO_PUBLIC_TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. **Update `lib/sms-service.ts`**
   ```typescript
   import twilio from 'twilio';

   const client = twilio(
     process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID,
     process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN
   );

   export async function sendVerificationCode(phoneNumber: string): Promise<SMSVerificationResponse> {
     try {
       const code = Math.floor(100000 + Math.random() * 900000).toString();
       
       await client.messages.create({
         body: `Your Monilink verification code is: ${code}`,
         from: process.env.EXPO_PUBLIC_TWILIO_PHONE_NUMBER,
         to: phoneNumber
       });
       
       // Store code securely (backend recommended)
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
   ```

### Option 2: Firebase Phone Auth (Free & Easy)

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

### Option 3: SMS.to (Simple HTTP API)

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

## Testing in Development

The current implementation uses a mock system that:
- Generates a random 6-digit code
- Logs it to the console
- Accepts any valid 6-digit code for verification

This allows you to test the UI without spending SMS credits.

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
