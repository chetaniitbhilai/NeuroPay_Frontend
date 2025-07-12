


import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { getFraudMessage } from '../services/fraudService';

export const handleUPIPaymentSuccess = async (cartItems, totalAmount, vpa, dispatch, clearCart, refreshHistory) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch('http://192.168.1.108:5000/api/payments/upi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cartItems,
        totalAmount,
        vpa,
        location: 'India',
        merchantId: 'Walmart India'
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // Show fraud detection results if available
      if (data.fraudResult) {
        const fraudMessage = getFraudMessage(data.fraudResult);
        if (fraudMessage && data.fraudResult.risk_level !== 'LOW') {
          Alert.alert(
            'Payment Processed with Fraud Alert',
            `${fraudMessage.message}\n\nYour payment has been processed, but please monitor your account for any suspicious activity.`,
            [{ text: 'OK', style: 'default' }]
          );
        } else {
          Alert.alert('Success', 'UPI payment logged successfully.');
        }
      } else {
        Alert.alert('Success', 'UPI payment logged.');
      }

      dispatch(clearCart());

      if (typeof refreshHistory === 'function') {
        refreshHistory(); // 🔁 trigger refresh
      }
    } else {
      Alert.alert('Error', data.error || 'UPI payment logging failed.');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Error', err.message);
  }
};
