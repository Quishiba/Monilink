import { Platform } from 'react-native';

export interface EmailConfig {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export interface EmailServiceResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

class EmailService {
  private apiEndpoint: string;

  constructor() {
    this.apiEndpoint = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || '';
  }

  async sendEmail(config: EmailConfig): Promise<EmailServiceResponse> {
    try {
      console.log('[EmailService] Sending email to:', config.to);
      console.log('[EmailService] Subject:', config.subject);

      if (Platform.OS === 'web') {
        console.log('[EmailService] Web platform - simulating email send');
        return {
          success: true,
          message: 'Email simulated on web',
          emailId: `web-${Date.now()}`,
        };
      }

      const response = await fetch(`${this.apiEndpoint}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[EmailService] Email sent successfully:', data);

      return {
        success: true,
        message: 'Email sent successfully',
        emailId: data.emailId,
      };
    } catch (error) {
      console.error('[EmailService] Failed to send email:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendTransactionStatusEmail(
    userEmail: string,
    userName: string,
    transactionId: string,
    status: string,
    currency: string,
    amount: number
  ): Promise<EmailServiceResponse> {
    const statusMessages: Record<string, { subject: string; body: string }> = {
      proposed: {
        subject: 'Nouvelle proposition d\'échange',
        body: `Bonjour ${userName},\n\nVous avez reçu une nouvelle proposition d'échange pour ${amount} ${currency}.\n\nTransaction ID: ${transactionId}\n\nConnectez-vous à l'application pour voir les détails.\n\nCordialement,\nL'équipe`,
      },
      accepted: {
        subject: 'Échange accepté',
        body: `Bonjour ${userName},\n\nVotre échange a été accepté!\n\nTransaction ID: ${transactionId}\nMontant: ${amount} ${currency}\n\nVous pouvez maintenant procéder au paiement.\n\nCordialement,\nL'équipe`,
      },
      in_progress: {
        subject: 'Paiement en cours',
        body: `Bonjour ${userName},\n\nLe paiement est en cours pour votre échange.\n\nTransaction ID: ${transactionId}\nMontant: ${amount} ${currency}\n\nVous serez notifié dès la réception.\n\nCordialement,\nL'équipe`,
      },
      proof_submitted: {
        subject: 'Preuve de paiement soumise',
        body: `Bonjour ${userName},\n\nUne preuve de paiement a été soumise pour votre transaction.\n\nTransaction ID: ${transactionId}\nMontant: ${amount} ${currency}\n\nVeuillez vérifier et confirmer la réception.\n\nCordialement,\nL'équipe`,
      },
      validated: {
        subject: 'Paiement validé',
        body: `Bonjour ${userName},\n\nLe paiement a été validé pour votre transaction.\n\nTransaction ID: ${transactionId}\nMontant: ${amount} ${currency}\n\nL'échange va être finalisé.\n\nCordialement,\nL'équipe`,
      },
      completed: {
        subject: 'Échange complété avec succès',
        body: `Bonjour ${userName},\n\nFélicitations! Votre échange a été complété avec succès.\n\nTransaction ID: ${transactionId}\nMontant: ${amount} ${currency}\n\nMerci d'avoir utilisé notre plateforme.\n\nCordialement,\nL'équipe`,
      },
      cancelled: {
        subject: 'Échange annulé',
        body: `Bonjour ${userName},\n\nVotre échange a été annulé.\n\nTransaction ID: ${transactionId}\nMontant: ${amount} ${currency}\n\nVous pouvez créer une nouvelle offre à tout moment.\n\nCordialement,\nL'équipe`,
      },
      disputed: {
        subject: 'Échange en litige',
        body: `Bonjour ${userName},\n\nVotre transaction est maintenant en litige.\n\nTransaction ID: ${transactionId}\nMontant: ${amount} ${currency}\n\nNotre équipe va examiner la situation et vous contacter prochainement.\n\nCordialement,\nL'équipe`,
      },
    };

    const config = statusMessages[status] || {
      subject: 'Mise à jour de transaction',
      body: `Bonjour ${userName},\n\nLe statut de votre transaction a été mis à jour.\n\nTransaction ID: ${transactionId}\n\nCordialement,\nL'équipe`,
    };

    return this.sendEmail({
      to: userEmail,
      subject: config.subject,
      body: config.body,
      html: config.body.replace(/\n/g, '<br>'),
    });
  }

  async sendKycStatusEmail(
    userEmail: string,
    userName: string,
    status: string,
    reason?: string
  ): Promise<EmailServiceResponse> {
    const statusMessages: Record<string, { subject: string; body: string }> = {
      pending: {
        subject: 'Vérification en cours',
        body: `Bonjour ${userName},\n\nVotre demande de vérification d'identité a été reçue et est en cours d'examen.\n\nNous vous contacterons dans les 24-48 heures.\n\nCordialement,\nL'équipe`,
      },
      verified: {
        subject: 'Compte vérifié!',
        body: `Bonjour ${userName},\n\nFélicitations! Votre compte a été vérifié avec succès.\n\nVous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.\n\nCordialement,\nL'équipe`,
      },
      rejected: {
        subject: 'Vérification nécessite attention',
        body: `Bonjour ${userName},\n\nVotre demande de vérification nécessite des informations supplémentaires.\n\n${reason ? `Raison: ${reason}\n\n` : ''}Veuillez vous connecter à l'application pour soumettre les documents nécessaires.\n\nCordialement,\nL'équipe`,
      },
    };

    const config = statusMessages[status] || {
      subject: 'Mise à jour de vérification',
      body: `Bonjour ${userName},\n\nLe statut de votre vérification a été mis à jour.\n\nCordialement,\nL'équipe`,
    };

    return this.sendEmail({
      to: userEmail,
      subject: config.subject,
      body: config.body,
      html: config.body.replace(/\n/g, '<br>'),
    });
  }

