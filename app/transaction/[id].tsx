import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, MessageCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { getCurrencyInfo } from '@/constants/currencies';
import { useState, useEffect } from 'react';
import { TransactionStatus } from '@/types';

const STATUS_CONFIG: Record<TransactionStatus, { label: string; color: string; icon: any }> = {
  proposed: { label: 'Proposed', color: colors.dark.warning, icon: Clock },
  accepted: { label: 'Accepted', color: colors.dark.secondary, icon: CheckCircle },
  in_progress: { label: 'In Progress', color: colors.dark.secondary, icon: Clock },
  proof_submitted: { label: 'Proof Submitted', color: colors.dark.secondary, icon: AlertCircle },
  validated: { label: 'Validated', color: colors.dark.success, icon: CheckCircle },
  completed: { label: 'Completed', color: colors.dark.success, icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: colors.dark.error, icon: AlertCircle },
  disputed: { label: 'Disputed', color: colors.dark.error, icon: AlertCircle },
};

export default function TransactionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { offers, transactions, createTransaction, updateTransactionStatus, kycData, currentUser, isAuthenticated, t } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  const existingTransaction = transactions.find(tx => tx.id === id);
  const offer = offers.find(o => o.id === id);

  const [transaction, setTransaction] = useState(() => {
    if (existingTransaction) return existingTransaction;
    return null;
  });

  useEffect(() => {
    if (!transaction && offer && currentUser) {
      try {
        const newTransaction = createTransaction(offer.id);
        setTransaction(newTransaction);
      } catch (error) {
        console.error('Failed to create transaction:', error);
      }
    }
  }, [transaction, offer, currentUser, createTransaction]);

  if (!transaction && !offer) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.errorText}>Transaction not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  const displayData = transaction || {
    id: offer!.id,
    offerId: offer!.id,
    userA: offer!.user,
    userB: currentUser || {} as any,
    giveCurrency: offer!.giveCurrency,
    giveAmount: offer!.giveAmount,
    getCurrency: offer!.getCurrency,
    getAmount: offer!.getAmount,
    rate: offer!.rate,
    status: 'proposed' as const,
    paymentMethod: offer!.paymentMethods[0],
    createdAt: offer!.createdAt,
    updatedAt: offer!.createdAt,
  };

  const giveInfo = getCurrencyInfo(displayData.giveCurrency);
  const getInfo = getCurrencyInfo(displayData.getCurrency);
  const statusConfig = STATUS_CONFIG[displayData.status];
  const StatusIcon = statusConfig.icon;

  const getDisplayName = (user: any) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName.charAt(0)}.`;
    }
    if (user.name) {
      const parts = user.name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0]} ${parts[1].charAt(0)}.`;
      }
      return user.name;
    }
    return 'User';
  };

  const handleAcceptExchange = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (kycData.status !== 'verified') {
      setShowKycModal(true);
      return;
    }
    if (!transaction) {
      try {
        const newTransaction = createTransaction(offer!.id);
        setTransaction(newTransaction);
        updateTransactionStatus(newTransaction.id, 'accepted');
      } catch (error) {
        console.error('Failed to create transaction:', error);
      }
    } else {
      updateTransactionStatus(transaction.id, 'accepted');
      setTransaction({ ...transaction, status: 'accepted' });
    }
  };

  const handleOpenChat = () => {
    router.push(`/chat/${displayData.id}`);
  };

  const checkKycAndProceed = (action: () => void, actionName: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (kycData.status !== 'verified') {
      setShowKycModal(true);
      return;
    }
    action();
  };

  const handleStartProgress = () => {
    checkKycAndProceed(() => {
      if (transaction) {
        updateTransactionStatus(transaction.id, 'in_progress');
        setTransaction({ ...transaction, status: 'in_progress' });
      }
    }, 'start');
  };

  const handleSubmitProof = () => {
    checkKycAndProceed(() => {
      if (transaction) {
        updateTransactionStatus(transaction.id, 'proof_submitted');
        setTransaction({ ...transaction, status: 'proof_submitted' });
      }
    }, 'proof');
  };

  const handleValidate = () => {
    checkKycAndProceed(() => {
      if (transaction) {
        updateTransactionStatus(transaction.id, 'completed');
        setTransaction({ ...transaction, status: 'completed' });
      }
    }, 'validate');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={[styles.statusBanner, { backgroundColor: statusConfig.color + '20' }]}>
            <StatusIcon size={20} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>

          <View style={styles.exchangeCard}>
            <Text style={styles.cardTitle}>Exchange Details</Text>
            
            <View style={styles.exchangeRow}>
              <View style={styles.currencyInfo}>
                <Text style={styles.currencyFlag}>{giveInfo.flag}</Text>
                <View>
                  <Text style={styles.currencyLabel}>Sending</Text>
                  <Text style={styles.currencyAmount}>
                    {displayData.giveAmount.toLocaleString()} {displayData.giveCurrency}
                  </Text>
                </View>
              </View>

              <View style={styles.arrowDivider}>
                <View style={styles.arrow} />
              </View>

              <View style={styles.currencyInfo}>
                <Text style={styles.currencyFlag}>{getInfo.flag}</Text>
                <View>
                  <Text style={styles.currencyLabel}>Receiving</Text>
                  <Text style={styles.currencyAmount}>
                    {displayData.getAmount.toLocaleString()} {displayData.getCurrency}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.rateInfo}>
              <Text style={styles.rateLabel}>Rate</Text>
              <Text style={styles.rateValue}>1 {displayData.giveCurrency} = {displayData.rate.toFixed(4)} {displayData.getCurrency}</Text>
            </View>

            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>Payment Method</Text>
              <View style={styles.methodBadge}>
                <Text style={styles.methodText}>{displayData.paymentMethod}</Text>
              </View>
            </View>
          </View>

          <View style={styles.partiesCard}>
            <Text style={styles.cardTitle}>Participants</Text>
            
            <View style={styles.partyRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{displayData.userA.name ? displayData.userA.name[0] : 'U'}</Text>
              </View>
              <View style={styles.partyInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.partyName}>{getDisplayName(displayData.userA)}</Text>
                  {displayData.userA.kycStatus === 'verified' && (
                    <Shield size={14} color={colors.dark.secondary} />
                  )}
                </View>
                <Text style={styles.partyStats}>⭐ {displayData.userA.rating} • {displayData.userA.completedSwaps} swaps</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {displayData.userB.name && (
              <View style={styles.partyRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{displayData.userB.name[0]}</Text>
                </View>
                <View style={styles.partyInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.partyName}>{getDisplayName(displayData.userB)}</Text>
                    {displayData.userB.kycStatus === 'verified' && (
                      <Shield size={14} color={colors.dark.secondary} />
                    )}
                  </View>
                  <Text style={styles.partyStats}>⭐ {displayData.userB.rating} • {displayData.userB.completedSwaps} swaps</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.timelineCard}>
            <Text style={styles.cardTitle}>Transaction Timeline</Text>
            
            <View style={styles.timeline}>
              <TimelineItem
                icon={CheckCircle}
                title="Transaction Proposed"
                completed
                timestamp={new Date(displayData.createdAt).toLocaleString()}
              />
              <TimelineItem
                icon={CheckCircle}
                title="Accepted by Counterparty"
                completed={!!transaction && ['accepted', 'in_progress', 'proof_submitted', 'validated', 'completed'].includes(transaction.status)}
              />
              <TimelineItem
                icon={Clock}
                title="Payment in Progress"
                completed={!!transaction && ['in_progress', 'proof_submitted', 'validated', 'completed'].includes(transaction.status)}
              />
              <TimelineItem
                icon={AlertCircle}
                title="Proof Submitted"
                completed={!!transaction && ['proof_submitted', 'validated', 'completed'].includes(transaction.status)}
              />
              <TimelineItem
                icon={CheckCircle}
                title="Transaction Completed"
                completed={transaction?.status === 'completed'}
                isLast
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {(!transaction || transaction.status === 'proposed') && (
            <TouchableOpacity style={styles.actionButton} onPress={handleAcceptExchange}>
              <Text style={styles.actionButtonText}>Accept Exchange</Text>
            </TouchableOpacity>
          )}
          {transaction && transaction.status === 'accepted' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleStartProgress}>
              <Text style={styles.actionButtonText}>Start Payment</Text>
            </TouchableOpacity>
          )}
          {transaction && transaction.status === 'in_progress' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSubmitProof}>
              <Text style={styles.actionButtonText}>Submit Proof</Text>
            </TouchableOpacity>
          )}
          {transaction && transaction.status === 'proof_submitted' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleValidate}>
              <Text style={styles.actionButtonText}>Confirm Receipt</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.chatButton} onPress={handleOpenChat}>
            <MessageCircle size={20} color={colors.dark.text} />
            <Text style={styles.chatButtonText}>Open Chat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={showAuthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.authModalContent}>
            <Text style={styles.authModalTitle}>{t?.auth?.loginRequired || 'Login Required'}</Text>
            <Text style={styles.authModalMessage}>{t?.auth?.loginRequiredMessage || 'Please login to accept this exchange.'}</Text>
            <TouchableOpacity
              style={styles.authModalButton}
              onPress={() => {
                setShowAuthModal(false);
                router.push('/login');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.authModalButtonText}>{t?.auth?.login || 'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authModalButtonSecondary}
              onPress={() => {
                setShowAuthModal(false);
                router.push('/register');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.authModalButtonSecondaryText}>{t?.auth?.signup || 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showKycModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowKycModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.authModalContent}>
            <Text style={styles.authModalTitle}>{t?.auth?.verificationRequired || 'Verification Required'}</Text>
            <Text style={styles.authModalMessage}>{t?.auth?.verificationRequiredMsg || 'Please verify your account to accept this exchange.'}</Text>
            <TouchableOpacity
              style={styles.authModalButton}
              onPress={() => {
                setShowKycModal(false);
                router.push('/kyc-verification');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.authModalButtonText}>{t?.auth?.verifyAccount || 'Verify Account'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authModalButtonSecondary}
              onPress={() => setShowKycModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.authModalButtonSecondaryText}>{t?.auth?.later || 'Later'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TimelineItem({ icon: Icon, title, completed, timestamp, isLast }: {
  icon: any;
  title: string;
  completed: boolean;
  timestamp?: string;
  isLast?: boolean;
}) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineIcon, completed && styles.timelineIconCompleted]}>
          <Icon size={16} color={completed ? colors.dark.secondary : colors.dark.textSecondary} />
        </View>
        {!isLast && <View style={[styles.timelineLine, completed && styles.timelineLineCompleted]} />}
      </View>
      <View style={styles.timelineRight}>
        <Text style={[styles.timelineTitle, completed && styles.timelineTitleCompleted]}>
          {title}
        </Text>
        {timestamp && <Text style={styles.timelineTimestamp}>{timestamp}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  placeholder: {
    width: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  exchangeCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 16,
  },
  exchangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  currencyInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyFlag: {
    fontSize: 32,
  },
  currencyLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  currencyAmount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  arrowDivider: {
    paddingHorizontal: 12,
  },
  arrow: {
    width: 24,
    height: 2,
    backgroundColor: colors.dark.secondary,
  },
  rateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    marginBottom: 12,
  },
  rateLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
  },
  methodInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  methodBadge: {
    backgroundColor: colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
  },
  partiesCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  partyInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  partyStats: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 16,
  },
  timelineCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: colors.dark.secondary + '30',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: colors.dark.secondary,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.dark.textSecondary,
    marginBottom: 2,
  },
  timelineTitleCompleted: {
    color: colors.dark.text,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    gap: 12,
  },
  actionButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.dark.surface,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authModalContent: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  authModalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  authModalMessage: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  authModalButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  authModalButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  authModalButtonSecondary: {
    backgroundColor: colors.dark.surfaceLight,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  authModalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
});
