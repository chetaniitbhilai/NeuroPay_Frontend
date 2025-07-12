import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.108:5000/api/fraud'; // Updated to correct backend port

export const getFraudAnalytics = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch fraud analytics');
    }

    return data;
  } catch (error) {
    console.error('Error fetching fraud analytics:', error);
    throw error;
  }
};

export const checkTransactionFraud = async (paymentId) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to check transaction fraud');
    }

    return data;
  } catch (error) {
    console.error('Error checking transaction fraud:', error);
    throw error;
  }
};

export const getFraudRiskLevel = (fraudProbability) => {
  if (fraudProbability >= 0.7) return 'HIGH';
  if (fraudProbability >= 0.3) return 'MEDIUM';
  return 'LOW';
};

export const getRiskLevelColor = (riskLevel) => {
  switch (riskLevel) {
    case 'HIGH':
      return '#ff3d00';
    case 'MEDIUM':
      return '#ff9800';
    case 'LOW':
      return '#4caf50';
    default:
      return '#666';
  }
};

export const getFraudMessage = (fraudResult) => {
  if (!fraudResult) return null;

  const { risk_level, fraud_probability, is_fraud } = fraudResult;

  if (is_fraud) {
    return {
      title: '⚠️ High Fraud Risk Detected',
      message: `This transaction has a ${(fraud_probability * 100).toFixed(1)}% fraud probability. Please verify your payment method and try again.`,
      type: 'error'
    };
  }

  if (risk_level === 'MEDIUM') {
    return {
      title: '🔍 Medium Risk Transaction',
      message: `This transaction has a ${(fraud_probability * 100).toFixed(1)}% fraud probability. Please proceed with caution.`,
      type: 'warning'
    };
  }

  return {
    title: '✅ Low Risk Transaction',
    message: `This transaction appears to be legitimate with a ${(fraud_probability * 100).toFixed(1)}% fraud probability.`,
    type: 'success'
  };
};
