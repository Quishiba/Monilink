import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, MessageCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { getCurrencyInfo } from '@/constants/currencies';
import { useState } from 'react';
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
  const { offers, transactions, createTransaction, updateTransactionStatus, kycData } = useApp();

  const existingTransaction = transactions.find(tx => tx.id === id);
  const offer = offers.find(o => o.id === id);

  const [transaction, setTransaction] = useState(() => {
    if (existingTransaction) return existingTransaction;
    if (offer) return createTransaction(offer.id);
    return null;
  });

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.errorText}>Transaction not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  const giveInfo = getCurrencyInfo(transaction.giveCurrency);
  const getInfo = getCurrencyInfo(transaction.getCurrency);
  const statusConfig = STATUS_CONFIG[transaction.status];
  const StatusIcon = statusConfig.icon;

  const checkKycAndProceed = (action: () => void, actionName: string) => {
    if (kycData.status !== 'verified') {
      Alert.alert(
        'Vérification requise',
        'Veuillez vérifier votre identité pour continuer cet échange.',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Vérifier maintenant', 
            onPress: () => router.push('/kyc-verification')
          }
        ]
      );
      return;
    }
    action();
  };

  const handleAccept = () => {
    checkKycAndProceed(() => {
      updateTransactionStatus(transaction.id, 'accepted');
      setTransaction({ ...transaction, status: 'accepted' });
    }, 'accept');
  };

  const handleStartProgress = () => {
    checkKycAndProceed(() => {
      updateTransactionStatus(transaction.id, 'in_progress');
      setTransaction({ ...transaction, status: 'in_progress' });
    }, 'start');
  };

  const handleSubmitProof = () => {
    checkKycAndProceed(() => {
      updateTransactionStatus(transaction.id, 'proof_submitted');
      setTransaction({ ...transaction, status: 'proof_submitted' });
    }, 'proof');
  };

  const handleValidate = () => {
    checkKycAndProceed(() => {
      updateTransactionStatus(transaction.id, 'completed');
      setTransaction({ ...transaction, status: 'completed' });
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
                    {transaction.giveAmount.toLocaleString()} {transaction.giveCurrency}
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
                    {transaction.getAmount.toLocaleString()} {transaction.getCurrency}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.rateInfo}>
              <Text style={styles.rateLabel}>Rate</Text>
              <Text style={styles.rateValue}>1 {transaction.giveCurrency} = {transaction.rate.toFixed(4)} {transaction.getCurrency}</Text>
            </View>

            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>Payment Method</Text>
              <View style={styles.methodBadge}>
                <Text style={styles.methodText}>{transaction.paymentMethod}</Text>
              </View>
            </View>
          </View>

          <View style={styles.partiesCard}>
            <Text style={styles.cardTitle}>Participants</Text>
            
            <View style={styles.partyRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{transaction.userA.name[0]}</Text>
              </View>
              <View style={styles.partyInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.partyName}>{transaction.userA.name}</Text>
                  {transaction.userA.kycStatus === 'verified' && (
                    <Shield size={14} color={colors.dark.secondary} />
                  )}
                </View>
                <Text style={styles.partyStats}>⭐ {transaction.userA.rating} • {transaction.userA.completedSwaps} swaps</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.partyRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{transaction.userB.name[0]}</Text>
              </View>
              <View style={styles.partyInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.partyName}>{transaction.userB.name}</Text>
                  {transaction.userB.kycStatus === 'verified' && (
                    <Shield size={14} color={colors.dark.secondary} />
                  )}
                </View>
                <Text style={styles.partyStats}>⭐ {transaction.userB.rating} • {transaction.userB.completedSwaps} swaps</Text>
              </View>
            </View>
          </View>

          <View style={styles.timelineCard}>
            <Text style={styles.cardTitle}>Transaction Timeline</Text>
            
            <View style={styles.timeline}>
              <TimelineItem
                icon={CheckCircle}
                title="Transaction Proposed"
                completed
                timestamp={new Date(transaction.createdAt).toLocaleString()}
              />
              <TimelineItem
                icon={CheckCircle}
                title="Accepted by Counterparty"
                completed={['accepted', 'in_progress', 'proof_submitted', 'validated', 'completed'].includes(transaction.status)}
              />
              <TimelineItem
                icon={Clock}
                title="Payment in Progress"
                completed={['in_progress', 'proof_submitted', 'validated', 'completed'].includes(transaction.status)}
              />
              <TimelineItem
                icon={AlertCircle}
                title="Proof Submitted"
                completed={['proof_submitted', 'validated', 'completed'].includes(transaction.status)}
              />
              <TimelineItem
                icon={CheckCircle}
                title="Transaction Completed"
                completed={transaction.status === 'completed'}
                isLast
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {transaction.status === 'proposed' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleAccept}>
              <Text style={styles.actionButtonText}>Accept Exchange</Text>
            </TouchableOpacity>
          )}
          {transaction.status === 'accepted' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleStartProgress}>
              <Text style={styles.actionButtonText}>Start Payment</Text>
            </TouchableOpacity>
          )}
          {transaction.status === 'in_progress' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSubmitProof}>
              <Text style={styles.actionButtonText}>Submit Proof</Text>
            </TouchableOpacity>
          )}
          {transaction.status === 'proof_submitted' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleValidate}>
              <Text style={styles.actionButtonText}>Confirm Receipt</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.chatButton} onPress={() => router.push(`/chat/${transaction.id}`)}>
            <MessageCircle size={20} color={colors.dark.text} />
            <Text style={styles.chatButtonText}>Open Chat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
});
