import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { sendVerificationCode } from '@/lib/sms-service';

export default function TestSMSSendScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);

  const phoneNumber = '+4915226304934';

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testSendSMS = async () => {
    setLogs([]);
    setResult(null);
    setLoading(true);

    addLog('🚀 Starting SMS test...');
    addLog(`📱 Phone number: ${phoneNumber}`);
    addLog('');
    
    addLog('📋 Checking environment variables...');
    const hasSID = !!process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID;
    const hasToken = !!process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN;
    const hasServiceSID = !!process.env.EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID;
    
    addLog(`   ACCOUNT_SID: ${hasSID ? '✓ Set' : '✗ Missing'}`);
    addLog(`   AUTH_TOKEN: ${hasToken ? '✓ Set' : '✗ Missing'}`);
    addLog(`   SERVICE_SID: ${hasServiceSID ? '✓ Set' : '✗ Missing'}`);
    addLog('');

    if (!hasSID || !hasToken || !hasServiceSID) {
      addLog('❌ ERROR: Missing Twilio credentials');
      setLoading(false);
      setResult({ success: false, message: 'Missing credentials' });
      return;
    }

    try {
      addLog('📤 Sending verification code...');
      const response = await sendVerificationCode(phoneNumber);
      
      addLog('');
      addLog('📥 Response received:');
      addLog(`   Success: ${response.success}`);
      addLog(`   Message: ${response.message || 'N/A'}`);
      addLog(`   Verification ID: ${response.verificationId || 'N/A'}`);
      addLog('');

      if (response.success) {
        addLog('✅ SMS SENT SUCCESSFULLY!');
        addLog('📱 Check your phone for the 6-digit code');
        addLog('⏱️  Code should arrive within 1-2 minutes');
        addLog('');
        addLog('ℹ️  Important notes:');
        addLog('   • If using trial account, phone must be verified in Twilio Console');
        addLog('   • Check Twilio Console > Verify > Logs for delivery status');
        addLog('   • SMS delivery may be delayed by carrier');
      } else {
        addLog('❌ FAILED TO SEND SMS');
        addLog(`   Error: ${response.message}`);
        addLog('');
        addLog('🔍 Troubleshooting steps:');
        addLog('   1. Verify Twilio credentials are correct');
        addLog('   2. Check Verify Service is active in Twilio Console');
        addLog('   3. For trial accounts: verify phone in Twilio Console');
        addLog('   4. Check Twilio account balance');
        addLog('   5. Check browser console for detailed API errors');
      }

      setResult(response);
    } catch (error) {
      addLog('');
      addLog('❌ EXCEPTION OCCURRED');
      addLog(`   Error: ${error instanceof Error ? error.message : String(error)}`);
      addLog('');
      addLog('💡 This usually means:');
      addLog('   • Network connectivity issue');
      addLog('   • CORS or API endpoint problem');
      addLog('   • Invalid API credentials');
      
      setResult({ success: false, message: 'Exception occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SMS Test</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Test Configuration</Text>
            <Text style={styles.infoText}>Phone: {phoneNumber}</Text>
            <Text style={styles.infoText}>Provider: Twilio Verify</Text>
          </View>

          <TouchableOpacity
            style={[styles.testButton, loading && styles.testButtonDisabled]}
            onPress={testSendSMS}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.dark.text} />
            ) : (
              <Text style={styles.testButtonText}>Send Test SMS</Text>
            )}
          </TouchableOpacity>

          {result && (
            <View style={[
              styles.resultBox,
              result.success ? styles.resultSuccess : styles.resultError
            ]}>
              <Text style={styles.resultTitle}>
                {result.success ? '✅ Success' : '❌ Failed'}
              </Text>
              <Text style={styles.resultText}>{result.message}</Text>
            </View>
          )}

          <View style={styles.logsContainer}>
            <Text style={styles.logsTitle}>Detailed Logs</Text>
            <ScrollView 
              style={styles.logsScroll}
              contentContainerStyle={styles.logsContent}
            >
              {logs.length === 0 ? (
                <Text style={styles.logsEmpty}>
                  No logs yet. Click &quot;Send Test SMS&quot; to start the test.
                </Text>
              ) : (
                logs.map((log, index) => (
                  <Text key={index} style={styles.logText}>
                    {log}
                  </Text>
                ))
              )}
            </ScrollView>
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoBox: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  testButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  resultBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  resultError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  logsContainer: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.text,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  logsScroll: {
    flex: 1,
  },
  logsContent: {
    padding: 12,
  },
  logsEmpty: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    fontStyle: 'italic' as const,
    textAlign: 'center',
    padding: 20,
  },
  logText: {
    fontSize: 12,
    color: colors.dark.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
});
