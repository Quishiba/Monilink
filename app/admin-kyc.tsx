import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AdminContext, useAdmin } from '@/context/AdminContext';
import { Shield, CheckCircle, XCircle, User } from 'lucide-react-native';

function KYCVerificationContent() {
  const router = useRouter();
  const { kycVerifications, isLoadingKYC, verifyKYC, rejectKYC, kycFilter, setKycFilter } = useAdmin();

  const handleVerify = (userId: string, userName: string) => {
    Alert.alert(
      'Verify KYC',
      `Approve KYC verification for ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => verifyKYC(userId, 'KYC approved by admin'),
        },
      ]
    );
  };

  const handleReject = (userId: string, userName: string) => {
    Alert.prompt(
      'Reject KYC',
      `Enter rejection reason for ${userName}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: (reason?: string) => {
            if (reason && reason.trim()) {
              rejectKYC(userId, reason);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const filterButtons = [
    { key: 'pending', label: 'Pending' },
    { key: 'verified', label: 'Verified' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>KYC Verifications</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterSection}>
        {filterButtons.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              kycFilter === filter.key && styles.filterButtonActive,
            ]}
            onPress={() => setKycFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                kycFilter === filter.key && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {isLoadingKYC ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading verifications...</Text>
          </View>
        ) : kycVerifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Shield size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No verifications found</Text>
          </View>
        ) : (
          kycVerifications.map((user) => {
            const kycData = user.kycData;
            
            return (
              <View key={user.id} style={styles.verificationCard}>
                <View style={styles.userHeader}>
                  <View style={styles.userAvatar}>
                    <User size={24} color="#6B7280" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.id}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    user.kycStatus === 'verified' && styles.statusVerified,
                    user.kycStatus === 'pending' && styles.statusPending,
                    user.kycStatus === 'rejected' && styles.statusRejected,
                  ]}>
                    <Text style={styles.statusText}>
                      {user.kycStatus === 'verified' ? '✓ Verified' : 
                       user.kycStatus === 'pending' ? '⏱ Pending' : 
                       user.kycStatus === 'rejected' ? '✗ Rejected' : 
                       '○ Not Verified'}
                    </Text>
                  </View>
                </View>

                {kycData && (
                  <View style={styles.kycDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Full Name:</Text>
                      <Text style={styles.detailValue}>
                        {kycData.firstName} {kycData.lastName}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date of Birth:</Text>
                      <Text style={styles.detailValue}>{kycData.dateOfBirth || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phone:</Text>
                      <Text style={styles.detailValue}>
                        {kycData.phone} {kycData.phoneVerified ? '✓' : ''}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Address:</Text>
                      <Text style={styles.detailValue}>
                        {kycData.address || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>City:</Text>
                      <Text style={styles.detailValue}>{kycData.city || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Country:</Text>
                      <Text style={styles.detailValue}>{kycData.country || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Document Type:</Text>
                      <Text style={styles.detailValue}>
                        {kycData.documentType ? kycData.documentType.replace('_', ' ').toUpperCase() : 'N/A'}
                      </Text>
                    </View>
                    {kycData.submittedAt && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Submitted:</Text>
                        <Text style={styles.detailValue}>
                          {new Date(kycData.submittedAt).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {kycData?.documentImageUrl && (
                  <View style={styles.imagesSection}>
                    <Text style={styles.imagesSectionTitle}>Documents</Text>
                    <View style={styles.imagesGrid}>
                      {kycData.documentImageUrl && (
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: kycData.documentImageUrl }}
                            style={styles.documentImage}
                            resizeMode="cover"
                          />
                          <Text style={styles.imageLabel}>ID Document</Text>
                        </View>
                      )}
                      {kycData.selfieImageUrl && (
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: kycData.selfieImageUrl }}
                            style={styles.documentImage}
                            resizeMode="cover"
                          />
                          <Text style={styles.imageLabel}>Selfie</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {user.kycStatus === 'pending' && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleVerify(user.id, user.name)}
                    >
                      <CheckCircle size={18} color="#FFFFFF" />
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleReject(user.id, user.name)}
                    >
                      <XCircle size={18} color="#EF4444" />
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {user.kycStatus === 'rejected' && kycData?.rejectionReason && (
                  <View style={styles.rejectionReason}>
                    <Text style={styles.rejectionReasonLabel}>Rejection Reason:</Text>
                    <Text style={styles.rejectionReasonText}>{kycData.rejectionReason}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function KYCVerification() {
  return (
    <AdminContext>
      <KYCVerificationContent />
    </AdminContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111827',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 60,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#4F46E5',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  verificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  statusVerified: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#374151',
  },
  kycDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  imagesSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  imagesSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 12,
  },
  imagesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    flex: 1,
  },
  documentImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  imageLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
  rejectionReason: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  rejectionReasonLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#991B1B',
    marginBottom: 4,
  },
  rejectionReasonText: {
    fontSize: 14,
    color: '#DC2626',
  },
});
