import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { signupUser } from '../services/authService'; // ✅ Import here

export default function SignupScreen({ navigation, setIsLoggedIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword || !street || !city || !country || !pincode) {
      Alert.alert('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    const userData = {
      name,
      email,
      password,
      confirmPassword,
      address: {
        street,
        city,
        country,
        pincode,
      },
    };

    try {
      const res = await signupUser(userData);
      Alert.alert('Signup successful', res.message || 'Account created');
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert('Signup failed', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>📝 Sign Up</Text>

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eye}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          value={confirmPassword}
          secureTextEntry={!showConfirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Text style={styles.eye}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>


        <Text style={styles.subheading}>📍 Address</Text>
        <TextInput style={styles.input} placeholder="Street" value={street} onChangeText={setStreet} />
        <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />
        <TextInput style={styles.input} placeholder="Pincode" value={pincode} keyboardType="numeric" onChangeText={setPincode} />

        <Button title="Sign Up" onPress={handleSignup} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 14,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eye: {
    fontSize: 18,
    padding: 4,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },  
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
    fontSize: 14,
  },
});
