import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function ProfileTermsScreen() {
  const router = useRouter();
  const { t } = useApp();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.profile.termsOfService}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.section}>
            <Text style={styles.updateDate}>Dernière mise à jour: 4 janvier 2026</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Objet de la plateforme</Text>
            <Text style={styles.paragraph}>
              MoniLink est une plateforme numérique dont l&apos;objet est de mettre en relation des utilisateurs souhaitant échanger des devises entre eux.
            </Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              MoniLink n&apos;est ni une banque, ni un établissement de paiement, ni un prestataire de services financiers. La plateforme n&apos;intervient pas directement dans les transferts d&apos;argent entre les utilisateurs.
            </Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              MoniLink agit exclusivement comme :
            </Text>
            <Text style={styles.bulletPoint}>• une plateforme de mise en relation,</Text>
            <Text style={styles.bulletPoint}>• un outil de communication sécurisé,</Text>
            <Text style={styles.bulletPoint}>• et un intermédiaire d&apos;arbitrage en cas de litige, lorsque cela est possible.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Accès au service</Text>
            <Text style={styles.paragraph}>
              L&apos;accès à certaines fonctionnalités de MoniLink nécessite :
            </Text>
            <Text style={styles.bulletPoint}>• la création d&apos;un compte utilisateur,</Text>
            <Text style={styles.bulletPoint}>• la fourniture d&apos;informations exactes et à jour,</Text>
            <Text style={styles.bulletPoint}>• et, pour certaines actions, la vérification de l&apos;identité (KYC).</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              MoniLink se réserve le droit de restreindre ou suspendre l&apos;accès à un utilisateur en cas de non-respect des présentes CGU.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Rôle et responsabilités de MoniLink</Text>
            <Text style={styles.paragraph}>
              MoniLink :
            </Text>
            <Text style={styles.bulletPoint}>• ne détient jamais les fonds des utilisateurs,</Text>
            <Text style={styles.bulletPoint}>• ne garantit pas l&apos;exécution effective d&apos;un échange,</Text>
            <Text style={styles.bulletPoint}>• ne fixe pas les taux de change proposés par les utilisateurs,</Text>
            <Text style={styles.bulletPoint}>• n&apos;est pas partie au contrat d&apos;échange conclu entre utilisateurs.</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              Les échanges sont réalisés sous la seule responsabilité des utilisateurs concernés.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Responsabilités des utilisateurs</Text>
            <Text style={styles.paragraph}>
              Chaque utilisateur s&apos;engage à :
            </Text>
            <Text style={styles.bulletPoint}>• fournir des informations exactes,</Text>
            <Text style={styles.bulletPoint}>• respecter les lois applicables (notamment en matière de change, fiscalité et lutte contre la fraude),</Text>
            <Text style={styles.bulletPoint}>• n&apos;utiliser la plateforme qu&apos;à des fins licites,</Text>
            <Text style={styles.bulletPoint}>• honorer ses engagements lors d&apos;un échange accepté.</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              Toute tentative de fraude, de manipulation ou d&apos;abus pourra entraîner la suspension ou la suppression du compte.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Vérification d&apos;identité (KYC)</Text>
            <Text style={styles.paragraph}>
              Afin de renforcer la sécurité et la confiance entre utilisateurs, MoniLink peut exiger une vérification d&apos;identité avant l&apos;accès à certaines fonctionnalités, notamment l&apos;acceptation ou la finalisation d&apos;un échange.
            </Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              La vérification d&apos;identité ne constitue en aucun cas une garantie financière sur les échanges effectués.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Litiges et arbitrage</Text>
            <Text style={styles.paragraph}>
              En cas de litige entre utilisateurs, MoniLink peut :
            </Text>
            <Text style={styles.bulletPoint}>• analyser les éléments fournis (preuves, messages, historique),</Text>
            <Text style={styles.bulletPoint}>• proposer une solution d&apos;arbitrage non contraignante.</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              La décision finale concernant un échange reste toutefois sous la responsabilité des utilisateurs, sauf disposition contraire imposée par la loi.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Suspension et résiliation</Text>
            <Text style={styles.paragraph}>
              MoniLink se réserve le droit de :
            </Text>
            <Text style={styles.bulletPoint}>• suspendre temporairement un compte,</Text>
            <Text style={styles.bulletPoint}>• résilier définitivement un compte,</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              en cas de violation des CGU, de comportement frauduleux ou de risque pour la communauté.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Limitation de responsabilité</Text>
            <Text style={styles.paragraph}>
              Dans les limites autorisées par la loi :
            </Text>
            <Text style={styles.bulletPoint}>• MoniLink ne saurait être tenue responsable des pertes financières résultant d&apos;un échange entre utilisateurs,</Text>
            <Text style={styles.bulletPoint}>• ni des retards, erreurs ou inexécutions imputables aux utilisateurs ou à des tiers.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Modification des CGU</Text>
            <Text style={styles.paragraph}>
              MoniLink peut modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Droit applicable</Text>
            <Text style={styles.paragraph}>
              Les présentes CGU sont régies par le droit applicable dans le pays d&apos;établissement de MoniLink, sous réserve des règles impératives du pays de résidence de l&apos;utilisateur.
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  updateDate: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    fontStyle: 'italic' as const,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 22,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 22,
    marginLeft: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.dark.secondary,
    marginTop: 8,
  },
});
