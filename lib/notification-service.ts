import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

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

  try {
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
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null,
  });
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

export function setupNotificationResponseHandler(callback: (response: Notifications.NotificationResponse) => void) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
