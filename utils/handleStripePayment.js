import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

export const handleStripePayment = async (cartItems, totalAmount, dispatch, clearCart) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await fetch('http://192.168.1.108:5000/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cartItems,
        totalAmount,
        method: 'card',
        location: 'India',
        merchantId: 'Walmart India',
      }),
    });

    const { clientSecret, paymentIntentId } = await response.json();

    const initSheet = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Walmart India',
      googlePay: true,
      merchantCountryCode: 'IN',
    });

    if (initSheet.error) return Alert.alert('Error', initSheet.error.message);

    const presentSheet = await presentPaymentSheet();

    if (presentSheet.error) {
      Alert.alert('Payment failed', presentSheet.error.message);
    } else {
      // ✅ Call backend to mark payment as succeeded
      await fetch('http://192.168.1.108:5000/api/payments/mark-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      Alert.alert('Success', 'Payment complete!');
      dispatch(clearCart());
    }
  } catch (err) {
    Alert.alert('Error', err.message);
  }
};
