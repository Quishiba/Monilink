import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Star, MapPin, Calendar, TrendingUp, Award } from 'lucide-react-native';
import colors from '@/constants/colors';
import { MOCK_USERS } from '@/mocks/users';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const user = MOCK_USERS.find(u => u.id === id) || MOCK_USERS[0];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{user.name[0]}</Text>
            </View>
            <View style={styles.nameContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user.name}</Text>
                {user.kycStatus === 'verified' && (
                  <View style={styles.verifiedBadge}>
                    <Shield size={16} color={colors.dark.secondary} />
                  </View>
                )}
              </View>
              <View style={styles.locationRow}>
                <MapPin size={14} color={colors.dark.textSecondary} />
                <Text style={styles.location}>{user.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgesContainer}>
            {user.badges.map(badge => (
              <View key={badge} style={styles.badge}>
                <Award size={14} color={colors.dark.secondary} />
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Star size={20} color={colors.dark.primary} />
              </View>
              <Text style={styles.statValue}>{user.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <TrendingUp size={20} color={colors.dark.secondary} />
              </View>
              <Text style={styles.statValue}>{user.completedSwaps}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Calendar size={20} color={colors.dark.primary} />
              </View>
              <Text style={styles.statValue}>{user.reviewCount}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Response Time</Text>
            <Text style={styles.cardValue}>{user.responseTime}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Member Since</Text>
            <Text style={styles.cardValue}>
              {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Preferred Currencies</Text>
            <View style={styles.currenciesContainer}>
              {user.preferredCurrencies.map(currency => (
                <View key={currency} style={styles.currencyTag}>
                  <Text style={styles.currencyTagText}>{currency}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Payment Methods</Text>
            <View style={styles.methodsContainer}>
              {user.paymentMethods.map(method => (
                <View key={method} style={styles.methodTag}>
                  <Text style={styles.methodTagText}>{method}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.trustCard}>
            <Shield size={24} color={colors.dark.secondary} />
            <View style={styles.trustContent}>
              <Text style={styles.trustTitle}>Verified User</Text>
              <Text style={styles.trustDescription}>
                This user has completed identity verification and has a strong reputation on Monilink.
              </Text>
            </View>
          </View>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  nameContainer: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 15,
    color: colors.dark.textSecondary,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.dark.secondary + '40',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  cardTitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  currenciesContainer: {
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
  currencyTagText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.primary,
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodTag: {
    backgroundColor: colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  methodTagText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: colors.dark.secondary + '20',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark.secondary + '40',
  },
  trustContent: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
    marginBottom: 6,
  },
  trustDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
});
