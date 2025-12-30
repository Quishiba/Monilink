import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function ProfileEvaluationScreen() {
  const router = useRouter();
  const { currentUser, t } = useApp();

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.dark.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.profile.evaluation}</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t.auth.loginRequired}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const reviews = [
    {
      id: '1',
      fromUser: 'Marie D.',
      rating: 5,
      comment: 'Transaction rapide et professionnelle. Je recommande !',
      date: '2024-01-15',
    },
    {
      id: '2',
      fromUser: 'Ahmed K.',
      rating: 5,
      comment: 'Excellente communication, très fiable.',
      date: '2024-01-12',
    },
    {
      id: '3',
      fromUser: 'Sophie L.',
      rating: 4,
      comment: 'Bonne transaction, juste un peu de délai.',
      date: '2024-01-08',
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.profile.evaluation}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.rating}</Text>
              <Text style={styles.statLabel}>{t.profile.averageRating}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.completedSwaps}</Text>
              <Text style={styles.statLabel}>{t.profile.totalExchanges}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.reviewCount}</Text>
              <Text style={styles.statLabel}>{t.profile.receivedReviews}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.receivedReviews}</Text>
            
            {reviews.map((review, index) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{review.fromUser[0]}</Text>
                  </View>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{review.fromUser}</Text>
                    <View style={styles.ratingRow}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          color={i < review.rating ? colors.dark.secondary : colors.dark.border}
                          fill={i < review.rating ? colors.dark.secondary : 'transparent'}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Comment fonctionne l&apos;évaluation ?</Text>
            <Text style={styles.infoText}>
              Après chaque transaction terminée, les deux parties peuvent s&apos;évaluer mutuellement. 
              Les notes contribuent à votre réputation sur la plateforme et aident les autres utilisateurs 
              à décider avec qui échanger.
            </Text>
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.dark.border,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'center',
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
  reviewCard: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
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
