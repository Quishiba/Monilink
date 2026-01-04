import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AdminContext, useAdmin } from '@/context/AdminContext';
import { MessageSquare, Trash2, AlertTriangle, User } from 'lucide-react-native';

function ChatModerationContent() {
  const router = useRouter();
  const { messages, isLoadingMessages, deleteMessage } = useAdmin();
  const [showFlagged, setShowFlagged] = useState(false);

  const handleDeleteMessage = (messageId: string, senderId: string) => {
    Alert.prompt(
      'Delete Message',
      `Enter reason for deleting message from ${senderId}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: (reason?: string) => {
            if (reason && reason.trim()) {
              deleteMessage(messageId, reason);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'system': return '#6B7280';
      case 'image': return '#3B82F6';
      default: return '#111827';
    }
  };

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
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MessageSquare size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <View style={styles.senderInfo}>
                  <View style={styles.senderAvatar}>
                    <User size={20} color="#6B7280" />
                  </View>
                  <View style={styles.senderDetails}>
                    <Text style={styles.senderId}>{message.senderId}</Text>
                    <Text style={styles.timestamp}>
                      {new Date(message.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: getMessageTypeColor(message.type) + '15' }]}>
                  <Text style={[styles.typeText, { color: getMessageTypeColor(message.type) }]}>
                    {message.type}
                  </Text>
                </View>
              </View>

              <View style={styles.messageBody}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionLabel}>Transaction:</Text>
                  <Text style={styles.transactionId}>{message.transactionId}</Text>
                </View>

                <View style={styles.contentContainer}>
                  <Text style={styles.contentLabel}>Content:</Text>
                  <Text style={styles.contentText}>{message.content}</Text>
                </View>

                {message.imageUrl && (
                  <View style={styles.imageInfo}>
                    <Text style={styles.imageLabel}>📎 Image attached</Text>
                  </View>
                )}
              </View>

              <View style={styles.messageActions}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => router.push(`/chat/${message.transactionId}` as any)}
                >
                  <Text style={styles.viewButtonText}>View Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMessage(message.id, message.senderId)}
                >
                  <Trash2 size={16} color="#EF4444" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  senderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderDetails: {
    marginLeft: 10,
    flex: 1,
  },
  senderId: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
  },
  messageBody: {
    marginBottom: 12,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 6,
  },
  transactionId: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#4F46E5',
  },
  contentContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contentLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#6B7280',
    marginBottom: 6,
  },
  contentText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  imageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  imageLabel: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500' as const,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 6,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
});
