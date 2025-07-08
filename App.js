import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import TabNavigator from './navigation/TabNavigator';

import { Provider } from 'react-redux';         // Redux store provider
import store from './redux/store';              // Your Redux store
import { StripeProvider } from '@stripe/stripe-react-native';  // Stripe wrapper

const Stack = createNativeStackNavigator();

import * as Linking from 'expo-linking';
import PaymentSuccess from './screens/PaymentSucess';
import PaymentCancel from './screens/PaymentFailure';

const linking = {
  prefixes: ['yourappscheme://'],
  config: {
    screens: {
      PaymentSuccess: 'payment-success',
      PaymentCancel: 'payment-cancel',
    },
  },
};


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey="pk_test_51RhPomH5KMUhAu9OxG64eCgv2mOc9YPTYhvZbXKf0PeboDSV3NgXl4fzzU86T3tn3J3zlFTqoESC7eoWk3wv7RbV00CT4rIB1n"
        merchantIdentifier="merchant.com.walmart.hack athon" // iOS only
        merchantCountryCode="IN"
      >
        <NavigationContainer linking={linking}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
              <>
                <Stack.Screen name="Login">
                  {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
                </Stack.Screen>
                <Stack.Screen name="Signup">
                  {(props) => <SignUpScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
                </Stack.Screen>
              </>
            ) : (
              <>
                <Stack.Screen name="MainTabs">
                  {(props) => <TabNavigator {...props} setIsLoggedIn={setIsLoggedIn} />}
                </Stack.Screen>
                <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
                <Stack.Screen name="PaymentCancel" component={PaymentCancel} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
}
