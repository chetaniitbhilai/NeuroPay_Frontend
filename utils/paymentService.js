import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPaymentHistory = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await fetch('http://192.168.1.108:5000/api/payments/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch payment history');
  }

  return res.json();
};
