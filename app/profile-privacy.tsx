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
            <Text style={styles.updateDate}>Dernière mise à jour: 4 janvier 2026</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              MoniLink attache une importance particulière à la protection des données personnelles de ses utilisateurs et s&apos;engage à les traiter de manière légale, loyale et transparente.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Données collectées</Text>
            <Text style={styles.paragraph}>
              MoniLink peut collecter les données suivantes :
            </Text>
            <Text style={[styles.paragraph, { marginTop: 12, fontWeight: '600' }]}>
              a) Données d&apos;identification
            </Text>
            <Text style={styles.bulletPoint}>• nom, prénom,</Text>
            <Text style={styles.bulletPoint}>• numéro de téléphone,</Text>
            <Text style={styles.bulletPoint}>• adresse email,</Text>
            <Text style={styles.bulletPoint}>• date de naissance.</Text>
            <Text style={[styles.paragraph, { marginTop: 12, fontWeight: '600' }]}>
              b) Données de vérification (KYC)
            </Text>
            <Text style={styles.bulletPoint}>• document d&apos;identité,</Text>
            <Text style={styles.bulletPoint}>• selfie avec document,</Text>
            <Text style={styles.bulletPoint}>• justificatif de domicile.</Text>
            <Text style={[styles.paragraph, { marginTop: 12, fontWeight: '600' }]}>
              c) Données d&apos;utilisation
            </Text>
            <Text style={styles.bulletPoint}>• historique des annonces et échanges,</Text>
            <Text style={styles.bulletPoint}>• messages échangés via la plateforme,</Text>
            <Text style={styles.bulletPoint}>• données techniques (logs, IP, appareil).</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Finalités du traitement</Text>
            <Text style={styles.paragraph}>
              Les données sont collectées afin de :
            </Text>
            <Text style={styles.bulletPoint}>• créer et gérer les comptes utilisateurs,</Text>
            <Text style={styles.bulletPoint}>• assurer la mise en relation entre utilisateurs,</Text>
            <Text style={styles.bulletPoint}>• renforcer la sécurité et prévenir la fraude,</Text>
            <Text style={styles.bulletPoint}>• permettre l&apos;arbitrage en cas de litige,</Text>
            <Text style={styles.bulletPoint}>• respecter les obligations légales.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Partage des données</Text>
            <Text style={styles.paragraph}>
              Les données personnelles :
            </Text>
            <Text style={styles.bulletPoint}>• ne sont jamais vendues à des tiers,</Text>
            <Text style={styles.bulletPoint}>• peuvent être partagées uniquement avec :</Text>
            <Text style={[styles.bulletPoint, { marginLeft: 24 }]}>- des prestataires techniques (hébergement, KYC),</Text>
            <Text style={[styles.bulletPoint, { marginLeft: 24 }]}>- des autorités compétentes si la loi l&apos;exige.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Conservation des données</Text>
            <Text style={styles.paragraph}>
              Les données sont conservées :
            </Text>
            <Text style={styles.bulletPoint}>• pendant la durée d&apos;utilisation du compte,</Text>
            <Text style={styles.bulletPoint}>• puis archivées ou supprimées conformément aux obligations légales.</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              Les documents KYC sont conservés de manière sécurisée et pour une durée limitée.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Sécurité des données</Text>
            <Text style={styles.paragraph}>
              MoniLink met en œuvre des mesures techniques et organisationnelles adaptées :
            </Text>
            <Text style={styles.bulletPoint}>• chiffrement,</Text>
            <Text style={styles.bulletPoint}>• accès restreint,</Text>
            <Text style={styles.bulletPoint}>• journalisation des accès,</Text>
            <Text style={styles.bulletPoint}>• audits de sécurité.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Droits des utilisateurs</Text>
            <Text style={styles.paragraph}>
              Conformément à la réglementation applicable (RGPD), chaque utilisateur dispose :
            </Text>
            <Text style={styles.bulletPoint}>• d&apos;un droit d&apos;accès,</Text>
            <Text style={styles.bulletPoint}>• de rectification,</Text>
            <Text style={styles.bulletPoint}>• de suppression,</Text>
            <Text style={styles.bulletPoint}>• de limitation,</Text>
            <Text style={styles.bulletPoint}>• et d&apos;opposition au traitement de ses données.</Text>
            <Text style={[styles.paragraph, { marginTop: 12 }]}>
              Toute demande peut être adressée au support MoniLink.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Responsabilité limitée</Text>
            <Text style={styles.paragraph}>
              MoniLink ne saurait être tenue responsable des données échangées volontairement entre utilisateurs en dehors des fonctionnalités sécurisées de la plateforme.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Modifications</Text>
            <Text style={styles.paragraph}>
              La présente politique de confidentialité peut être mise à jour à tout moment. Les utilisateurs seront informés de toute modification significative.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Contact</Text>
            <Text style={styles.paragraph}>
              Pour toute question relative aux données personnelles :
            </Text>
            <Text style={styles.contactText}>info.quishiba@gmail.com</Text>
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
