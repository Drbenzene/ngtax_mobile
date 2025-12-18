// SMS Permission Service for Android

import { Platform, PermissionsAndroid } from 'react-native';

export interface SMSMessage {
  id: string;
  address: string;
  body: string;
  date: number;
  read: boolean;
}

/**
 * Check if SMS is available on device
 */
export const isSMSAvailable = async (): Promise<boolean> => {
  // SMS permissions are only available on Android
  return Platform.OS === 'android';
};

/**
 * Request SMS read permission (Android only)
 */
export const requestSMSPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    console.log('SMS permissions are only available on Android');
    return false;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission',
        message: 'NGTax AI needs access to your SMS to automatically detect bank transactions and receipts for easier tax filing.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('SMS permission granted');
      return true;
    } else {
      console.log('SMS permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting SMS permission:', error);
    return false;
  }
};

/**
 * Request SMS receive permission for background monitoring
 */
export const requestSMSReceivePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      {
        title: 'Receive SMS Permission',
        message: 'NGTax AI needs permission to monitor incoming SMS for automatic transaction detection.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting SMS receive permission:', error);
    return false;
  }
};

/**
 * Check if SMS permissions are granted
 */
export const checkSMSPermissions = async (): Promise<{
  read: boolean;
  receive: boolean;
}> => {
  if (Platform.OS !== 'android') {
    return { read: false, receive: false };
  }

  try {
    const readGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS
    );
    const receiveGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
    );

    return {
      read: readGranted,
      receive: receiveGranted,
    };
  } catch (error) {
    console.error('Error checking SMS permissions:', error);
    return { read: false, receive: false };
  }
};

/**
 * Request all necessary SMS permissions
 */
export const requestAllSMSPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const permissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    ]);

    const readGranted = permissions['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED;
    const receiveGranted = permissions['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED;

    return readGranted && receiveGranted;
  } catch (error) {
    console.error('Error requesting SMS permissions:', error);
    return false;
  }
};

/**
 * Parse bank transaction from SMS
 * Common patterns for Nigerian banks
 */
export const parseBankSMS = (message: SMSMessage): {
  isTransaction: boolean;
  amount?: number;
  type?: 'debit' | 'credit';
  merchant?: string;
  balance?: number;
  bank?: string;
} => {
  const body = message.body.toLowerCase();
  
  // Common Nigerian bank keywords
  const isTransaction = 
    body.includes('debit') || 
    body.includes('credit') || 
    body.includes('transfer') ||
    body.includes('withdrawal') ||
    body.includes('deposit');

  if (!isTransaction) {
    return { isTransaction: false };
  }

  // Extract amount (matches NGN, N, or ₦ followed by numbers)
  const amountMatch = body.match(/(?:ngn|n|₦)\s?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined;

  // Determine transaction type
  const type = body.includes('credit') || body.includes('deposit') ? 'credit' : 'debit';

  // Extract balance
  const balanceMatch = body.match(/(?:bal|balance).*?(?:ngn|n|₦)\s?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  const balance = balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : undefined;

  // Detect bank
  let bank: string | undefined;
  if (message.address.includes('GTBank') || body.includes('gtbank')) bank = 'GTBank';
  else if (message.address.includes('Access') || body.includes('access bank')) bank = 'Access Bank';
  else if (message.address.includes('Zenith') || body.includes('zenith')) bank = 'Zenith Bank';
  else if (message.address.includes('UBA') || body.includes('uba')) bank = 'UBA';
  else if (message.address.includes('First') || body.includes('first bank')) bank = 'First Bank';
  else if (message.address.includes('Sterling') || body.includes('sterling')) bank = 'Sterling Bank';

  return {
    isTransaction: true,
    amount,
    type,
    balance,
    bank,
  };
};

export default {
  isSMSAvailable,
  requestSMSPermission,
  requestSMSReceivePermission,
  checkSMSPermissions,
  requestAllSMSPermissions,
  parseBankSMS,
};
