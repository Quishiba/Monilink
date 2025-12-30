import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, TrendingUp, Shield, Clock } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { getCurrencyInfo } from '@/constants/currencies';
import { Offer } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { offers, t } = useApp();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{t.home.title}</Text>
            <Text style={styles.headerSubtitle}>{t.home.subtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/create-offer')}
          >
            <Plus size={24} color={colors.dark.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.dark.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.home.searchPlaceholder}
            placeholderTextColor={colors.dark.textSecondary}
          />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp size={20} color={colors.dark.secondary} />
              <Text style={styles.statValue}>4.8%</Text>
              <Text style={styles.statLabel}>{t.home.avgExchangeRate}</Text>
            </View>
            <View style={styles.statCard}>
              <Shield size={20} color={colors.dark.secondary} />
              <Text style={styles.statValue}>99.2%</Text>
              <Text style={styles.statLabel}>{t.home.successRate}</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={20} color={colors.dark.secondary} />
              <Text style={styles.statValue}>12 min</Text>
              <Text style={styles.statLabel}>{t.home.avgTime}</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.home.activeOffers}</Text>
            <Text style={styles.sectionCount}>{offers.length} {t.home.available}</Text>
          </View>

          {offers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const router = useRouter();
  const giveInfo = getCurrencyInfo(offer.giveCurrency);
  const getInfo = getCurrencyInfo(offer.getCurrency);
  
  const hoursAgo = Math.floor((Date.now() - new Date(offer.createdAt).getTime()) / (1000 * 60 * 60));
  const timeText = hoursAgo < 1 ? 'Just now' : `${hoursAgo}h ago`;

  return (
    <TouchableOpacity style={styles.offerCard} onPress={() => router.push(`/transaction/${offer.id}`)} activeOpacity={0.7}>
      <View style={styles.offerHeader}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => router.push(`/profile/${offer.user.id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{offer.user.name[0]}</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{offer.user.name}</Text>
              {offer.user.kycStatus === 'verified' && (
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color={colors.dark.secondary} />
                </View>
              )}
            </View>
            <View style={styles.userStats}>
              <Text style={styles.rating}>⭐ {offer.user.rating}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.swapCount}>{offer.user.completedSwaps} swaps</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.timeAgo}>{timeText}</Text>
      </View>

      <View style={styles.exchangeContainer}>
        <View style={styles.currencyBox}>
          <Text style={styles.currencyFlag}>{giveInfo.flag}</Text>
          <View>
            <Text style={styles.currencyCode}>{offer.giveCurrency}</Text>
            <Text style={styles.amount}>{offer.giveAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <View style={styles.arrow} />
          <Text style={styles.rateText}>1:{offer.rate.toFixed(2)}</Text>
        </View>

        <View style={styles.currencyBox}>
          <Text style={styles.currencyFlag}>{getInfo.flag}</Text>
          <View>
            <Text style={styles.currencyCode}>{offer.getCurrency}</Text>
            <Text style={styles.amount}>{offer.getAmount.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.offerFooter}>
        <View style={styles.methodTags}>
          {offer.paymentMethods.slice(0, 2).map(method => (
            <View key={method} style={styles.methodTag}>
              <Text style={styles.methodText}>{method}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.location}>{offer.location}</Text>
      </View>

      {offer.comment && (
        <View style={styles.commentContainer}>
          <Text style={styles.comment}>{offer.comment}</Text>
        </View>
      )}
    </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.dark.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  sectionCount: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  offerCard: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  separator: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  swapCount: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  timeAgo: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  exchangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currencyBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.dark.surfaceLight,
    padding: 12,
    borderRadius: 12,
  },
  currencyFlag: {
    fontSize: 24,
  },
  currencyCode: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
    marginBottom: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  arrowContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  arrow: {
    width: 20,
    height: 2,
    backgroundColor: colors.dark.secondary,
  },
  rateText: {
    fontSize: 11,
    color: colors.dark.secondary,
    fontWeight: '600' as const,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodTags: {
    flexDirection: 'row',
    gap: 8,
  },
  methodTag: {
    backgroundColor: colors.dark.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  methodText: {
    fontSize: 12,
    color: colors.dark.secondary,
    fontWeight: '500' as const,
  },
  location: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  commentContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  comment: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    fontStyle: 'italic' as const,
  },
});
