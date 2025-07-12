import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.108:5000/api/auth'; // Node.js backend for auth (port 5002)

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Optionally store token in AsyncStorage (if using JWT)
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }

    return data; // user data or token
  } catch (error) {
    throw error;
  }
};



export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    console.log('Response:', response);
    console.log('Request Body:', JSON.stringify(userData));

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};


export const getUserProfile = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('Token2:', token);
  if (!token) throw new Error('Not logged in');

  const res = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
  return data;
};

export const logoutUser = async () => {
  const token = await AsyncStorage.getItem('token');

  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  await AsyncStorage.removeItem('token');
};
