import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function ProfileInfoScreen() {
  const router = useRouter();
  const { kycData, currentUser, t } = useApp();

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.dark.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.profile.information}</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t.auth.loginRequired}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.profile.information}</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.profile.personalInfo}</Text>
              
              <View style={styles.card}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t.profile.firstName}</Text>
                  <TextInput
                    style={styles.input}
                    value={kycData.firstName || currentUser.name.split(' ')[0]}
                    placeholder={t.profile.firstName}
                    placeholderTextColor={colors.dark.textSecondary}
                    editable={false}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t.profile.lastName}</Text>
                  <TextInput
                    style={styles.input}
                    value={kycData.lastName || currentUser.name.split(' ')[1] || ''}
                    placeholder={t.profile.lastName}
                    placeholderTextColor={colors.dark.textSecondary}
                    editable={false}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t.profile.dateOfBirth || 'Date of Birth'}</Text>
                  <TextInput
                    style={styles.input}
                    value={kycData.dateOfBirth}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={colors.dark.textSecondary}
                    editable={false}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Phone size={16} color={colors.dark.textSecondary} />
                    <Text style={styles.label}>{t.profile.phone}</Text>
                  </View>
                  <View style={styles.phoneRow}>
                    <TextInput
                      style={styles.input}
                      value={kycData.phone}
                      placeholder="+33 6 12 34 56 78"
                      placeholderTextColor={colors.dark.textSecondary}
                      editable={false}
                    />
                    {kycData.phoneVerified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Mail size={16} color={colors.dark.textSecondary} />
                    <Text style={styles.label}>{t.profile.email}</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value="user@example.com"
                    placeholder="email@example.com"
                    placeholderTextColor={colors.dark.textSecondary}
                    editable={false}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <MapPin size={16} color={colors.dark.textSecondary} />
                    <Text style={styles.label}>{t.profile.address}</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={kycData.address ? `${kycData.address}\n${kycData.city} ${kycData.postalCode}\n${kycData.country}` : ''}
                    placeholder="123 rue Example, 75001 Paris, France"
                    placeholderTextColor={colors.dark.textSecondary}
                    multiline
                    numberOfLines={3}
                    editable={false}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.profile.kycStatus}</Text>
              
              <View style={styles.card}>
                <View style={styles.kycStatusRow}>
                  <Text style={styles.kycLabel}>Statut</Text>
                  <Text style={[styles.kycStatus, { color: getKycStatusColor() }]}>
                    {getKycStatusLabel()}
                  </Text>
                </View>

                {kycData.status !== 'verified' && (
                  <>
                    <View style={styles.divider} />
                    <TouchableOpacity
                      style={styles.verifyButton}
                      onPress={() => router.push('/kyc-verification')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.verifyButtonText}>{t.profile.verifyIdentity}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  flex: {
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
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
  inputGroup: {
    paddingVertical: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
  },
  input: {
    fontSize: 15,
    color: colors.dark.text,
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 14,
    color: colors.dark.success,
    fontWeight: '700' as const,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 8,
  },
  kycStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  kycLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  kycStatus: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  verifyButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.dark.textSecondary,
  },
});
