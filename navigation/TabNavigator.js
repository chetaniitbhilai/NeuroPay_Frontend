import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useSelector } from 'react-redux';
import { selectCartCount } from '../redux/cartSlice';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ setIsLoggedIn }) {
  const cartCount = useSelector(selectCartCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Products') iconName = 'home-outline';
          else if (route.name === 'Cart') iconName = 'cart-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          const icon = <Ionicons name={iconName} size={size} color={color} />;

          if (route.name === 'Cart' && cartCount > 0) {
            return (
              <View>
                {icon}
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              </View>
            );
          }

          return icon;
        },
      })}
    >
      <Tab.Screen name="Products" component={ProductScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
