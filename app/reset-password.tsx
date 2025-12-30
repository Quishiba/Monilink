import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { t } = useApp();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    if (!emailOrPhone.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCodeSent(true);
    } catch (error) {
      console.error('Send code error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.dark.text} />
            </TouchableOpacity>

            {codeSent ? (
              <>
                <View style={styles.successContainer}>
                  <View style={styles.iconContainer}>
                    <CheckCircle size={64} color={colors.dark.secondary} />
                  </View>
                  <Text style={styles.successTitle}>{t.auth.resetCodeSent}</Text>
                  <Text style={styles.successMessage}>{t.auth.resetCodeSentMessage}</Text>
                </View>

                <TouchableOpacity
                  style={styles.backToLoginButton}
                  onPress={() => router.push('/login')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.backToLoginButtonText}>{t.auth.backToLogin}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>{t.auth.resetPasswordTitle}</Text>
                  <Text style={styles.subtitle}>{t.auth.resetPasswordSubtitle}</Text>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t.auth.emailOrPhone}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t.auth.emailOrPhone}
                      placeholderTextColor={colors.dark.textSecondary}
                      value={emailOrPhone}
                      onChangeText={setEmailOrPhone}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                    onPress={handleSendCode}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.sendButtonText}>{t.auth.sendResetCode}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => router.push('/login')}
                    activeOpacity={0.7}
                    style={styles.loginLinkContainer}
                  >
                    <Text style={styles.loginLink}>{t.auth.backToLogin}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.textSecondary,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  sendButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  loginLinkContainer: {
    alignItems: 'center',
  },
  loginLink: {
    fontSize: 14,
    color: colors.dark.secondary,
    fontWeight: '600' as const,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  backToLoginButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backToLoginButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
});
