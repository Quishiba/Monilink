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
            <Text style={styles.updateDate}>Dernière mise à jour: 1er janvier 2024</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptation des conditions</Text>
            <Text style={styles.paragraph}>
              En utilisant MoniLink, vous acceptez d&apos;être lié par ces Conditions Générales d&apos;Utilisation. 
              Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description du service</Text>
            <Text style={styles.paragraph}>
              MoniLink est une plateforme de mise en relation permettant aux utilisateurs d&apos;échanger 
              des devises entre particuliers. Nous ne sommes pas une institution financière et n&apos;effectuons 
              aucune transaction directement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Vérification d&apos;identité (KYC)</Text>
            <Text style={styles.paragraph}>
              Pour des raisons de sécurité et de conformité réglementaire, nous exigeons que tous les 
              utilisateurs souhaitant effectuer des transactions vérifient leur identité. Cette vérification 
              comprend la fourniture de documents d&apos;identité officiels et d&apos;une preuve d&apos;adresse.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Utilisation du service</Text>
            <Text style={styles.paragraph}>
              Vous vous engagez à :
            </Text>
            <Text style={styles.bulletPoint}>• Fournir des informations exactes et à jour</Text>
            <Text style={styles.bulletPoint}>• Ne pas utiliser le service à des fins illégales</Text>
            <Text style={styles.bulletPoint}>• Respecter les autres utilisateurs</Text>
            <Text style={styles.bulletPoint}>• Ne pas créer de faux comptes</Text>
            <Text style={styles.bulletPoint}>• Honorer vos engagements d&apos;échange</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Transactions</Text>
            <Text style={styles.paragraph}>
              Les transactions sont effectuées directement entre utilisateurs. MoniLink agit uniquement 
              comme intermédiaire de mise en relation. Nous ne sommes pas responsables des litiges entre 
              utilisateurs, mais nous proposons un système de médiation.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Frais</Text>
            <Text style={styles.paragraph}>
              MoniLink peut facturer des frais de service pour certaines fonctionnalités. Ces frais seront 
              clairement indiqués avant toute transaction.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Suspension et résiliation</Text>
            <Text style={styles.paragraph}>
              Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation 
              de ces conditions, d&apos;activité suspecte ou pour toute autre raison jugée nécessaire.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Limitation de responsabilité</Text>
            <Text style={styles.paragraph}>
              MoniLink n&apos;est pas responsable des pertes financières, des retards, des fraudes ou de tout 
              autre dommage résultant de l&apos;utilisation du service ou des transactions entre utilisateurs.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Modifications des conditions</Text>
            <Text style={styles.paragraph}>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications 
              seront effectives dès leur publication sur l&apos;application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Contact</Text>
            <Text style={styles.paragraph}>
              Pour toute question concernant ces conditions, veuillez nous contacter à :
            </Text>
            <Text style={styles.contactText}>legal@monilink.app</Text>
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
