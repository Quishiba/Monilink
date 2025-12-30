export type Currency = 'EUR' | 'USD' | 'GBP' | 'XAF' | 'XOF';

export type PaymentMethod = 'SEPA' | 'Mobile Money' | 'Cash Pickup' | 'Bank Transfer' | 'Wise';

export type KYCStatus = 'not_verified' | 'pending' | 'verified' | 'rejected';

export type DocumentType = 'passport' | 'national_id' | 'driver_license';

export type KYCStep = 
  | 'personal_info'
  | 'phone_verification'
  | 'document_selection'
  | 'document_capture'
  | 'selfie_capture'
  | 'address_proof'
  | 'review';

export interface KYCData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  phoneVerified: boolean;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  documentType?: DocumentType;
  documentImageUrl?: string;
  selfieImageUrl?: string;
  addressProofUrl?: string;
  status: KYCStatus;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  currentStep: KYCStep;
}

export type TransactionStatus = 
  | 'proposed' 
  | 'accepted' 
  | 'in_progress' 
  | 'proof_submitted' 
  | 'validated' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  successRate: number;
  kycStatus: KYCStatus;
  kycData?: KYCData;
  responseTime: string;
  badges: string[];
  joinedDate: string;
  preferredCurrencies: Currency[];
  paymentMethods: PaymentMethod[];
  location: string;
}

export interface Offer {
  id: string;
  userId: string;
  user: User;
  giveCurrency: Currency;
  giveAmount: number;
  getCurrency: Currency;
  getAmount: number;
  rate: number;
  paymentMethods: PaymentMethod[];
  location: string;
  expiresAt: string;
  createdAt: string;
  comment?: string;
}

export interface Transaction {
  id: string;
  offerId: string;
  userA: User;
  userB: User;
  giveCurrency: Currency;
  giveAmount: number;
  getCurrency: Currency;
  getAmount: number;
  rate: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  proofUrl?: string;
  proofSubmittedAt?: string;
}

export interface Message {
  id: string;
  transactionId: string;
  senderId: string;
  content: string;
  type: 'text' | 'system' | 'image';
  timestamp: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  transactionId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
