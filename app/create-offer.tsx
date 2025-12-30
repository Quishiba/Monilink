import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Currency, PaymentMethod } from '@/types';
import { CURRENCIES, PAYMENT_METHODS } from '@/constants/currencies';
import { useApp } from '@/context/AppContext';

export default function CreateOfferScreen() {
  const router = useRouter();
  const { addOffer, currentUser, kycData } = useApp();
  
  const [giveCurrency, setGiveCurrency] = useState<Currency>('EUR');
  const [giveAmount, setGiveAmount] = useState('');
  const [getCurrency, setGetCurrency] = useState<Currency>('XAF');
  const [getAmount, setGetAmount] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>(['SEPA']);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (kycData.status !== 'verified') {
      router.replace('/kyc-verification');
    }
  }, [kycData.status, router]);

  if (kycData.status !== 'verified' || !currentUser) {
    return null;
  }

  const handleSubmit = () => {
    const give = parseFloat(giveAmount);
    const get = parseFloat(getAmount);
    
    if (!give || !get) return;

    const offer = {
      id: `off${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      giveCurrency,
      giveAmount: give,
      getCurrency,
      getAmount: get,
      rate: get / give,
      paymentMethods: selectedMethods,
      location: currentUser.location,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      comment: comment.trim() || undefined,
    };

    addOffer(offer);
    router.back();
  };

  const toggleMethod = (method: PaymentMethod) => {
    setSelectedMethods(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Offer</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I&apos;m Offering</Text>
            <View style={styles.currencySelector}>
              {CURRENCIES.map(curr => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyButton,
                    giveCurrency === curr.code && styles.currencyButtonActive,
                  ]}
                  onPress={() => setGiveCurrency(curr.code)}
                >
                  <Text style={styles.currencyFlag}>{curr.flag}</Text>
                  <Text
                    style={[
                      styles.currencyCode,
                      giveCurrency === curr.code && styles.currencyCodeActive,
                    ]}
                  >
                    {curr.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.amountInput}
              value={giveAmount}
              onChangeText={setGiveAmount}
              placeholder="Amount"
              placeholderTextColor={colors.dark.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.arrowSection}>
            <ArrowRight size={24} color={colors.dark.secondary} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I Want to Receive</Text>
            <View style={styles.currencySelector}>
              {CURRENCIES.map(curr => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyButton,
                    getCurrency === curr.code && styles.currencyButtonActive,
                  ]}
                  onPress={() => setGetCurrency(curr.code)}
                >
                  <Text style={styles.currencyFlag}>{curr.flag}</Text>
                  <Text
                    style={[
                      styles.currencyCode,
                      getCurrency === curr.code && styles.currencyCodeActive,
                    ]}
                  >
                    {curr.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.amountInput}
              value={getAmount}
              onChangeText={setGetAmount}
              placeholder="Amount"
              placeholderTextColor={colors.dark.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {giveAmount && getAmount && (
            <View style={styles.rateDisplay}>
              <Text style={styles.rateLabel}>Exchange Rate</Text>
              <Text style={styles.rateValue}>
                1 {giveCurrency} = {(parseFloat(getAmount) / parseFloat(giveAmount)).toFixed(4)} {getCurrency}
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <View style={styles.methodsContainer}>
              {PAYMENT_METHODS.map(method => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.methodButton,
                    selectedMethods.includes(method) && styles.methodButtonActive,
                  ]}
                  onPress={() => toggleMethod(method)}
                >
                  <Text
                    style={[
                      styles.methodButtonText,
                      selectedMethods.includes(method) && styles.methodButtonTextActive,
                    ]}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comment (Optional)</Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Add details about your offer..."
              placeholderTextColor={colors.dark.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!giveAmount || !getAmount || selectedMethods.length === 0) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!giveAmount || !getAmount || selectedMethods.length === 0}
          >
            <Text style={styles.submitButtonText}>Create Offer</Text>
          </TouchableOpacity>
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
  keyboardView: {
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
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 16,
  },
  currencySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currencyButtonActive: {
    borderColor: colors.dark.secondary,
    backgroundColor: colors.dark.surfaceLight,
  },
  currencyFlag: {
    fontSize: 20,
  },
  currencyCode: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
  },
  currencyCodeActive: {
    color: colors.dark.secondary,
  },
  amountInput: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  arrowSection: {
    alignItems: 'center',
    marginVertical: -16,
    zIndex: 1,
  },
  rateDisplay: {
    backgroundColor: colors.dark.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.secondary,
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodButton: {
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodButtonActive: {
    borderColor: colors.dark.secondary,
    backgroundColor: colors.dark.surfaceLight,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
  },
  methodButtonTextActive: {
    color: colors.dark.secondary,
  },
  commentInput: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: colors.dark.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
});
