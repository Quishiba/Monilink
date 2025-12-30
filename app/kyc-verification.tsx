import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Camera, 
  Image as ImageIcon,
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import * as ImagePicker from 'expo-image-picker';

export default function KYCVerificationScreen() {
  const router = useRouter();
  const { kycData, updateKycData, setKycStep, submitKyc, verifyPhone } = useApp();
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const currentStepIndex = [
    'personal_info',
    'phone_verification',
    'document_selection',
    'document_capture',
    'selfie_capture',
    'address_proof',
    'review',
  ].indexOf(kycData.currentStep);

  const canProceed = () => {
    switch (kycData.currentStep) {
      case 'personal_info':
        return (
          kycData.firstName.trim() &&
          kycData.lastName.trim() &&
          kycData.phone.trim() &&
          kycData.address.trim() &&
          kycData.city.trim() &&
          kycData.postalCode.trim() &&
          kycData.country.trim()
        );
      case 'phone_verification':
        return kycData.phoneVerified;
      case 'document_selection':
        return !!kycData.documentType;
      case 'document_capture':
        return !!kycData.documentImageUrl;
      case 'selfie_capture':
        return !!kycData.selfieImageUrl;
      case 'address_proof':
        return !!kycData.addressProofUrl;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const steps: typeof kycData.currentStep[] = [
      'personal_info',
      'phone_verification',
      'document_selection',
      'document_capture',
      'selfie_capture',
      'address_proof',
      'review',
    ];
    const currentIndex = steps.indexOf(kycData.currentStep);
    if (currentIndex < steps.length - 1) {
      setKycStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: typeof kycData.currentStep[] = [
      'personal_info',
      'phone_verification',
      'document_selection',
      'document_capture',
      'selfie_capture',
      'address_proof',
      'review',
    ];
    const currentIndex = steps.indexOf(kycData.currentStep);
    if (currentIndex > 0) {
      setKycStep(steps[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  const handleSendOTP = () => {
    console.log('Sending OTP to:', kycData.phone);
    setOtpSent(true);
    if (Platform.OS === 'web') {
      Alert.alert('OTP Sent', `Verification code sent to ${kycData.phone}`, [{ text: 'OK' }]);
    }
  };

  const handleVerifyOTP = () => {
    if (otpCode.length === 6) {
      console.log('Verifying OTP:', otpCode);
      verifyPhone();
      if (Platform.OS === 'web') {
        Alert.alert('Success', 'Phone number verified successfully', [{ text: 'OK' }]);
      }
    }
  };

  const pickImage = async (type: 'document' | 'selfie' | 'address') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUrl = result.assets[0].uri;
      if (type === 'document') {
        updateKycData({ documentImageUrl: imageUrl });
      } else if (type === 'selfie') {
        updateKycData({ selfieImageUrl: imageUrl });
      } else if (type === 'address') {
        updateKycData({ addressProofUrl: imageUrl });
      }
    }
  };

  const takePhoto = async (type: 'document' | 'selfie' | 'address') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      if (Platform.OS === 'web') {
        Alert.alert('Permission Required', 'Camera permission is needed', [{ text: 'OK' }]);
      }
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUrl = result.assets[0].uri;
      if (type === 'document') {
        updateKycData({ documentImageUrl: imageUrl });
      } else if (type === 'selfie') {
        updateKycData({ selfieImageUrl: imageUrl });
      } else if (type === 'address') {
        updateKycData({ addressProofUrl: imageUrl });
      }
    }
  };

  const handleSubmit = () => {
    submitKyc();
    if (Platform.OS === 'web') {
      Alert.alert(
        'KYC Submitted',
        'Your identity verification has been submitted for review. You will be notified once verified.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const renderStepContent = () => {
    switch (kycData.currentStep) {
      case 'personal_info':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <User size={24} color={colors.dark.secondary} />
              </View>
              <Text style={styles.stepTitle}>Personal Information</Text>
              <Text style={styles.stepDescription}>
                Please provide your personal details exactly as they appear on your ID
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={kycData.firstName}
                  onChangeText={(text) => updateKycData({ firstName: text })}
                  placeholder="Enter your first name"
                  placeholderTextColor={colors.dark.textSecondary}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  value={kycData.lastName}
                  onChangeText={(text) => updateKycData({ lastName: text })}
                  placeholder="Enter your last name"
                  placeholderTextColor={colors.dark.textSecondary}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={kycData.phone}
                  onChangeText={(text) => updateKycData({ phone: text, phoneVerified: false })}
                  placeholder="+33 6 12 34 56 78"
                  placeholderTextColor={colors.dark.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street Address *</Text>
                <TextInput
                  style={styles.input}
                  value={kycData.address}
                  onChangeText={(text) => updateKycData({ address: text })}
                  placeholder="Enter your street address"
                  placeholderTextColor={colors.dark.textSecondary}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput
                    style={styles.input}
                    value={kycData.city}
                    onChangeText={(text) => updateKycData({ city: text })}
                    placeholder="City"
                    placeholderTextColor={colors.dark.textSecondary}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Postal Code *</Text>
                  <TextInput
                    style={styles.input}
                    value={kycData.postalCode}
                    onChangeText={(text) => updateKycData({ postalCode: text })}
                    placeholder="Code"
                    placeholderTextColor={colors.dark.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Country *</Text>
                <TextInput
                  style={styles.input}
                  value={kycData.country}
                  onChangeText={(text) => updateKycData({ country: text })}
                  placeholder="Enter your country"
                  placeholderTextColor={colors.dark.textSecondary}
                />
              </View>
            </View>
          </View>
        );

      case 'phone_verification':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <Phone size={24} color={colors.dark.secondary} />
              </View>
              <Text style={styles.stepTitle}>Phone Verification</Text>
              <Text style={styles.stepDescription}>
                We&apos;ll send a 6-digit code to {kycData.phone}
              </Text>
            </View>

            {!kycData.phoneVerified ? (
              <View style={styles.form}>
                {!otpSent ? (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSendOTP}
                  >
                    <Text style={styles.primaryButtonText}>Send Verification Code</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Enter 6-Digit Code</Text>
                      <TextInput
                        style={[styles.input, styles.otpInput]}
                        value={otpCode}
                        onChangeText={setOtpCode}
                        placeholder="000000"
                        placeholderTextColor={colors.dark.textSecondary}
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        otpCode.length !== 6 && styles.buttonDisabled,
                      ]}
                      onPress={handleVerifyOTP}
                      disabled={otpCode.length !== 6}
                    >
                      <Text style={styles.primaryButtonText}>Verify Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={handleSendOTP}
                    >
                      <Text style={styles.secondaryButtonText}>Resend Code</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              <View style={styles.successCard}>
                <CheckCircle size={48} color={colors.dark.secondary} />
                <Text style={styles.successTitle}>Phone Verified</Text>
                <Text style={styles.successDescription}>
                  Your phone number has been verified successfully
                </Text>
              </View>
            )}
          </View>
        );

      case 'document_selection':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <FileText size={24} color={colors.dark.secondary} />
              </View>
              <Text style={styles.stepTitle}>Select ID Document</Text>
              <Text style={styles.stepDescription}>
                Choose the type of identification you&apos;ll upload
              </Text>
            </View>

            <View style={styles.documentOptions}>
              <TouchableOpacity
                style={[
                  styles.documentOption,
                  kycData.documentType === 'passport' && styles.documentOptionActive,
                ]}
                onPress={() => updateKycData({ documentType: 'passport' })}
              >
                <FileText
                  size={32}
                  color={
                    kycData.documentType === 'passport'
                      ? colors.dark.secondary
                      : colors.dark.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.documentOptionText,
                    kycData.documentType === 'passport' && styles.documentOptionTextActive,
                  ]}
                >
                  Passport
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.documentOption,
                  kycData.documentType === 'national_id' && styles.documentOptionActive,
                ]}
                onPress={() => updateKycData({ documentType: 'national_id' })}
              >
                <FileText
                  size={32}
                  color={
                    kycData.documentType === 'national_id'
                      ? colors.dark.secondary
                      : colors.dark.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.documentOptionText,
                    kycData.documentType === 'national_id' && styles.documentOptionTextActive,
                  ]}
                >
                  National ID Card
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.documentOption,
                  kycData.documentType === 'driver_license' && styles.documentOptionActive,
                ]}
                onPress={() => updateKycData({ documentType: 'driver_license' })}
              >
                <FileText
                  size={32}
                  color={
                    kycData.documentType === 'driver_license'
                      ? colors.dark.secondary
                      : colors.dark.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.documentOptionText,
                    kycData.documentType === 'driver_license' && styles.documentOptionTextActive,
                  ]}
                >
                  Driver&apos;s License
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'document_capture':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <Camera size={24} color={colors.dark.secondary} />
              </View>
              <Text style={styles.stepTitle}>Upload ID Document</Text>
              <Text style={styles.stepDescription}>
                Take a clear photo of your {kycData.documentType?.replace('_', ' ')}
              </Text>
            </View>

            <View style={styles.captureInstructions}>
              <View style={styles.instructionItem}>
                <CheckCircle size={16} color={colors.dark.secondary} />
                <Text style={styles.instructionText}>Ensure all text is clearly visible</Text>
              </View>
              <View style={styles.instructionItem}>
                <CheckCircle size={16} color={colors.dark.secondary} />
                <Text style={styles.instructionText}>Document must be valid and not expired</Text>
              </View>
              <View style={styles.instructionItem}>
                <CheckCircle size={16} color={colors.dark.secondary} />
                <Text style={styles.instructionText}>Avoid glare and shadows</Text>
              </View>
            </View>

            {kycData.documentImageUrl ? (
              <View style={styles.imagePreview}>
                <CheckCircle size={48} color={colors.dark.secondary} />
                <Text style={styles.imagePreviewText}>Document Uploaded</Text>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => updateKycData({ documentImageUrl: undefined })}
                >
                  <Text style={styles.secondaryButtonText}>Retake Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.captureButtons}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => takePhoto('document')}
                >
                  <Camera size={24} color={colors.dark.text} />
                  <Text style={styles.captureButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => pickImage('document')}
                >
                  <ImageIcon size={24} color={colors.dark.text} />
                  <Text style={styles.captureButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'selfie_capture':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <Camera size={24} color={colors.dark.secondary} />
              </View>
              <Text style={styles.stepTitle}>Take a Selfie</Text>
              <Text style={styles.stepDescription}>
                Hold your ID document next to your face
              </Text>
            </View>

            <View style={styles.captureInstructions}>
              <View style={styles.instructionItem}>
                <CheckCircle size={16} color={colors.dark.secondary} />
                <Text style={styles.instructionText}>Face and document must be visible</Text>
              </View>
              <View style={styles.instructionItem}>
                <CheckCircle size={16} color={colors.dark.secondary} />
                <Text style={styles.instructionText}>Remove glasses and hats</Text>
              </View>
              <View style={styles.instructionItem}>
                <CheckCircle size={16} color={colors.dark.secondary} />
                <Text style={styles.instructionText}>Good lighting required</Text>
              </View>
            </View>

            {kycData.selfieImageUrl ? (
              <View style={styles.imagePreview}>
                <CheckCircle size={48} color={colors.dark.secondary} />
                <Text style={styles.imagePreviewText}>Selfie Uploaded</Text>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => updateKycData({ selfieImageUrl: undefined })}
                >
                  <Text style={styles.secondaryButtonText}>Retake Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.captureButtons}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => takePhoto('selfie')}
                >
                  <Camera size={24} color={colors.dark.text} />
                  <Text style={styles.captureButtonText}>Take Selfie</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => pickImage('selfie')}
                >
                  <ImageIcon size={24} color={colors.dark.text} />
                  <Text style={styles.captureButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'address_proof':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <MapPin size={24} color={colors.dark.secondary} />
              </View>
              <Text style={styles.stepTitle}>Proof of Address</Text>
              <Text style={styles.stepDescription}>
                Upload a document dated within the last 3 months
              </Text>
            </View>

            <View style={styles.acceptedDocuments}>
              <Text style={styles.acceptedTitle}>Accepted Documents:</Text>
              <Text style={styles.acceptedItem}>• Utility bill (electricity, water, internet)</Text>
              <Text style={styles.acceptedItem}>• Bank statement</Text>
              <Text style={styles.acceptedItem}>• Rental agreement or lease</Text>
              <Text style={styles.acceptedItem}>• Anmeldungsbescheid (Germany)</Text>
            </View>

            {kycData.addressProofUrl ? (
              <View style={styles.imagePreview}>
                <CheckCircle size={48} color={colors.dark.secondary} />
                <Text style={styles.imagePreviewText}>Address Proof Uploaded</Text>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => updateKycData({ addressProofUrl: undefined })}
                >
                  <Text style={styles.secondaryButtonText}>Upload Different Document</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.captureButtons}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => takePhoto('address')}
                >
                  <Camera size={24} color={colors.dark.text} />
                  <Text style={styles.captureButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => pickImage('address')}
                >
                  <ImageIcon size={24} color={colors.dark.text} />
                  <Text style={styles.captureButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'review':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconContainer}>
                <Shield size={24} color={colors.dark.secondary} />
              </View>
              <Text style={styles.stepTitle}>Review & Submit</Text>
              <Text style={styles.stepDescription}>
                Please review your information before submitting
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewCard}>
                <Text style={styles.reviewCardTitle}>Personal Information</Text>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Name:</Text>
                  <Text style={styles.reviewValue}>
                    {kycData.firstName} {kycData.lastName}
                  </Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Phone:</Text>
                  <View style={styles.reviewValueRow}>
                    <Text style={styles.reviewValue}>{kycData.phone}</Text>
                    {kycData.phoneVerified && (
                      <CheckCircle size={16} color={colors.dark.secondary} />
                    )}
                  </View>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Address:</Text>
                  <Text style={styles.reviewValue}>
                    {kycData.address}, {kycData.city} {kycData.postalCode}, {kycData.country}
                  </Text>
                </View>
              </View>

              <View style={styles.reviewCard}>
                <Text style={styles.reviewCardTitle}>Documents</Text>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>ID Type:</Text>
                  <Text style={styles.reviewValue}>
                    {kycData.documentType?.replace('_', ' ')}
                  </Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>ID Photo:</Text>
                  <View style={styles.reviewValueRow}>
                    <Text style={styles.reviewValue}>Uploaded</Text>
                    <CheckCircle size={16} color={colors.dark.secondary} />
                  </View>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Selfie:</Text>
                  <View style={styles.reviewValueRow}>
                    <Text style={styles.reviewValue}>Uploaded</Text>
                    <CheckCircle size={16} color={colors.dark.secondary} />
                  </View>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Address Proof:</Text>
                  <View style={styles.reviewValueRow}>
                    <Text style={styles.reviewValue}>Uploaded</Text>
                    <CheckCircle size={16} color={colors.dark.secondary} />
                  </View>
                </View>
              </View>

              <View style={styles.consentCard}>
                <AlertCircle size={20} color={colors.dark.primary} />
                <Text style={styles.consentText}>
                  By submitting, you consent to the collection and processing of your personal data
                  for identity verification purposes in compliance with GDPR.
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Identity Verification</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStepIndex + 1) / 7) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStepIndex + 1} of 7
          </Text>
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
            {renderStepContent()}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          {kycData.currentStep !== 'review' ? (
            <TouchableOpacity
              style={[styles.nextButton, !canProceed() && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={!canProceed()}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <ChevronRight size={20} color={colors.dark.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit for Verification</Text>
            </TouchableOpacity>
          )}
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
  backButton: {
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.dark.surface,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.secondary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.dark.secondary + '40',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 15,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  input: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600' as const,
    textAlign: 'center',
    letterSpacing: 8,
  },
  primaryButton: {
    backgroundColor: colors.dark.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  secondaryButton: {
    backgroundColor: colors.dark.surface,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  successCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark.secondary + '40',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.dark.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 15,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  documentOptions: {
    gap: 12,
  },
  documentOption: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  documentOptionActive: {
    borderColor: colors.dark.secondary,
    backgroundColor: colors.dark.surfaceLight,
  },
  documentOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
    marginTop: 12,
  },
  documentOptionTextActive: {
    color: colors.dark.secondary,
  },
  captureInstructions: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    color: colors.dark.text,
    flex: 1,
  },
  captureButtons: {
    gap: 12,
  },
  captureButton: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  imagePreview: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: colors.dark.secondary + '40',
  },
  imagePreviewText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.secondary,
  },
  acceptedDocuments: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  acceptedTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 12,
  },
  acceptedItem: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 22,
  },
  reviewSection: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  reviewCardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  reviewRow: {
    gap: 6,
  },
  reviewLabel: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  reviewValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  reviewValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.dark.primary + '20',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.primary + '40',
  },
  consentText: {
    flex: 1,
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  nextButton: {
    backgroundColor: colors.dark.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
});
