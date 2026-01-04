import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AdminContext, useAdmin } from '@/context/AdminContext';
import { useApp } from '@/context/AppContext';
import { MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react-native';

function ChatModerationContent() {
  const router = useRouter();
  const { messages, isLoadingMessages } = useAdmin();
  const { transactions } = useApp();
  const [showFlagged, setShowFlagged] = useState(false);

  const conversationsList = useMemo(() => {
    const conversationsMap = new Map<string, {
      transactionId: string;
      lastMessage: string;
      lastMessageTime: string;
      messageCount: number;
      userAName: string;
      userBName: string;
    }>();

    messages.forEach(message => {
      const existing = conversationsMap.get(message.transactionId);
      if (!existing || new Date(message.timestamp) > new Date(existing.lastMessageTime)) {
        const transaction = transactions.find(t => t.id === message.transactionId);
        conversationsMap.set(message.transactionId, {
          transactionId: message.transactionId,
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          messageCount: (existing?.messageCount || 0) + 1,
          userAName: transaction?.userA.name || 'User A',
          userBName: transaction?.userB.name || 'User B',
        });
      }
    });

    return Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  }, [messages, transactions]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chat Moderation</Text>
      </View>

      <View style={styles.filterSection}>
        <TouchableOpacity
          style={[styles.filterButton, !showFlagged && styles.filterButtonActive]}
          onPress={() => setShowFlagged(false)}
        >
          <Text style={[styles.filterButtonText, !showFlagged && styles.filterButtonTextActive]}>
            All Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, showFlagged && styles.filterButtonActive]}
          onPress={() => setShowFlagged(true)}
        >
          <AlertTriangle size={16} color={showFlagged ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.filterButtonText, showFlagged && styles.filterButtonTextActive]}>
            Flagged Only
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoadingMessages ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading conversations...</Text>
          </View>
        ) : conversationsList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MessageSquare size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>
              {conversationsList.length} Conversation{conversationsList.length !== 1 ? 's' : ''}
            </Text>
            {conversationsList.map((conversation) => (
              <TouchableOpacity
                key={conversation.transactionId}
                style={styles.conversationCard}
                onPress={() => router.push(`/chat/${conversation.transactionId}` as any)}
              >
                <View style={styles.conversationIcon}>
                  <MessageSquare size={24} color="#4F46E5" />
                </View>
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationTitle}>
                      {conversation.userAName} ↔ {conversation.userBName}
                    </Text>
                    <Text style={styles.conversationTime}>
                      {new Date(conversation.lastMessageTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View style={styles.conversationDetails}>
                    <Text style={styles.conversationId} numberOfLines={1}>
                      Transaction: {conversation.transactionId}
                    </Text>
                    <View style={styles.messageCountBadge}>
                      <Text style={styles.messageCountText}>
                        {conversation.messageCount} msg{conversation.messageCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.lastMessage} numberOfLines={2}>
                    {conversation.lastMessage}
                  </Text>
                </View>
                <ArrowRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ChatModeration() {
  return (
    <AdminContext>
      <ChatModerationContent />
    </AdminContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111827',
  },
  filterSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#4F46E5',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 12,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  conversationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#111827',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  conversationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  conversationId: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  messageCountBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  messageCountText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  lastMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  messageCard: {
    display: 'none',
  },
});