  async sendNewMessageEmail(
    userEmail: string,
    userName: string,
    senderName: string,
    transactionId: string,
    messagePreview: string
  ): Promise<EmailServiceResponse> {
    const preview = messagePreview.length > 100 
      ? messagePreview.substring(0, 100) + '...' 
      : messagePreview;

    return this.sendEmail({
      to: userEmail,
      subject: `Nouveau message de ${senderName}`,
      body: `Bonjour ${userName},\n\nVous avez reçu un nouveau message de ${senderName}.\n\nTransaction ID: ${transactionId}\n\nAperçu: "${preview}"\n\nConnectez-vous à l'application pour répondre.\n\nCordialement,\nL'équipe`,
      html: `Bonjour ${userName},<br><br>Vous avez reçu un nouveau message de <strong>${senderName}</strong>.<br><br>Transaction ID: ${transactionId}<br><br>Aperçu: "${preview}"<br><br>Connectez-vous à l'application pour répondre.<br><br>Cordialement,<br>L'équipe`,
    });
  }

  async sendAccountSuspensionEmail(
    userEmail: string,
    userName: string,
    reason: string
  ): Promise<EmailServiceResponse> {
    return this.sendEmail({
      to: userEmail,
      subject: 'Compte suspendu',
      body: `Bonjour ${userName},\n\nVotre compte a été suspendu.\n\nRaison: ${reason}\n\nSi vous pensez qu'il s'agit d'une erreur, veuillez contacter notre support.\n\nCordialement,\nL'équipe`,
      html: `Bonjour ${userName},<br><br>Votre compte a été suspendu.<br><br><strong>Raison:</strong> ${reason}<br><br>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre support.<br><br>Cordialement,<br>L'équipe`,
    });
  }

  async sendAccountReactivationEmail(
    userEmail: string,
    userName: string
  ): Promise<EmailServiceResponse> {
    return this.sendEmail({
      to: userEmail,
      subject: 'Compte réactivé',
      body: `Bonjour ${userName},\n\nBonne nouvelle! Votre compte a été réactivé.\n\nVous pouvez maintenant vous connecter et utiliser toutes les fonctionnalités.\n\nCordialement,\nL'équipe`,
      html: `Bonjour ${userName},<br><br>Bonne nouvelle! Votre compte a été réactivé.<br><br>Vous pouvez maintenant vous connecter et utiliser toutes les fonctionnalités.<br><br>Cordialement,<br>L'équipe`,
    });
  }

  async sendWelcomeEmail(
    userEmail: string,
    userName: string
  ): Promise<EmailServiceResponse> {
    return this.sendEmail({
      to: userEmail,
      subject: 'Bienvenue sur notre plateforme!',
      body: `Bonjour ${userName},\n\nBienvenue sur notre plateforme d'échange de devises!\n\nNous sommes ravis de vous avoir parmi nous. Voici quelques étapes pour commencer:\n\n1. Complétez votre vérification KYC\n2. Configurez vos moyens de paiement\n3. Parcourez les offres disponibles\n4. Créez votre première annonce\n\nSi vous avez des questions, n'hésitez pas à nous contacter.\n\nCordialement,\nL'équipe`,
      html: `Bonjour ${userName},<br><br>Bienvenue sur notre plateforme d'échange de devises!<br><br>Nous sommes ravis de vous avoir parmi nous. Voici quelques étapes pour commencer:<br><br>1. Complétez votre vérification KYC<br>2. Configurez vos moyens de paiement<br>3. Parcourez les offres disponibles<br>4. Créez votre première annonce<br><br>Si vous avez des questions, n'hésitez pas à nous contacter.<br><br>Cordialement,<br>L'équipe`,
    });
  }
}

export const emailService = new EmailService();

export async function sendTransactionNotificationEmail(
  userEmail: string,
  userName: string,
  transactionId: string,
  status: string,
  currency: string,
  amount: number
): Promise<EmailServiceResponse> {
  return emailService.sendTransactionStatusEmail(
    userEmail,
    userName,
    transactionId,
    status,
    currency,
    amount
  );
}

export async function sendKycNotificationEmail(
  userEmail: string,
  userName: string,
  status: string,
  reason?: string
): Promise<EmailServiceResponse> {
  return emailService.sendKycStatusEmail(userEmail, userName, status, reason);
}

export async function sendMessageNotificationEmail(
  userEmail: string,
  userName: string,
  senderName: string,
  transactionId: string,
  messagePreview: string
): Promise<EmailServiceResponse> {
  return emailService.sendNewMessageEmail(
    userEmail,
    userName,
    senderName,
    transactionId,
    messagePreview
  );
}
