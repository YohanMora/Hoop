import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const requestPushPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    return permission === PermissionsAndroid.RESULTS.GRANTED;
  }

  const authStatus = await messaging().requestPermission();

  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

export const initializePushNotifications = async () => {
  const hasPermission = await requestPushPermission();

  if (!hasPermission) {
    console.log('Permiso de notificaciones denegado.');
    return undefined;
  }

  const token = await messaging().getToken();
  await AsyncStorage.setItem('fcmToken', token);
  console.log('FCM token:', token);

  const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
    console.log('Notificación recibida en foreground:', remoteMessage);
  });

  const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
    await AsyncStorage.setItem('fcmToken', newToken);
    console.log('FCM token actualizado:', newToken);
  });

  return () => {
    unsubscribeForeground();
    unsubscribeTokenRefresh();
  };
};
