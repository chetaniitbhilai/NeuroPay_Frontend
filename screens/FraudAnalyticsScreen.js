import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFraudAnalytics, getRiskLevelColor } from '../services/fraudService';

const FraudAnalyticsScreen = ({ navigation }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const data = await getFraudAnalytics();
      setAnalytics(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch fraud analytics');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const renderOverviewCard = () => {
    if (!analytics) return null;

    const { overview } = analytics;
    
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔍 Fraud Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>{overview.totalPayments}</Text>
            <Text style={styles.overviewLabel}>Total Payments</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewNumber, { color: '#ff3d00' }]}>
              {overview.fraudPayments}
            </Text>
            <Text style={styles.overviewLabel}>Fraud Detected</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewNumber, { color: '#ff9800' }]}>
              {overview.fraudRate}%
            </Text>
            <Text style={styles.overviewLabel}>Fraud Rate</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewNumber, { color: '#4caf50' }]}>
              {overview.checkedPayments}
            </Text>
            <Text style={styles.overviewLabel}>Checked</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRiskDistribution = () => {
    if (!analytics?.riskDistribution) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Risk Distribution</Text>
        {analytics.riskDistribution.map((item, index) => (
          <View key={index} style={styles.riskItem}>
            <View style={styles.riskInfo}>
              <View 
                style={[
                  styles.riskIndicator, 
                  { backgroundColor: getRiskLevelColor(item._id) }
                ]} 
              />
              <Text style={styles.riskLabel}>{item._id} Risk</Text>
            </View>
            <Text style={styles.riskCount}>{item.count}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderFraudByMethod = () => {
    if (!analytics?.fraudByMethod) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💳 Fraud by Payment Method</Text>
        {analytics.fraudByMethod.map((item, index) => (
          <View key={index} style={styles.methodItem}>
            <Text style={styles.methodLabel}>{item._id.toUpperCase()}</Text>
            <Text style={styles.methodCount}>{item.count} fraudulent</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderHighRiskTransactions = () => {
    if (!analytics?.highRiskTransactions) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚠️ Recent High-Risk Transactions</Text>
        {analytics.highRiskTransactions.length === 0 ? (
          <Text style={styles.noData}>No high-risk transactions found</Text>
        ) : (
          analytics.highRiskTransactions.slice(0, 5).map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionAmount}>₹{transaction.amount}</Text>
                <Text style={styles.transactionMethod}>{transaction.method}</Text>
              </View>
              <View style={styles.transactionRisk}>
                <Text style={[styles.riskBadge, { backgroundColor: '#ff3d00' }]}>
                  HIGH RISK
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ff6f00" />
        <Text style={styles.loadingText}>Loading fraud analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ff6f00" />
        </TouchableOpacity>
        <Text style={styles.title}>Fraud Analytics</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#ff6f00" />
        </TouchableOpacity>
      </View>

      {renderOverviewCard()}
      {renderRiskDistribution()}
      {renderFraudByMethod()}
      {renderHighRiskTransactions()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  riskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  riskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  riskLabel: {
    fontSize: 16,
    color: '#333',
  },
  riskCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  methodLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  methodCount: {
    fontSize: 14,
    color: '#ff3d00',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionMethod: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionRisk: {
    alignItems: 'flex-end',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

export default FraudAnalyticsScreen;
