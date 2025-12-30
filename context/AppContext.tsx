import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Offer, Transaction, KYCData, KYCStep } from '@/types';
import { MOCK_OFFERS } from '@/mocks/offers';
import { getCurrentUser } from '@/mocks/users';
import { Language, getTranslations, Translations } from '@/constants/translations';

export const [AppContext, useApp] = createContextHook(() => {
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kycData, setKycData] = useState<KYCData>({
    firstName: '',
    lastName: '',
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
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem('app_language');
        if (stored && (stored === 'fr' || stored === 'en')) {
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

  const addOffer = (offer: Offer) => {
    setOffers(prev => [offer, ...prev]);
  };

  const createTransaction = (offerId: string): Transaction => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) throw new Error('Offer not found');

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
  };

  const updateKycData = (updates: Partial<KYCData>) => {
    setKycData(prev => ({ ...prev, ...updates }));
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
  };

  const verifyPhone = () => {
    setKycData(prev => ({ ...prev, phoneVerified: true }));
  };

  return {
    offers,
    transactions,
    currentUser,
    kycData,
    language,
    t,
    addOffer,
    createTransaction,
    updateTransactionStatus,
    updateKycData,
    setKycStep,
    submitKyc,
    verifyPhone,
    changeLanguage,
  };
});
