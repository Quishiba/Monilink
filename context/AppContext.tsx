import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Offer, Transaction, KYCData, KYCStep, User } from '@/types';
import { MOCK_OFFERS } from '@/mocks/offers';
import { getCurrentUser } from '@/mocks/users';
import { Language, getTranslations, Translations } from '@/constants/translations';
import { registerForPushNotificationsAsync, sendTransactionStatusNotification, sendKycVerificationNotification } from '@/lib/notification-service';

export const [AppContext, useApp] = createContextHook(() => {
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [kycData, setKycData] = useState<KYCData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    phoneVerified: false,
    address: '',
    city: '',
    postalCode: '',
    country: '',
    status: 'not_verified',
    currentStep: 'personal_info',
  });
  const [language, setLanguage] = useState<Language>('fr');
  const [t, setT] = useState<Translations>(getTranslations('fr'));
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const authState = await AsyncStorage.getItem('is_authenticated');
        if (authState === 'true') {
          setIsAuthenticated(true);
          setCurrentUser(getCurrentUser());
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      }
    };
    loadAuthState();
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setPushToken(token);
          console.log('Push notification token registered:', token);
        }
      } catch (error) {
        console.error('Failed to setup notifications:', error);
      }
    };
    setupNotifications();
  }, []);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem('app_language');
        if (stored && (stored === 'fr' || stored === 'en' || stored === 'de')) {
          setLanguage(stored as Language);
          setT(getTranslations(stored as Language));
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem('app_language', newLanguage);
      setLanguage(newLanguage);
      setT(getTranslations(newLanguage));
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const register = async (firstName: string, lastName: string, phone: string, email?: string) => {
    try {
      await AsyncStorage.setItem('is_authenticated', 'true');
      await AsyncStorage.setItem('user_firstName', firstName);
      await AsyncStorage.setItem('user_lastName', lastName);
      await AsyncStorage.setItem('user_phone', phone);
      if (email) await AsyncStorage.setItem('user_email', email);
      
      updateKycData({ firstName, lastName, phone });
      setIsAuthenticated(true);
      
      const user = getCurrentUser();
      user.firstName = firstName;
      user.lastName = lastName;
      user.name = `${firstName} ${lastName}`;
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to register:', error);
    }
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem('is_authenticated', 'true');
      setIsAuthenticated(true);
      
      const user = getCurrentUser();
      const storedFirstName = await AsyncStorage.getItem('user_firstName');
      const storedLastName = await AsyncStorage.getItem('user_lastName');
      if (storedFirstName && storedLastName) {
        user.firstName = storedFirstName;
        user.lastName = storedLastName;
        user.name = `${storedFirstName} ${storedLastName}`;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('is_authenticated');
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      await AsyncStorage.multiRemove([
        'is_authenticated',
        'user_firstName',
        'user_lastName',
        'user_phone',
        'user_email',
        'app_language',
      ]);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setKycData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        phoneVerified: false,
        address: '',
        city: '',
        postalCode: '',
        country: '',
        status: 'not_verified',
        currentStep: 'personal_info',
      });
      setTransactions([]);
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const addOffer = (offer: Offer) => {
    setOffers(prev => [offer, ...prev]);
  };

  const createTransaction = (offerId: string): Transaction => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) throw new Error('Offer not found');
    if (!currentUser) throw new Error('User not authenticated');

    const transaction: Transaction = {
      id: `tx${Date.now()}`,
      offerId,
      userA: offer.user,
      userB: currentUser,
      giveCurrency: offer.giveCurrency,
      giveAmount: offer.giveAmount,
      getCurrency: offer.getCurrency,
      getAmount: offer.getAmount,
      rate: offer.rate,
      status: 'proposed',
      paymentMethod: offer.paymentMethods[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions(prev => [transaction, ...prev]);
    return transaction;
  };

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? { ...tx, status, updatedAt: new Date().toISOString() }
          : tx
      )
    );
    sendTransactionStatusNotification(status, id).catch(error => {
      console.error('Failed to send transaction notification:', error);
    });
  };

  const updateKycData = (updates: Partial<KYCData>) => {
    setKycData(prev => {
      const updated = { ...prev, ...updates };
      
      if (currentUser) {
        const updatedUser = { ...currentUser };
        if (updates.firstName) updatedUser.firstName = updates.firstName;
        if (updates.lastName) updatedUser.lastName = updates.lastName;
        if (updates.firstName || updates.lastName) {
          updatedUser.name = `${updates.firstName || prev.firstName} ${updates.lastName || prev.lastName}`;
        }
        if (updates.status) updatedUser.kycStatus = updates.status;
        updatedUser.kycData = updated;
        setCurrentUser(updatedUser);
      }
      
      return updated;
    });
  };

  const setKycStep = (step: KYCStep) => {
    setKycData(prev => ({ ...prev, currentStep: step }));
  };

  const submitKyc = () => {
    setKycData(prev => ({
      ...prev,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    }));
    sendKycVerificationNotification('pending').catch(error => {
      console.error('Failed to send KYC notification:', error);
    });
  };

  const verifyPhone = useCallback(() => {
    setKycData(prev => ({ ...prev, phoneVerified: true }));
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, kycData: { ...prev.kycData!, phoneVerified: true } } : null);
    }
  }, [currentUser]);

  const sendPhoneVerification = useCallback(async (phoneNumber: string) => {
    try {
      console.log('Sending SMS verification to:', phoneNumber);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Code sent successfully' };
    } catch (error) {
      console.error('Failed to send verification:', error);
      return { success: false, message: 'Failed to send code' };
    }
  }, []);

  const verifyPhoneCode = useCallback(async (phoneNumber: string, code: string) => {
    try {
      console.log('Verifying code:', code, 'for:', phoneNumber);
      await new Promise(resolve => setTimeout(resolve, 1000));
      verifyPhone();
      return { success: true, message: 'Phone verified' };
    } catch (error) {
      console.error('Failed to verify code:', error);
      return { success: false, message: 'Invalid code' };
    }
  }, [verifyPhone]);

  return {
    offers,
    transactions,
    currentUser,
    kycData,
    language,
    t,
    isAuthenticated,
    pushToken,
    addOffer,
    createTransaction,
    updateTransactionStatus,
    updateKycData,
    setKycStep,
    submitKyc,
    verifyPhone,
    sendPhoneVerification,
    verifyPhoneCode,
    changeLanguage,
    login,
    logout,
    register,
    deleteAccount,
  };
});
