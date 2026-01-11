import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { MOCK_USERS } from "@/mocks/users";
import { Transaction, Message } from "@/types";
import { emailService } from "@/lib/email-service";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn1',
    offerId: 'off1',
    userA: MOCK_USERS[0],
    userB: MOCK_USERS[1],
    giveCurrency: 'EUR',
    giveAmount: 500,
    getCurrency: 'XAF',
    getAmount: 328000,
    rate: 656,
    status: 'accepted',
    paymentMethod: 'SEPA',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn2',
    offerId: 'off2',
    userA: MOCK_USERS[2],
    userB: MOCK_USERS[3],
    giveCurrency: 'GBP',
    giveAmount: 1000,
    getCurrency: 'EUR',
    getAmount: 1175,
    rate: 1.175,
    status: 'in_progress',
    paymentMethod: 'Bank Transfer',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn3',
    offerId: 'off3',
    userA: MOCK_USERS[4],
    userB: MOCK_USERS[0],
    giveCurrency: 'USD',
    giveAmount: 800,
    getCurrency: 'EUR',
    getAmount: 740,
    rate: 0.925,
    status: 'completed',
    paymentMethod: 'Wise',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn4',
    offerId: 'off4',
    userA: MOCK_USERS[1],
    userB: MOCK_USERS[2],
    giveCurrency: 'XAF',
    giveAmount: 200000,
    getCurrency: 'EUR',
    getAmount: 305,
    rate: 655.74,
    status: 'disputed',
    paymentMethod: 'Mobile Money',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn5',
    offerId: 'off5',
    userA: MOCK_USERS[3],
    userB: MOCK_USERS[4],
    giveCurrency: 'EUR',
    giveAmount: 250,
    getCurrency: 'XOF',
    getAmount: 164000,
    rate: 656,
    status: 'completed',
    paymentMethod: 'Mobile Money',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg1',
    transactionId: 'txn1',
    senderId: '1',
    content: 'Hi! I am ready to proceed with the transaction.',
    type: 'text',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg2',
    transactionId: 'txn1',
    senderId: '2',
    content: 'Great! Please send the payment to my account.',
    type: 'text',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg3',
    transactionId: 'txn2',
    senderId: '3',
    content: 'Payment sent! Please confirm.',
    type: 'text',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg4',
    transactionId: 'txn2',
    senderId: '4',
    content: 'Received! I will send my part now.',
    type: 'text',
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg5',
    transactionId: 'txn3',
    senderId: '5',
    content: 'Transaction completed successfully! Thank you.',
    type: 'text',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg6',
    transactionId: 'txn4',
    senderId: '2',
    content: 'I did not receive the full amount!',
    type: 'text',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg7',
    transactionId: 'txn4',
    senderId: '3',
    content: 'I sent the correct amount. Please check again.',
    type: 'text',
    timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
  },
];

