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
import { useFocusEffect } from '@react-navigation/native';

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

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

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
          <Button title="View Fraud Analytics" color="#ff6f00" onPress={() => navigation.navigate('FraudAnalytics')} />
        </View>

        <View style={{ marginTop: 10 }}>
          <Button title="Logout" color="#d9534f" onPress={handleLogout} />
        </View>
      </View>

      {/* ✅ Show past orders if any */}
      {orders.length > 0 && (
        <View style={styles.profileSection}>
          <Text style={styles.heading}>🧾 Past Orders</Text>
          {orders.map((order, index) => (
            <View key={order._id || index} style={styles.orderItem}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderAmount}>
                  ₹{order.amount} • {new Date(order.date).toLocaleString()}
                </Text>
                {order.fraudDetection && order.fraudDetection.isChecked && (
                  <View style={[
                    styles.riskBadge,
                    {
                      backgroundColor:
                        order.fraudDetection.riskLevel === 'HIGH' ? '#ff3d00' :
                          order.fraudDetection.riskLevel === 'MEDIUM' ? '#ff9800' : '#4caf50'
                    }
                  ]}>
                    <Text style={styles.riskText}>
                      {order.fraudDetection.riskLevel}
                    </Text>
                  </View>
                )}
              </View>
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  riskText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
