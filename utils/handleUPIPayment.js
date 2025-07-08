// utils/handleUPIPayment.js
import { Linking, Alert } from 'react-native';

export const launchUPIPayment = async (amount) => {
  const UPI_ID = '9355844091@ptsbi'; // Replace with your UPI
  const NAME = 'Walmart India';
  const NOTE = 'UPI payment for cart';
  const CURRENCY = 'INR';

  const url = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NAME)}&tn=${encodeURIComponent(
    NOTE
  )}&am=${amount}&cu=${CURRENCY}`;

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert('Error', 'No UPI app found on device.');
    return null;
  }

  await Linking.openURL(url); // 🔗 Open UPI app
  return true;
};
