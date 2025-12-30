import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { t, login } = useApp();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      await login();
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Login error:', error);
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
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/');
                }
              }}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.dark.text} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>{t.auth.loginTitle}</Text>
              <Text style={styles.subtitle}>{t.auth.loginSubtitle}</Text>
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

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t.auth.password}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.auth.password}
                  placeholderTextColor={colors.dark.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                />
              </View>

              <TouchableOpacity 
                onPress={() => router.push('/reset-password')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPassword}>{t.auth.forgotPassword}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>{t.auth.login}</Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>{t.auth.noAccount} </Text>
                <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
                  <Text style={styles.signupLink}>{t.auth.signup}</Text>
                </TouchableOpacity>
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
  forgotPassword: {
    fontSize: 14,
    color: colors.dark.secondary,
    fontWeight: '600' as const,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    color: colors.dark.secondary,
    fontWeight: '600' as const,
  },
});
