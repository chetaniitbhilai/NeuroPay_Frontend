


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
      Alert.alert('Success', 'UPI payment logged.');
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
