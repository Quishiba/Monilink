import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft, CheckSquare, Square } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { sendVerificationCode } from '@/lib/sms-service';

export default function RegisterScreen() {
  const router = useRouter();
  const { t, register } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !emailOrPhone.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert(t.common.error, 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert(t.common.error, 'Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert(t.common.error, 'Please agree to the terms and conditions');
      return;
    }
    
    setLoading(true);
    try {
      const isPhone = /^[+]?[\d\s\-()]+$/.test(emailOrPhone);
      
      if (isPhone) {
        const result = await sendVerificationCode(emailOrPhone);
        
        if (result.success) {
          await register(firstName, lastName, emailOrPhone);
          router.push({
            pathname: '/phone-verification',
            params: { 
              phoneNumber: emailOrPhone,
              returnTo: '/(tabs)/(home)'
            }
          });
        } else {
          Alert.alert(t.common.error, result.message || 'Failed to send verification code');
        }
      } else {
        await register(firstName, lastName, '', emailOrPhone);
        router.replace('/(tabs)/(home)');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert(t.common.error, 'Registration failed');
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

            <View style={styles.header}>
              <Text style={styles.title}>{t.auth.registerTitle}</Text>
              <Text style={styles.subtitle}>{t.auth.registerSubtitle}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>{t.profile.firstName}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.profile.firstName}
                    placeholderTextColor={colors.dark.textSecondary}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>{t.profile.lastName}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.profile.lastName}
                    placeholderTextColor={colors.dark.textSecondary}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

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
                  autoComplete="password-new"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t.auth.confirmPassword}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.auth.confirmPassword}
                  placeholderTextColor={colors.dark.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
              </View>

              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                activeOpacity={0.7}
              >
                {agreeToTerms ? (
                  <CheckSquare size={24} color={colors.dark.secondary} />
                ) : (
                  <Square size={24} color={colors.dark.textSecondary} />
                )}
                <Text style={styles.checkboxLabel}>{t.auth.agreeToTerms}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.registerButton, (loading || !agreeToTerms) && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading || !agreeToTerms}
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>{t.auth.createAccount}</Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>{t.auth.haveAccount} </Text>
                <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
                  <Text style={styles.loginLink}>{t.auth.login}</Text>
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
    marginBottom: 32,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.dark.text,
    flex: 1,
  },
  registerButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.dark.secondary,
    fontWeight: '600' as const,
  },
});
