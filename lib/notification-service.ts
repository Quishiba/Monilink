import { Platform } from 'react-native';
import Constants from 'expo-constants';

let Notifications: any = null;
let isNotificationsAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
  isNotificationsAvailable = true;
  
  if (Notifications && Constants.appOwnership !== 'expo') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch {
  console.log('expo-notifications not available in Expo Go');
  isNotificationsAvailable = false;
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!isNotificationsAvailable || !Notifications || Constants.appOwnership === 'expo') {
    console.log('Push notifications not available in Expo Go');
    return null;
  }

  let token: string | null = null;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) {
      console.log('Project ID not found');
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Push token:', token);
  } catch (e) {
    console.log('Error getting push token:', e);
  }

  return token;
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
) {
  if (!isNotificationsAvailable || !Notifications || Constants.appOwnership === 'expo') {
    console.log('Local notification (Expo Go):', title, body);
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    console.log('Failed to schedule notification:', error);
  }
}

export async function sendMessageNotification(senderName: string, message: string, transactionId: string) {
  await scheduleLocalNotification(
    `New message from ${senderName}`,
    message,
    { type: 'message', transactionId }
  );
}

export async function sendTransactionStatusNotification(status: string, transactionId: string) {
  const statusMessages: Record<string, string> = {
    accepted: 'Your exchange has been accepted!',
    in_progress: 'Payment is in progress',
    proof_submitted: 'Payment proof has been submitted',
    validated: 'Payment has been validated',
    completed: 'Exchange completed successfully!',
    cancelled: 'Exchange has been cancelled',
    disputed: 'Exchange is under dispute',
  };

  const message = statusMessages[status] || 'Transaction status updated';
  
  await scheduleLocalNotification(
    'Transaction Update',
    message,
    { type: 'transaction', transactionId, status }
  );
}

export async function sendKycVerificationNotification(status: string) {
  const statusMessages: Record<string, string> = {
    pending: 'Your verification is being reviewed',
    verified: 'Your account has been verified!',
    rejected: 'Verification needs attention',
  };

  const message = statusMessages[status] || 'Verification status updated';
  
  await scheduleLocalNotification(
    'Verification Update',
    message,
    { type: 'kyc', status }
  );
}

export function setupNotificationResponseHandler(callback: (response: any) => void) {
  if (!isNotificationsAvailable || !Notifications || Constants.appOwnership === 'expo') {
    console.log('Notification response handler not available in Expo Go');
    return { remove: () => {} };
  }

  try {
    return Notifications.addNotificationResponseReceivedListener(callback);
  } catch (error) {
    console.log('Failed to setup notification handler:', error);
    return { remove: () => {} };
  }
}
