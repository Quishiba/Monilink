import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, TrendingUp, Shield, Clock, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { getCurrencyInfo } from '@/constants/currencies';
import { Offer, Currency } from '@/types';
import { useState, useMemo } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { offers, t, isAuthenticated, kycData } = useApp();
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  const averageRates = useMemo(() => {
    const rateMap = new Map<string, { total: number; count: number }>();
    
    offers.forEach(offer => {
      const pair = `${offer.giveCurrency}-${offer.getCurrency}`;
      const existing = rateMap.get(pair) || { total: 0, count: 0 };
      rateMap.set(pair, {
        total: existing.total + offer.rate,
        count: existing.count + 1,
      });
    });

    const rates: { pair: string; rate: number; from: Currency; to: Currency }[] = [];
    rateMap.forEach((value, pair) => {
      const [from, to] = pair.split('-') as [Currency, Currency];
      rates.push({
        pair,
        rate: value.total / value.count,
        from,
        to,
      });
    });

    return rates;
  }, [offers]);

  const mainRate = averageRates.find(r => r.from === 'EUR' && r.to === 'XAF') || averageRates[0];

  const handleCreateOffer = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else if (kycData.status !== 'verified') {
      setShowKycModal(true);
    } else {
      router.push('/create-offer');
    }
  };

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
            onPress={handleCreateOffer}
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
          {mainRate && (
            <TouchableOpacity
              style={styles.rateCard}
              onPress={() => setShowRatesModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rateHeader}>
                <Text style={styles.rateLabel}>{t.home.avgExchangeRate}</Text>
                <TrendingUp size={16} color={colors.dark.secondary} />
              </View>
              <Text style={styles.rateValue}>
                1 : {mainRate.rate.toFixed(0)}
              </Text>
              <Text style={styles.rateSubtext}>
                1 {mainRate.from} = {mainRate.rate.toFixed(0)} {mainRate.to}
              </Text>
              <View style={styles.rateDivider} />
              <View style={styles.avgTimeRow}>
                <Clock size={16} color={colors.dark.secondary} />
                <View style={styles.avgTimeContent}>
                  <Text style={styles.avgTimeLabel}>{t.home.avgTime}</Text>
                  <Text style={styles.avgTimeValue}>≈ 15 min</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}



          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.home.activeOffers}</Text>
            <Text style={styles.sectionCount}>{offers.length} {t.home.available}</Text>
          </View>

          {offers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showRatesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRatesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.home.avgExchangeRate}</Text>
              <TouchableOpacity onPress={() => setShowRatesModal(false)}>
                <X size={24} color={colors.dark.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.ratesList}>
              {averageRates.map((rate, index) => {
                const fromInfo = getCurrencyInfo(rate.from);
                const toInfo = getCurrencyInfo(rate.to);
                return (
                  <View key={index} style={styles.rateItem}>
                    <View style={styles.rateItemCurrencies}>
                      <Text style={styles.rateItemFlag}>{fromInfo.flag}</Text>
                      <Text style={styles.rateItemText}>
                        1 {rate.from} = {rate.rate.toFixed(2)} {rate.to}
                      </Text>
                      <Text style={styles.rateItemFlag}>{toInfo.flag}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAuthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.authModalContent}>
            <Text style={styles.authModalTitle}>{t.auth.loginRequired}</Text>
            <Text style={styles.authModalMessage}>{t.auth.loginRequiredMessage}</Text>
            <TouchableOpacity
              style={styles.authModalButton}
              onPress={() => {
                setShowAuthModal(false);
                router.push('/login');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.authModalButtonText}>{t.auth.login}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authModalButtonSecondary}
              onPress={() => {
                setShowAuthModal(false);
                router.push('/register');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.authModalButtonSecondaryText}>{t.auth.signup}</Text>
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
            <Text style={styles.authModalTitle}>{t.auth.verificationRequired}</Text>
            <Text style={styles.authModalMessage}>{t.auth.verificationRequiredMsg}</Text>
            <TouchableOpacity
              style={styles.authModalButton}
              onPress={() => {
                setShowKycModal(false);
                router.push('/kyc-verification');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.authModalButtonText}>{t.auth.verifyAccount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authModalButtonSecondary}
              onPress={() => setShowKycModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.authModalButtonSecondaryText}>{t.auth.later}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const router = useRouter();
  const giveInfo = getCurrencyInfo(offer.giveCurrency);
  const getInfo = getCurrencyInfo(offer.getCurrency);
  
  const hoursAgo = Math.floor((Date.now() - new Date(offer.createdAt).getTime()) / (1000 * 60 * 60));
  const timeText = hoursAgo < 1 ? 'Just now' : `${hoursAgo}h ago`;
  
  const getDisplayName = (user: typeof offer.user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName.charAt(0)}.`;
    }
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return user.name;
  };

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
              <Text style={styles.userName}>{getDisplayName(offer.user)}</Text>
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
  rateCard: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rateLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    fontWeight: '600' as const,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  rateSubtext: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  rateDivider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginTop: 16,
    marginBottom: 12,
  },
  avgTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avgTimeContent: {
    flex: 1,
  },
  avgTimeLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginBottom: 2,
  },
  avgTimeValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.dark.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  ratesList: {
    paddingHorizontal: 20,
  },
  rateItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  rateItemCurrencies: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rateItemFlag: {
    fontSize: 24,
  },
  rateItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.dark.text,
    fontWeight: '600' as const,
  },
  authModalContent: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
    marginTop: 'auto',
    marginBottom: 'auto',
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
