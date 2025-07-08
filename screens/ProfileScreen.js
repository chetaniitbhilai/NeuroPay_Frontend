import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, logoutUser } from '../services/authService';
import { getPaymentHistory } from '../utils/paymentService'; // ✅ import history API

export default function ProfileScreen({ navigation, setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // ✅ state for past orders
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUser(profile);

      const history = await getPaymentHistory();
      setOrders(history);
    } catch (err) {
      console.log(err.message);
      Alert.alert('Session expired', 'Please login again.');
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
    } catch (err) {
      console.log(err.message);
      Alert.alert('Logout failed', err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#555' }}>No profile found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.heading}>👤 Profile</Text>

        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>
          {user.address?.street}, {user.address?.city}, {user.address?.country} - {user.address?.pincode}
        </Text>

        <View style={{ marginTop: 20 }}>
          <Button title="Logout" color="#d9534f" onPress={handleLogout} />
        </View>
      </View>

      {/* ✅ Show past orders if any */}
      {orders.length > 0 && (
        <View style={styles.profileSection}>
          <Text style={styles.heading}>🧾 Past Orders</Text>
          {orders.map((order, index) => (
            <View key={order._id || index} style={styles.orderItem}>
              <Text style={styles.orderAmount}>
                ₹{order.amount} • {new Date(order.date).toLocaleString()}
              </Text>
              <Text style={styles.orderItems}>
                {order.items.map((i) => i.name).join(', ')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 10,
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#222',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItem: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  orderAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderItems: {
    color: '#666',
    fontSize: 14,
  },
});
