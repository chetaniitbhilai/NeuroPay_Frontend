import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import { getUserProfile, logoutUser } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation, setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profile = await getUserProfile();
      console.log(profile);
      setUser(profile);
    } catch (err) {
      console.log(err.message);
      Alert.alert("Session expired", "Please login again.");
      await AsyncStorage.removeItem("token"); // Clear stored token
      setIsLoggedIn(false); // Go back to login screen
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call API to clear cookie (optional for JWT)
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
});
