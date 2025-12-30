import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function ProfilePrivacyScreen() {
  const router = useRouter();
  const { t } = useApp();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.profile.privacyPolicy}</Text>
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
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              Chez MoniLink, nous prenons la protection de vos données personnelles très au sérieux. 
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons 
              vos informations.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Données collectées</Text>
            <Text style={styles.paragraph}>
              Nous collectons les informations suivantes :
            </Text>
            <Text style={styles.bulletPoint}>• Informations d&apos;identification (nom, prénom, date de naissance)</Text>
            <Text style={styles.bulletPoint}>• Coordonnées (email, téléphone, adresse)</Text>
            <Text style={styles.bulletPoint}>• Documents d&apos;identité (pour la vérification KYC)</Text>
            <Text style={styles.bulletPoint}>• Historique des transactions</Text>
            <Text style={styles.bulletPoint}>• Données de navigation et d&apos;utilisation</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Utilisation des données</Text>
            <Text style={styles.paragraph}>
              Vos données sont utilisées pour :
            </Text>
            <Text style={styles.bulletPoint}>• Vérifier votre identité (conformité KYC/AML)</Text>
            <Text style={styles.bulletPoint}>• Faciliter les échanges entre utilisateurs</Text>
            <Text style={styles.bulletPoint}>• Prévenir la fraude et garantir la sécurité</Text>
            <Text style={styles.bulletPoint}>• Améliorer nos services</Text>
            <Text style={styles.bulletPoint}>• Communiquer avec vous</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Vérification KYC</Text>
            <Text style={styles.paragraph}>
              Dans le cadre de notre processus de vérification d&apos;identité, nous collectons et stockons :
            </Text>
            <Text style={styles.bulletPoint}>• Copies de documents d&apos;identité officiels</Text>
            <Text style={styles.bulletPoint}>• Photos selfie avec document</Text>
            <Text style={styles.bulletPoint}>• Preuves d&apos;adresse</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              Ces documents sont chiffrés et stockés de manière sécurisée. Seul le personnel autorisé 
              peut y accéder dans le cadre de la vérification.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Partage des données</Text>
            <Text style={styles.paragraph}>
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
            </Text>
            <Text style={styles.bulletPoint}>• Les autres utilisateurs (informations de profil public)</Text>
            <Text style={styles.bulletPoint}>• Les prestataires de services (hébergement, paiement)</Text>
            <Text style={styles.bulletPoint}>• Les autorités légales (sur demande officielle)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Sécurité des données</Text>
            <Text style={styles.paragraph}>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger 
              vos données :
            </Text>
            <Text style={styles.bulletPoint}>• Chiffrement des données sensibles</Text>
            <Text style={styles.bulletPoint}>• Accès restreint aux données personnelles</Text>
            <Text style={styles.bulletPoint}>• Surveillance et audits réguliers</Text>
            <Text style={styles.bulletPoint}>• Formation du personnel à la protection des données</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Durée de conservation</Text>
            <Text style={styles.paragraph}>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour :
            </Text>
            <Text style={styles.bulletPoint}>• Fournir nos services</Text>
            <Text style={styles.bulletPoint}>• Respecter nos obligations légales (5 ans minimum pour KYC)</Text>
            <Text style={styles.bulletPoint}>• Résoudre les litiges</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Vos droits (RGPD)</Text>
            <Text style={styles.paragraph}>
              Conformément au RGPD, vous disposez des droits suivants :
            </Text>
            <Text style={styles.bulletPoint}>• Droit d&apos;accès à vos données</Text>
            <Text style={styles.bulletPoint}>• Droit de rectification</Text>
            <Text style={styles.bulletPoint}>• Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)</Text>
            <Text style={styles.bulletPoint}>• Droit à la limitation du traitement</Text>
            <Text style={styles.bulletPoint}>• Droit à la portabilité</Text>
            <Text style={styles.bulletPoint}>• Droit d&apos;opposition</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Cookies et technologies similaires</Text>
            <Text style={styles.paragraph}>
              Nous utilisons des cookies pour améliorer votre expérience, analyser l&apos;utilisation de 
              l&apos;application et personnaliser le contenu. Vous pouvez gérer vos préférences en matière 
              de cookies dans les paramètres.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Modifications de la politique</Text>
            <Text style={styles.paragraph}>
              Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications 
              significatives vous seront notifiées par email ou via l&apos;application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Contact</Text>
            <Text style={styles.paragraph}>
              Pour toute question concernant vos données personnelles ou pour exercer vos droits :
            </Text>
            <Text style={styles.contactText}>privacy@monilink.app</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              Délégué à la Protection des Données :
            </Text>
            <Text style={styles.contactText}>dpo@monilink.app</Text>
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
