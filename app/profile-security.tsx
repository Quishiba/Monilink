import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, Fingerprint, Smartphone, Trash2, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

export default function ProfileSecurityScreen() {
  const router = useRouter();
  const { t, deleteAccount } = useApp();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setShowDeleteModal(false);
    router.replace('/login');
  };

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
                onPress={() => setShowDeleteModal(true)}
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

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Supprimer mon compte</Text>
            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront définitivement supprimées.
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>Confirmer la suppression</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.dark.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: colors.dark.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  deleteButton: {
    backgroundColor: colors.dark.error,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  cancelButton: {
    backgroundColor: colors.dark.surfaceLight,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
});