export const adminRouter = createTRPCRouter({
  getStats: publicProcedure.query(() => {
    return {
      totalUsers: 1247,
      activeUsers: 892,
      suspendedUsers: 12,
      totalTransactions: 5634,
      pendingTransactions: 23,
      completedTransactions: 5401,
      disputedTransactions: 8,
      pendingKYC: 45,
      verifiedKYC: 1102,
      rejectedKYC: 15,
      totalMessages: 28934,
      flaggedMessages: 3,
    };
  }),

  getUsers: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        search: z.string().optional(),
        filter: z.enum(['all', 'active', 'suspended', 'kyc_pending']).default('all'),
      })
    )
    .query(({ input }) => {
      let filteredUsers = [...MOCK_USERS];

      if (input.filter === 'kyc_pending') {
        filteredUsers = filteredUsers.filter(u => u.kycStatus === 'pending');
      } else if (input.filter === 'suspended') {
        filteredUsers = filteredUsers.filter(u => u.kycStatus === 'rejected');
      } else if (input.filter === 'active') {
        filteredUsers = filteredUsers.filter(u => u.kycStatus === 'verified');
      }

      if (input.search) {
        const searchLower = input.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
          u.name.toLowerCase().includes(searchLower) ||
          u.id.toLowerCase().includes(searchLower)
        );
      }

      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / input.limit);
      const start = (input.page - 1) * input.limit;
      const users = filteredUsers.slice(start, start + input.limit);

      return {
        users,
        total,
        page: input.page,
        totalPages,
      };
    }),

  getUserDetails: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return null;
    }),

  suspendUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string(),
        userEmail: z.string().optional(),
        userName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Admin] Suspending user:', input.userId);
      
      if (input.userEmail && input.userName) {
        await emailService.sendAccountSuspensionEmail(
          input.userEmail,
          input.userName,
          input.reason
        );
      }
      
      return { success: true };
    }),

  activateUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        userEmail: z.string().optional(),
        userName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Admin] Activating user:', input.userId);
      
      if (input.userEmail && input.userName) {
        await emailService.sendAccountReactivationEmail(
          input.userEmail,
          input.userName
        );
      }
      
      return { success: true };
    }),

  getTransactions: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z.string().optional(),
      })
    )
    .query(({ input }) => {
      let filteredTransactions = [...MOCK_TRANSACTIONS];

      if (input.status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === input.status);
      }

      const total = filteredTransactions.length;
      const totalPages = Math.ceil(total / input.limit);
      const start = (input.page - 1) * input.limit;
      const transactions = filteredTransactions.slice(start, start + input.limit);

      return {
        transactions,
        total,
        page: input.page,
        totalPages,
      };
    }),

  updateTransactionStatus: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
        status: z.string(),
        note: z.string().optional(),
        userEmail: z.string().optional(),
        userName: z.string().optional(),
        currency: z.string().optional(),
        amount: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Admin] Updating transaction status:', input.transactionId, input.status);
      
      if (input.userEmail && input.userName && input.currency && input.amount) {
        await emailService.sendTransactionStatusEmail(
          input.userEmail,
          input.userName,
          input.transactionId,
          input.status,
          input.currency,
          input.amount
        );
      }
      
      return { success: true };
    }),

  getKYCVerifications: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z.enum(['pending', 'verified', 'rejected', 'all']).default('pending'),
      })
    )
    .query(({ input }) => {
      let filteredUsers = [...MOCK_USERS];

      if (input.status !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.kycStatus === input.status);
      }

      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / input.limit);
      const start = (input.page - 1) * input.limit;
      const verifications = filteredUsers.slice(start, start + input.limit);

      return {
        verifications,
        total,
        page: input.page,
        totalPages,
      };
    }),

  verifyKYC: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        note: z.string().optional(),
        userEmail: z.string().optional(),
        userName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Admin] Verifying KYC for user:', input.userId);
      
      if (input.userEmail && input.userName) {
        await emailService.sendKycStatusEmail(
          input.userEmail,
          input.userName,
          'verified'
        );
      }
      
      return { success: true };
    }),

  rejectKYC: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string(),
        userEmail: z.string().optional(),
        userName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Admin] Rejecting KYC for user:', input.userId);
      
      if (input.userEmail && input.userName) {
        await emailService.sendKycStatusEmail(
          input.userEmail,
          input.userName,
          'rejected',
          input.reason
        );
      }
      
      return { success: true };
    }),

  getMessages: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        flagged: z.boolean().default(false),
      })
    )
    .query(({ input }) => {
      const filteredMessages = [...MOCK_MESSAGES];

      const total = filteredMessages.length;
      const totalPages = Math.ceil(total / input.limit);
      const start = (input.page - 1) * input.limit;
      const messages = filteredMessages.slice(start, start + input.limit);

      return {
        messages,
        total,
        page: input.page,
        totalPages,
      };
    }),

  deleteMessage: publicProcedure
    .input(
      z.object({
        messageId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(({ input }) => {
      return { success: true };
    }),

  getActivityLogs: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
      })
    )
    .query(({ input }) => {
      return {
        logs: [],
        total: 0,
        page: input.page,
        totalPages: 0,
      };
    }),
});
