export type Language = 'fr' | 'en' | 'de';

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
    loginToAccessProfile: string;
    login: string;
    signup: string;
    guest: string;
    loginTitle: string;
    loginSubtitle: string;
    emailOrPhone: string;
    password: string;
    forgotPassword: string;
    noAccount: string;
    registerTitle: string;
    registerSubtitle: string;
    confirmPassword: string;
    agreeToTerms: string;
    createAccount: string;
    haveAccount: string;
    resetPasswordTitle: string;
    resetPasswordSubtitle: string;
    sendResetCode: string;
    resetCodeSent: string;
    resetCodeSentMessage: string;
    backToLogin: string;
    verificationRequired: string;
    verificationRequiredMsg: string;
    verifyAccount: string;
    later: string;
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
      loginToAccessProfile: 'Veuillez vous connecter pour accéder à votre profil.',
      login: 'Se connecter',
      signup: 'S\'inscrire',
      guest: 'Invité',
      loginTitle: 'Bienvenue',
      loginSubtitle: 'Connectez-vous pour accéder à toutes les fonctionnalités',
      emailOrPhone: 'Email ou Téléphone',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      noAccount: 'Pas de compte?',
      registerTitle: 'Créer un compte',
      registerSubtitle: 'Rejoignez Monilink et commencez à échanger',
      confirmPassword: 'Confirmer le mot de passe',
      agreeToTerms: 'J\'accepte les Conditions d\'utilisation',
      createAccount: 'Créer un compte',
      haveAccount: 'Vous avez déjà un compte?',
      resetPasswordTitle: 'Réinitialiser le mot de passe',
      resetPasswordSubtitle: 'Entrez votre email ou téléphone pour recevoir un code',
      sendResetCode: 'Envoyer le code',
      resetCodeSent: 'Code envoyé',
      resetCodeSentMessage: 'Nous avons envoyé un code de réinitialisation à votre email/téléphone',
      backToLogin: 'Retour à la connexion',
      verificationRequired: 'Vérification requise',
      verificationRequiredMsg: 'Veuillez vérifier votre compte pour continuer',
      verifyAccount: 'Vérifier le compte',
      later: 'Plus tard',
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
      loginToAccessProfile: 'Please log in to access your profile.',
      login: 'Log In',
      signup: 'Sign Up',
      guest: 'Guest',
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Log in to access all features',
      emailOrPhone: 'Email or Phone',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      noAccount: 'Don\'t have an account?',
      registerTitle: 'Create Account',
      registerSubtitle: 'Join Monilink and start exchanging',
      confirmPassword: 'Confirm Password',
      agreeToTerms: 'I agree to the Terms of Service',
      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      resetPasswordTitle: 'Reset Password',
      resetPasswordSubtitle: 'Enter your email or phone to receive a reset code',
      sendResetCode: 'Send Reset Code',
      resetCodeSent: 'Code Sent',
      resetCodeSentMessage: 'We\'ve sent a reset code to your email/phone',
      backToLogin: 'Back to Login',
      verificationRequired: 'Verification Required',
      verificationRequiredMsg: 'Please verify your account to continue',
      verifyAccount: 'Verify Account',
      later: 'Later',
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
  de: {
    home: {
      title: 'Monilink',
      subtitle: 'Finden Sie die besten Wechselkurse',
      searchPlaceholder: 'Währungspaare suchen...',
      activeOffers: 'Aktive Angebote',
      available: 'verfügbar',
      avgExchangeRate: 'Durchschn. Wechselkurs',
      successRate: 'Erfolgsquote',
      avgTime: 'Durchschn. Zeit',
    },
    kyc: {
      verificationRequired: 'Verifizierung erforderlich',
      verificationRequiredMessage: 'Bitte verifizieren Sie Ihre Identität, um diesen Austausch fortzusetzen.',
      cancel: 'Abbrechen',
      verifyNow: 'Jetzt verifizieren',
    },
    profile: {
      title: 'Profil',
      verifiedAccount: 'Verifiziertes Konto',
      rating: 'Bewertung',
      swaps: 'Austausche',
      success: 'Erfolg',
      paymentMethods: 'Zahlungsmethoden',
      preferredCurrencies: 'Bevorzugte Währungen',
      menu: 'Menü',
      settings: 'Einstellungen',
      notifications: 'Benachrichtigungen',
      help: 'Hilfe & Support',
      logout: 'Abmelden',
      language: 'Sprache',
      kycStatus: 'KYC-Status',
      notVerified: 'Nicht verifiziert',
      pending: 'Wird überprüft',
      verified: 'Verifiziert',
      rejected: 'Abgelehnt',
      information: 'Informationen',
      personalInfo: 'Persönliche Informationen',
      edit: 'Bearbeiten',
      verifyIdentity: 'Identität verifizieren',
      privacySecurity: 'Datenschutz & Sicherheit',
      changePassword: 'Passwort ändern',
      biometricAuth: 'Biometrische Authentifizierung',
      connectedDevices: 'Verbundene Geräte',
      deleteAccount: 'Konto löschen',
      support: 'Support',
      faq: 'FAQ',
      contactSupport: 'Support kontaktieren',
      evaluation: 'Bewertung',
      averageRating: 'Durchschnittliche Bewertung',
      totalExchanges: 'Gesamtzahl der Austausche',
      receivedReviews: 'Erhaltene Bewertungen',
      termsOfService: 'Nutzungsbedingungen',
      privacyPolicy: 'Datenschutzrichtlinie',
      email: 'E-Mail',
      phone: 'Telefon',
      address: 'Adresse',
      name: 'Name',
      firstName: 'Vorname',
      lastName: 'Nachname',
    },
    transaction: {
      title: 'Transaktion',
      proposed: 'Vorgeschlagen',
      accepted: 'Akzeptiert',
      inProgress: 'In Bearbeitung',
      proofSubmitted: 'Nachweis eingereicht',
      validated: 'Validiert',
      completed: 'Abgeschlossen',
      cancelled: 'Storniert',
      disputed: 'Streitig',
      exchangeDetails: 'Austauschdetails',
      sending: 'Senden',
      receiving: 'Empfangen',
      rate: 'Kurs',
      paymentMethod: 'Zahlungsmethode',
      participants: 'Teilnehmer',
      timeline: 'Transaktionsverlauf',
      acceptExchange: 'Austausch akzeptieren',
      startPayment: 'Zahlung starten',
      submitProof: 'Nachweis einreichen',
      confirmReceipt: 'Empfang bestätigen',
      openChat: 'Chat öffnen',
    },
    createOffer: {
      title: 'Angebot erstellen',
      offering: 'Ich biete an',
      wantToReceive: 'Ich möchte erhalten',
      amount: 'Betrag',
      exchangeRate: 'Wechselkurs',
      paymentMethods: 'Zahlungsmethoden',
      comment: 'Kommentar (Optional)',
      commentPlaceholder: 'Fügen Sie Details zu Ihrem Angebot hinzu...',
      createOffer: 'Angebot erstellen',
    },
    tabs: {
      home: 'Startseite',
      transactions: 'Transaktionen',
      messages: 'Nachrichten',
      profile: 'Profil',
    },
    auth: {
      loginRequired: 'Anmeldung erforderlich',
      loginRequiredMessage: 'Bitte zuerst einloggen, um fortzufahren.',
      loginToAccessProfile: 'Bitte melden Sie sich an, um auf Ihr Profil zuzugreifen.',
      login: 'Einloggen',
      signup: 'Registrieren',
      guest: 'Gast',
      loginTitle: 'Willkommen zurück',
      loginSubtitle: 'Melden Sie sich an, um auf alle Funktionen zuzugreifen',
      emailOrPhone: 'E-Mail oder Telefon',
      password: 'Passwort',
      forgotPassword: 'Passwort vergessen?',
      noAccount: 'Noch kein Konto?',
      registerTitle: 'Konto erstellen',
      registerSubtitle: 'Treten Sie Monilink bei und beginnen Sie zu tauschen',
      confirmPassword: 'Passwort bestätigen',
      agreeToTerms: 'Ich akzeptiere die Nutzungsbedingungen',
      createAccount: 'Konto erstellen',
      haveAccount: 'Bereits ein Konto?',
      resetPasswordTitle: 'Passwort zurücksetzen',
      resetPasswordSubtitle: 'Geben Sie Ihre E-Mail oder Telefon ein, um einen Code zu erhalten',
      sendResetCode: 'Code senden',
      resetCodeSent: 'Code gesendet',
      resetCodeSentMessage: 'Wir haben einen Zurücksetzungscode an Ihre E-Mail/Telefon gesendet',
      backToLogin: 'Zurück zur Anmeldung',
      verificationRequired: 'Verifizierung erforderlich',
      verificationRequiredMsg: 'Bitte Konto verifizieren, um einen Exchange zu starten',
      verifyAccount: 'Jetzt verifizieren',
      later: 'Später',
    },
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      confirm: 'Bestätigen',
      close: 'Schließen',
      back: 'Zurück',
      next: 'Weiter',
      submit: 'Einreichen',
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
      security: 'Sicherheit',
    },
  },
};

export const getTranslations = (language: Language): Translations => {
  return translations[language];
};
