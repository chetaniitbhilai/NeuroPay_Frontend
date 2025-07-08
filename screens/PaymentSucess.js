import React, { useEffect } from 'react';
import { Alert, View, Text } from 'react-native';

export default function PaymentSuccess({ navigation }) {
  useEffect(() => {
    Alert.alert("Success ✅", "Your payment was successful!");
    navigation.navigate('MainTabs');
  }, []);

  return (
    <View>
      <Text>Processing Payment...</Text>
    </View>
  );
}
