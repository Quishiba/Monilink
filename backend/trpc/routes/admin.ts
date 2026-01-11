import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { MOCK_USERS } from "@/mocks/users";

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
      })
    )
    .mutation(({ input }) => {
      return { success: true };
    }),

  activateUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input }) => {
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
      return {
        transactions: [],
        total: 0,
        page: input.page,
        totalPages: 0,
      };
    }),

  updateTransactionStatus: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
        status: z.string(),
        note: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
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
      return {
        verifications: [],
        total: 0,
        page: input.page,
        totalPages: 0,
      };
    }),

  verifyKYC: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        note: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      return { success: true };
    }),

  rejectKYC: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(({ input }) => {
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
      return {
        messages: [],
        total: 0,
        page: input.page,
        totalPages: 0,
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
