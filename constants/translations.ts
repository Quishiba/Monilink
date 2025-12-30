export type Language = 'fr' | 'en';

export interface Translations {
  home: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    activeOffers: string;
    available: string;
    avgExchangeRate: string;
    successRate: string;
    avgTime: string;
  };
  kyc: {
    verificationRequired: string;
    verificationRequiredMessage: string;
    cancel: string;
    verifyNow: string;
  };
  profile: {
    title: string;
    verifiedAccount: string;
    rating: string;
    swaps: string;
    success: string;
    paymentMethods: string;
    preferredCurrencies: string;
    menu: string;
    settings: string;
    notifications: string;
    help: string;
    logout: string;
    language: string;
    kycStatus: string;
    notVerified: string;
    pending: string;
    verified: string;
    rejected: string;
    information: string;
    personalInfo: string;
    edit: string;
    verifyIdentity: string;
    privacySecurity: string;
    changePassword: string;
    biometricAuth: string;
    connectedDevices: string;
    deleteAccount: string;
    support: string;
    faq: string;
    contactSupport: string;
    evaluation: string;
    averageRating: string;
    totalExchanges: string;
    receivedReviews: string;
    termsOfService: string;
    privacyPolicy: string;
    email: string;
    phone: string;
    address: string;
    name: string;
    firstName: string;
    lastName: string;
  };
  transaction: {
    title: string;
    proposed: string;
    accepted: string;
    inProgress: string;
    proofSubmitted: string;
    validated: string;
    completed: string;
    cancelled: string;
    disputed: string;
    exchangeDetails: string;
    sending: string;
    receiving: string;
    rate: string;
    paymentMethod: string;
    participants: string;
    timeline: string;
    acceptExchange: string;
    startPayment: string;
    submitProof: string;
    confirmReceipt: string;
    openChat: string;
  };
  createOffer: {
    title: string;
    offering: string;
    wantToReceive: string;
    amount: string;
    exchangeRate: string;
    paymentMethods: string;
    comment: string;
    commentPlaceholder: string;
    createOffer: string;
  };
  tabs: {
    home: string;
    transactions: string;
    messages: string;
    profile: string;
  };
  auth: {
    loginRequired: string;
    loginRequiredMessage: string;
    login: string;
    signup: string;
    guest: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    submit: string;
    loading: string;
    error: string;
    success: string;
    security: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    home: {
      title: 'Monilink',
      subtitle: 'Trouvez les meilleurs taux de change',
      searchPlaceholder: 'Rechercher des paires de devises...',
      activeOffers: 'Offres Actives',
      available: 'disponibles',
      avgExchangeRate: 'Taux de change moyen',
      successRate: 'Taux de Réussite',
      avgTime: 'Temps Moy.',
    },
    kyc: {
      verificationRequired: 'Vérification requise',
      verificationRequiredMessage: 'Veuillez vérifier votre identité pour continuer cet échange.',
      cancel: 'Annuler',
      verifyNow: 'Vérifier maintenant',
    },
    profile: {
      title: 'Profil',
      verifiedAccount: 'Compte Vérifié',
      rating: 'Note',
      swaps: 'Échanges',
      success: 'Succès',
      paymentMethods: 'Moyens de Paiement',
      preferredCurrencies: 'Devises Préférées',
      menu: 'Menu',
      settings: 'Paramètres',
      notifications: 'Notifications',
      help: 'Aide & Support',
      logout: 'Déconnexion',
      language: 'Langue',
      kycStatus: 'Statut KYC',
      notVerified: 'Non vérifié',
      pending: 'En cours de vérification',
      verified: 'Vérifié',
      rejected: 'Refusé',
      information: 'Informations',
      personalInfo: 'Informations personnelles',
      edit: 'Modifier',
      verifyIdentity: 'Vérifier mon identité',
      privacySecurity: 'Confidentialité et sécurité',
      changePassword: 'Changer le mot de passe',
      biometricAuth: 'Authentification biométrique',
      connectedDevices: 'Appareils connectés',
      deleteAccount: 'Supprimer mon compte',
      support: 'Support',
      faq: 'FAQ',
      contactSupport: 'Contacter le support',
      evaluation: 'Évaluation',
      averageRating: 'Note moyenne',
      totalExchanges: 'Nombre d\'échanges',
      receivedReviews: 'Avis reçus',
      termsOfService: 'Conditions d\'utilisation',
      privacyPolicy: 'Politique de confidentialité',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      name: 'Nom',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
    },
    transaction: {
      title: 'Transaction',
      proposed: 'Proposée',
      accepted: 'Acceptée',
      inProgress: 'En cours',
      proofSubmitted: 'Preuve soumise',
      validated: 'Validée',
      completed: 'Terminée',
      cancelled: 'Annulée',
      disputed: 'Litige',
      exchangeDetails: 'Détails de l\'échange',
      sending: 'Envoi',
      receiving: 'Réception',
      rate: 'Taux',
      paymentMethod: 'Moyen de paiement',
      participants: 'Participants',
      timeline: 'Chronologie de la transaction',
      acceptExchange: 'Accepter l\'échange',
      startPayment: 'Démarrer le paiement',
      submitProof: 'Soumettre une preuve',
      confirmReceipt: 'Confirmer la réception',
      openChat: 'Ouvrir le chat',
    },
    createOffer: {
      title: 'Créer une Offre',
      offering: 'Je propose',
      wantToReceive: 'Je souhaite recevoir',
      amount: 'Montant',
      exchangeRate: 'Taux de change',
      paymentMethods: 'Moyens de paiement',
      comment: 'Commentaire (Optionnel)',
      commentPlaceholder: 'Ajoutez des détails sur votre offre...',
      createOffer: 'Créer l\'offre',
    },
    tabs: {
      home: 'Accueil',
      transactions: 'Transactions',
      messages: 'Messages',
      profile: 'Profil',
    },
    auth: {
      loginRequired: 'Connexion requise',
      loginRequiredMessage: 'Connectez-vous pour continuer.',
      login: 'Se connecter',
      signup: 'S\'inscrire',
      guest: 'Invité',
    },
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      confirm: 'Confirmer',
      close: 'Fermer',
      back: 'Retour',
      next: 'Suivant',
      submit: 'Soumettre',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      security: 'Sécurité',
    },
  },
  en: {
    home: {
      title: 'Monilink',
      subtitle: 'Find the best exchange rates',
      searchPlaceholder: 'Search currency pairs...',
      activeOffers: 'Active Offers',
      available: 'available',
      avgExchangeRate: 'Avg. exchange rate',
      successRate: 'Success Rate',
      avgTime: 'Avg. Time',
    },
    kyc: {
      verificationRequired: 'Verification Required',
      verificationRequiredMessage: 'Please verify your identity to continue this exchange.',
      cancel: 'Cancel',
      verifyNow: 'Verify Now',
    },
    profile: {
      title: 'Profile',
      verifiedAccount: 'Verified Account',
      rating: 'Rating',
      swaps: 'Swaps',
      success: 'Success',
      paymentMethods: 'Payment Methods',
      preferredCurrencies: 'Preferred Currencies',
      menu: 'Menu',
      settings: 'Settings',
      notifications: 'Notifications',
      help: 'Help & Support',
      logout: 'Log Out',
      language: 'Language',
      kycStatus: 'KYC Status',
      notVerified: 'Not Verified',
      pending: 'Pending Review',
      verified: 'Verified',
      rejected: 'Rejected',
      information: 'Information',
      personalInfo: 'Personal Information',
      edit: 'Edit',
      verifyIdentity: 'Verify my identity',
      privacySecurity: 'Privacy & Security',
      changePassword: 'Change Password',
      biometricAuth: 'Biometric Authentication',
      connectedDevices: 'Connected Devices',
      deleteAccount: 'Delete Account',
      support: 'Support',
      faq: 'FAQ',
      contactSupport: 'Contact Support',
      evaluation: 'Evaluation',
      averageRating: 'Average Rating',
      totalExchanges: 'Total Exchanges',
      receivedReviews: 'Received Reviews',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      name: 'Name',
      firstName: 'First Name',
      lastName: 'Last Name',
    },
    transaction: {
      title: 'Transaction',
      proposed: 'Proposed',
      accepted: 'Accepted',
      inProgress: 'In Progress',
      proofSubmitted: 'Proof Submitted',
      validated: 'Validated',
      completed: 'Completed',
      cancelled: 'Cancelled',
      disputed: 'Disputed',
      exchangeDetails: 'Exchange Details',
      sending: 'Sending',
      receiving: 'Receiving',
      rate: 'Rate',
      paymentMethod: 'Payment Method',
      participants: 'Participants',
      timeline: 'Transaction Timeline',
      acceptExchange: 'Accept Exchange',
      startPayment: 'Start Payment',
      submitProof: 'Submit Proof',
      confirmReceipt: 'Confirm Receipt',
      openChat: 'Open Chat',
    },
    createOffer: {
      title: 'Create Offer',
      offering: 'I\'m Offering',
      wantToReceive: 'I Want to Receive',
      amount: 'Amount',
      exchangeRate: 'Exchange Rate',
      paymentMethods: 'Payment Methods',
      comment: 'Comment (Optional)',
      commentPlaceholder: 'Add details about your offer...',
      createOffer: 'Create Offer',
    },
    tabs: {
      home: 'Home',
      transactions: 'Transactions',
      messages: 'Messages',
      profile: 'Profile',
    },
    auth: {
      loginRequired: 'Login Required',
      loginRequiredMessage: 'Please log in to continue.',
      login: 'Log In',
      signup: 'Sign Up',
      guest: 'Guest',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      security: 'Security',
    },
  },
};

export const getTranslations = (language: Language): Translations => {
  return translations[language];
};
