import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { getCurrencyInfo } from '@/constants/currencies';

export default function TransactionsScreen() {
  const router = useRouter();
  const { offers } = useApp();

  const transactions = offers.slice(0, 5).map((offer, index) => ({
    id: offer.id,
    offer,
    status: ['pending', 'in_progress', 'completed', 'completed', 'pending'][index] as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    createdAt: offer.createdAt,
  }));

  const statusConfig = {
    pending: { color: colors.dark.secondary, icon: Clock, label: 'Pending' },
    in_progress: { color: '#3B82F6', icon: AlertCircle, label: 'In Progress' },
    completed: { color: '#10B981', icon: CheckCircle, label: 'Completed' },
    cancelled: { color: '#EF4444', icon: XCircle, label: 'Cancelled' },
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Transactions</Text>
          <Text style={styles.headerSubtitle}>{transactions.length} total</Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {transactions.map(transaction => {
            const giveInfo = getCurrencyInfo(transaction.offer.giveCurrency);
            const getInfo = getCurrencyInfo(transaction.offer.getCurrency);
            const config = statusConfig[transaction.status];
            const StatusIcon = config.icon;

            return (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() => router.push(`/transaction/${transaction.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{transaction.offer.user.name[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>{transaction.offer.user.name}</Text>
                      <Text style={styles.date}>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
                    <StatusIcon size={14} color={config.color} />
                    <Text style={[styles.statusText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.exchangeRow}>
                  <Text style={styles.currencyFlag}>{giveInfo.flag}</Text>
                  <Text style={styles.amount}>
                    {transaction.offer.giveAmount.toLocaleString()} {transaction.offer.giveCurrency}
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                  <Text style={styles.currencyFlag}>{getInfo.flag}</Text>
                  <Text style={styles.amount}>
                    {transaction.offer.getAmount.toLocaleString()} {transaction.offer.getCurrency}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  transactionCard: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  exchangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyFlag: {
    fontSize: 20,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  arrow: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
});
