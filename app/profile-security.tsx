import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, Fingerprint, Smartphone, Trash2, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

export default function ProfileSecurityScreen() {
  const router = useRouter();
  const { t } = useApp();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.profile.privacySecurity}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.common.security}</Text>
            
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {}}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Lock size={20} color={colors.dark.text} />
                  <Text style={styles.menuText}>{t.profile.changePassword}</Text>
                </View>
                <ChevronRight size={20} color={colors.dark.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Fingerprint size={20} color={colors.dark.text} />
                  <Text style={styles.menuText}>{t.profile.biometricAuth}</Text>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: colors.dark.border, true: colors.dark.primary }}
                  thumbColor={colors.dark.text}
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {}}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Smartphone size={20} color={colors.dark.text} />
                  <Text style={styles.menuText}>{t.profile.connectedDevices}</Text>
                </View>
                <ChevronRight size={20} color={colors.dark.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.notifications}</Text>
            
            <View style={styles.card}>
              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Text style={styles.menuText}>Notifications push</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.dark.border, true: colors.dark.primary }}
                  thumbColor={colors.dark.text}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compte</Text>
            
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {}}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Trash2 size={20} color={colors.dark.error} />
                  <Text style={[styles.menuText, { color: colors.dark.error }]}>
                    {t.profile.deleteAccount}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.dark.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.warningText}>
              La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuText: {
    fontSize: 15,
    color: colors.dark.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 8,
  },
  warningText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    paddingHorizontal: 20,
    marginTop: 12,
    lineHeight: 18,
  },
});
