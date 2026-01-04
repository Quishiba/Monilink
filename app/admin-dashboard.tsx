import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AdminContext, useAdmin } from '@/context/AdminContext';
import { Users, FileText, Shield, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react-native';

function AdminDashboardContent() {
  const router = useRouter();
  const { stats, isLoadingStats } = useAdmin();

  const statsCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      subtitle: `${stats?.activeUsers || 0} active`,
      icon: Users,
      color: '#4F46E5',
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions || 0,
      subtitle: `${stats?.pendingTransactions || 0} pending`,
      icon: FileText,
      color: '#10B981',
    },
    {
      title: 'KYC Verifications',
      value: stats?.pendingKYC || 0,
      subtitle: `${stats?.verifiedKYC || 0} verified`,
      icon: Shield,
      color: '#F59E0B',
    },
    {
      title: 'Messages',
      value: stats?.totalMessages || 0,
      subtitle: `${stats?.flaggedMessages || 0} flagged`,
      icon: MessageSquare,
      color: '#8B5CF6',
    },
  ];

  const alertCards = [
    {
      title: 'Disputed Transactions',
      value: stats?.disputedTransactions || 0,
      icon: AlertTriangle,
      color: '#EF4444',
    },
    {
      title: 'Suspended Users',
      value: stats?.suspendedUsers || 0,
      icon: AlertTriangle,
      color: '#F97316',
    },
    {
      title: 'Completed Today',
      value: stats?.completedTransactions || 0,
      icon: CheckCircle,
      color: '#10B981',
    },
    {
      title: 'Pending KYC',
      value: stats?.pendingKYC || 0,
      icon: Clock,
      color: '#F59E0B',
    },
  ];

  if (isLoadingStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>MoniLink Administration</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.grid}>
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.iconContainer, { backgroundColor: card.color + '15' }]}>
                    <Icon size={24} color={card.color} />
                  </View>
                  <Text style={styles.statValue}>{card.value.toLocaleString()}</Text>
                  <Text style={styles.statTitle}>{card.title}</Text>
                  <Text style={styles.statSubtitle}>{card.subtitle}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alerts & Activity</Text>
          <View style={styles.grid}>
            {alertCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <View key={index} style={styles.alertCard}>
                  <View style={[styles.alertIconContainer, { backgroundColor: card.color + '15' }]}>
                    <Icon size={20} color={card.color} />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertValue}>{card.value}</Text>
                    <Text style={styles.alertTitle}>{card.title}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          
          <View style={styles.managementGrid}>
            <TouchableOpacity style={styles.managementCard}>
              <Shield size={32} color="#4F46E5" />
              <Text style={styles.managementTitle}>KYC Review</Text>
              <Text style={styles.managementValue}>{stats?.pendingKYC || 0}</Text>
              <Text style={styles.managementLabel}>Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.managementCard}>
              <FileText size={32} color="#10B981" />
              <Text style={styles.managementTitle}>Transactions</Text>
              <Text style={styles.managementValue}>{stats?.pendingTransactions || 0}</Text>
              <Text style={styles.managementLabel}>Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.managementCard}>
              <MessageSquare size={32} color="#8B5CF6" />
              <Text style={styles.managementTitle}>Messages</Text>
              <Text style={styles.managementValue}>{stats?.flaggedMessages || 0}</Text>
              <Text style={styles.managementLabel}>Flagged</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.managementCard}>
              <Users size={32} color="#F59E0B" />
              <Text style={styles.managementTitle}>Users</Text>
              <Text style={styles.managementValue}>{stats?.totalUsers || 0}</Text>
              <Text style={styles.managementLabel}>Total</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function AdminDashboard() {
  return (
    <AdminContext>
      <AdminDashboardContent />
    </AdminContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  alertCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 2,
  },
  alertTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  managementCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  managementTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  managementValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#4F46E5',
    marginBottom: 4,
  },
  managementLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  backButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
