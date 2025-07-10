import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { getFraudMessage, getRiskLevelColor } from '../services/fraudService';

const FraudAlert = ({ fraudResult, style }) => {
  if (!fraudResult) return null;

  const fraudMessage = getFraudMessage(fraudResult);
  if (!fraudMessage) return null;

  const riskColor = getRiskLevelColor(fraudResult.risk_level);

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'error':
        return '#ffebee';
      case 'warning':
        return '#fff3e0';
      case 'success':
        return '#e8f5e8';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor(fraudMessage.type) }, style]}>
      <View style={[styles.riskIndicator, { backgroundColor: riskColor }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: riskColor }]}>{fraudMessage.title}</Text>
        <Text style={styles.message}>{fraudMessage.message}</Text>
        <Text style={styles.riskLevel}>Risk Level: {fraudResult.risk_level}</Text>
      </View>
    </View>
  );
};

const FraudAlertDialog = ({ fraudResult, onContinue, onCancel }) => {
  if (!fraudResult) return null;

  const fraudMessage = getFraudMessage(fraudResult);
  if (!fraudMessage) return null;

  const showAlert = () => {
    Alert.alert(
      fraudMessage.title,
      fraudMessage.message,
      [
        {
          text: 'Cancel Payment',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Continue Anyway',
          style: 'default',
          onPress: onContinue,
        },
      ],
      { cancelable: false }
    );
  };

  // Auto-show alert if high risk
  React.useEffect(() => {
    if (fraudResult.risk_level === 'HIGH') {
      showAlert();
    }
  }, [fraudResult]);

  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  riskIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  riskLevel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
});

export default FraudAlert;
export { FraudAlertDialog };
