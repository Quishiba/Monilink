import { Currency } from '@/types';

export const CURRENCIES: {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
}[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'XAF', name: 'Central African CFA', symbol: 'FCFA', flag: '🇨🇲' },
  { code: 'XOF', name: 'West African CFA', symbol: 'FCFA', flag: '🇸🇳' },
];

export const getCurrencyInfo = (code: Currency) => {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
};

export const PAYMENT_METHODS = [
  'SEPA',
  'Mobile Money',
  'Cash Pickup',
  'Bank Transfer',
  'Wise',
] as const;
