import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { sendVerificationCode, verifyCode } from '@/lib/sms-service';

export default function PhoneVerificationScreen() {
  const router = useRouter();
  const { t, verifyPhone } = useApp();
  const { phoneNumber, returnTo } = useLocalSearchParams<{ phoneNumber?: string; returnTo?: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '') && newCode.length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode: string) => {
    if (!phoneNumber) {
      Alert.alert(t.common.error, 'Phone number is missing');
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying phone with code:', verificationCode);
      console.log('Phone number:', phoneNumber);

      const isValid = await verifyCode(phoneNumber, verificationCode);
      
      if (isValid) {
        verifyPhone();
        
        Alert.alert(
          t.common.success,
          'Phone verified successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (returnTo) {
                  router.push(returnTo as any);
                } else {
                  router.back();
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(t.common.error, 'Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert(t.common.error, 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !phoneNumber) return;
    
    setLoading(true);
    try {
      console.log('Resending code to:', phoneNumber);
      
      const result = await sendVerificationCode(phoneNumber);
      
      if (result.success) {
        setResendTimer(60);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        
        Alert.alert(t.auth.codeSent, `Code sent to ${phoneNumber}`);
      } else {
        Alert.alert(t.common.error, result.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert(t.common.error, 'Failed to resend code');
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

            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Phone size={32} color={colors.dark.secondary} />
              </View>
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>{t.auth.verifyPhone}</Text>
              <Text style={styles.subtitle}>
                {t.auth.verifyPhoneSubtitle}
              </Text>
              {phoneNumber && (
                <Text style={styles.phoneNumber}>{phoneNumber}</Text>
              )}
            </View>

            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.codeInput,
                    digit && styles.codeInputFilled
                  ]}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                  editable={!loading}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleResend}
              disabled={resendTimer > 0 || loading}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.resendText,
                (resendTimer > 0 || loading) && styles.resendTextDisabled
              ]}>
                {t.auth.codeNotReceived}
              </Text>
              <Text style={[
                styles.resendLink,
                (resendTimer > 0 || loading) && styles.resendLinkDisabled
              ]}>
                {resendTimer > 0 ? `${t.auth.resendCode} (${resendTimer}s)` : t.auth.resendCode}
              </Text>
            </TouchableOpacity>
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.dark.border,
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.dark.text,
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: colors.dark.secondary,
    backgroundColor: colors.dark.surface,
  },
  resendContainer: {
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  resendLink: {
    fontSize: 14,
    color: colors.dark.secondary,
    fontWeight: '600' as const,
  },
  resendTextDisabled: {
    opacity: 0.5,
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
});
