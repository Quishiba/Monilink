import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Settings, Bell, HelpCircle, LogOut, Globe, ChevronRight, Check } from 'lucide-react-native';
import colors from '@/constants/colors';
import { getCurrentUser } from '@/mocks/users';
import { useApp } from '@/context/AppContext';
import { Language } from '@/constants/translations';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const currentUser = getCurrentUser();
  const router = useRouter();
  const { kycData, language, t, changeLanguage } = useApp();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const getKycStatusLabel = () => {
    switch (kycData.status) {
      case 'not_verified':
        return t.profile.notVerified;
      case 'pending':
        return t.profile.pending;
      case 'verified':
        return t.profile.verified;
      case 'rejected':
        return t.profile.rejected;
      default:
        return t.profile.notVerified;
    }
  };

  const getKycStatusColor = () => {
    switch (kycData.status) {
      case 'verified':
        return colors.dark.success;
      case 'pending':
        return colors.dark.warning;
      case 'rejected':
        return colors.dark.error;
      default:
        return colors.dark.textSecondary;
    }
  };

  const handleLanguageChange = async (lang: Language) => {
    await changeLanguage(lang);
    setShowLanguageModal(false);
  };

  const menuItems = [
    { icon: Settings, label: t.profile.settings, onPress: () => {} },
    { icon: Bell, label: t.profile.notifications, onPress: () => {} },
    { icon: HelpCircle, label: t.profile.help, onPress: () => {} },
    { icon: LogOut, label: t.profile.logout, onPress: () => {}, color: '#EF4444' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.profile.title}</Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarTextLarge}>{currentUser.name[0]}</Text>
            </View>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.location}>{currentUser.location}</Text>
            
            {currentUser.kycStatus === 'verified' && (
              <View style={styles.verifiedBadge}>
                <Shield size={16} color={colors.dark.secondary} />
                <Text style={styles.verifiedText}>{t.profile.verifiedAccount}</Text>
              </View>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentUser.rating}</Text>
                <Text style={styles.statLabel}>{t.profile.rating}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentUser.completedSwaps}</Text>
                <Text style={styles.statLabel}>{t.profile.swaps}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentUser.successRate}%</Text>
                <Text style={styles.statLabel}>{t.profile.success}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.kycStatus}</Text>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('/kyc-verification')}
              activeOpacity={0.7}
            >
              <View style={styles.kycRow}>
                <View style={styles.kycLeft}>
                  <Shield size={20} color={getKycStatusColor()} />
                  <View>
                    <Text style={styles.kycLabel}>KYC</Text>
                    <Text style={[styles.kycStatus, { color: getKycStatusColor() }]}>
                      {getKycStatusLabel()}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.dark.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.language}</Text>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => setShowLanguageModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.languageRow}>
                <View style={styles.languageLeft}>
                  <Globe size={20} color={colors.dark.text} />
                  <Text style={styles.languageText}>
                    {language === 'fr' ? 'Français' : 'English'}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.dark.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.paymentMethods}</Text>
            <View style={styles.card}>
              {currentUser.paymentMethods.map((method: string, index: number) => (
                <View key={method}>
                  <View style={styles.methodRow}>
                    <Text style={styles.methodText}>{method}</Text>
                  </View>
                  {index < currentUser.paymentMethods.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.preferredCurrencies}</Text>
            <View style={styles.card}>
              <View style={styles.currencyRow}>
                {currentUser.preferredCurrencies.map((currency: string) => (
                  <View key={currency} style={styles.currencyTag}>
                    <Text style={styles.currencyText}>{currency}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.menu}</Text>
            <View style={styles.card}>
              {menuItems.map((item, index) => (
                <View key={item.label}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <item.icon size={20} color={item.color || colors.dark.text} />
                    <Text style={[styles.menuLabel, item.color && { color: item.color }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                  {index < menuItems.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.profile.language}</Text>
            
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleLanguageChange('fr')}
              activeOpacity={0.7}
            >
              <Text style={styles.languageOptionText}>Français</Text>
              {language === 'fr' && <Check size={20} color={colors.dark.secondary} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleLanguageChange('en')}
              activeOpacity={0.7}
            >
              <Text style={styles.languageOptionText}>English</Text>
              {language === 'en' && <Check size={20} color={colors.dark.secondary} />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarTextLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.dark.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  methodRow: {
    paddingVertical: 8,
  },
  methodText: {
    fontSize: 15,
    color: colors.dark.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 4,
  },
  currencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyTag: {
    backgroundColor: colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  menuLabel: {
    fontSize: 15,
    color: colors.dark.text,
  },
  kycRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  kycLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kycLabel: {
    fontSize: 15,
    color: colors.dark.text,
    fontWeight: '600' as const,
  },
  kycStatus: {
    fontSize: 13,
    marginTop: 2,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageText: {
    fontSize: 15,
    color: colors.dark.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  languageOptionText: {
    fontSize: 16,
    color: colors.dark.text,
  },
});
