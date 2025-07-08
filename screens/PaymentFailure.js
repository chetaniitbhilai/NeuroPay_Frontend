import React, { useEffect } from 'react';
import { Alert, View, Text } from 'react-native';

export default function PaymentCancel({ navigation }) {
  useEffect(() => {
    Alert.alert("Cancelled ❌", "Your payment was cancelled.");
    navigation.navigate('MainTabs');
  }, []);

  return (
    <View>
      <Text>Redirecting...</Text>
    </View>
  );
}
