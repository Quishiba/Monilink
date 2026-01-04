import createContextHook from '@nkzw/create-context-hook';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { User, Transaction, Message, AdminLog } from '@/types';


export const [AdminContext, useAdmin] = createContextHook(() => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'transactions' | 'kyc' | 'messages'>('overview');
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'suspended' | 'kyc_pending'>('all');
  const [kycFilter, setKycFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending');
  const [transactionFilter, setTransactionFilter] = useState<string | undefined>(undefined);

  const statsQuery = trpc.admin.getStats.useQuery();
  
  const usersQuery = trpc.admin.getUsers.useQuery({
    page: 1,
    limit: 20,
    filter: userFilter,
  });

  const transactionsQuery = trpc.admin.getTransactions.useQuery({
    page: 1,
    limit: 20,
    status: transactionFilter,
  });

  const kycQuery = trpc.admin.getKYCVerifications.useQuery({
    page: 1,
    limit: 20,
    status: kycFilter,
  });

  const messagesQuery = trpc.admin.getMessages.useQuery({
    page: 1,
    limit: 50,
    flagged: false,
  });

  const logsQuery = trpc.admin.getActivityLogs.useQuery({
    page: 1,
    limit: 50,
  });

  const suspendUserMutation = trpc.admin.suspendUser.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
      statsQuery.refetch();
    },
  });

  const activateUserMutation = trpc.admin.activateUser.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
      statsQuery.refetch();
    },
  });

  const verifyKYCMutation = trpc.admin.verifyKYC.useMutation({
    onSuccess: () => {
      kycQuery.refetch();
      statsQuery.refetch();
    },
  });

  const rejectKYCMutation = trpc.admin.rejectKYC.useMutation({
    onSuccess: () => {
      kycQuery.refetch();
      statsQuery.refetch();
    },
  });

  const updateTransactionMutation = trpc.admin.updateTransactionStatus.useMutation({
    onSuccess: () => {
      transactionsQuery.refetch();
      statsQuery.refetch();
    },
  });

  const deleteMessageMutation = trpc.admin.deleteMessage.useMutation({
    onSuccess: () => {
      messagesQuery.refetch();
      statsQuery.refetch();
    },
  });

  return {
    selectedTab,
    setSelectedTab,
    userFilter,
    setUserFilter,
    kycFilter,
    setKycFilter,
    transactionFilter,
    setTransactionFilter,
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    users: (usersQuery.data?.users || []) as User[],
    isLoadingUsers: usersQuery.isLoading,
    transactions: (transactionsQuery.data?.transactions || []) as Transaction[],
    isLoadingTransactions: transactionsQuery.isLoading,
    kycVerifications: (kycQuery.data?.verifications || []) as User[],
    isLoadingKYC: kycQuery.isLoading,
    messages: (messagesQuery.data?.messages || []) as Message[],
    isLoadingMessages: messagesQuery.isLoading,
    logs: (logsQuery.data?.logs || []) as AdminLog[],
    isLoadingLogs: logsQuery.isLoading,
    suspendUser: (userId: string, reason: string) => 
      suspendUserMutation.mutate({ userId, reason }),
    activateUser: (userId: string) => 
      activateUserMutation.mutate({ userId }),
    verifyKYC: (userId: string, note?: string) => 
      verifyKYCMutation.mutate({ userId, note }),
    rejectKYC: (userId: string, reason: string) => 
      rejectKYCMutation.mutate({ userId, reason }),
    updateTransaction: (transactionId: string, status: string, note?: string) => 
      updateTransactionMutation.mutate({ transactionId, status, note }),
    deleteMessage: (messageId: string, reason: string) => 
      deleteMessageMutation.mutate({ messageId, reason }),
    isSuspending: suspendUserMutation.isPending,
    isActivating: activateUserMutation.isPending,
    isVerifying: verifyKYCMutation.isPending,
    isRejecting: rejectKYCMutation.isPending,
    isUpdatingTransaction: updateTransactionMutation.isPending,
    isDeletingMessage: deleteMessageMutation.isPending,
  };
});
