import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, MessageCircle, Clock, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

export default function ProfileSupportScreen() {
  const router = useRouter();
  const { t } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqItems = [
    {
      question: 'Comment vérifier mon identité ?',
      answer: 'Accédez à votre profil, puis cliquez sur "Vérifier mon identité".',
    },
    {
      question: 'Combien de temps prend un échange ?',
      answer: 'En moyenne, un échange prend 12 minutes.',
    },
    {
      question: 'Comment contacter un utilisateur ?',
      answer: 'Cliquez sur une offre puis utilisez le chat intégré.',
    },
    {
      question: 'Que faire en cas de litige ?',
      answer: 'Ouvrez un litige depuis la page de transaction.',
    },
  ];

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@monilink.app');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://wa.me/33612345678');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.profile.support}</Text>
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
              <Text style={styles.sectionTitle}>{t.profile.faq}</Text>
              
              <View style={styles.card}>
                {faqItems.map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.faqItem}
                      onPress={() => {}}
                      activeOpacity={0.7}
                    >
                      <View style={styles.faqContent}>
                        <Text style={styles.faqQuestion}>{item.question}</Text>
                        <Text style={styles.faqAnswer}>{item.answer}</Text>
                      </View>
                      <ChevronRight size={20} color={colors.dark.textSecondary} />
                    </TouchableOpacity>
                    {index < faqItems.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.profile.contactSupport}</Text>
              
              <View style={styles.card}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Sujet</Text>
                  <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Ex: Problème de vérification"
                    placeholderTextColor={colors.dark.textSecondary}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Message</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Décrivez votre problème..."
                    placeholderTextColor={colors.dark.textSecondary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <Text style={styles.submitButtonText}>{t.common.submit}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact direct</Text>
              
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={handleEmailPress}
                  activeOpacity={0.7}
                >
                  <Mail size={20} color={colors.dark.text} />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>support@monilink.app</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={handleWhatsAppPress}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={20} color={colors.dark.text} />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>WhatsApp</Text>
                    <Text style={styles.contactValue}>+33 6 12 34 56 78</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={styles.contactItem}>
                  <Clock size={20} color={colors.dark.text} />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Horaires</Text>
                    <Text style={styles.contactValue}>Lun-Ven: 9h-18h (CET)</Text>
                  </View>
                </View>
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
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  faqContent: {
    flex: 1,
    marginRight: 12,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    color: colors.dark.text,
    backgroundColor: colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    color: colors.dark.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 4,
  },
});
