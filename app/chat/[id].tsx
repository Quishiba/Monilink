import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft, Send, Paperclip } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Message } from '@/types';
import { sendMessageNotification } from '@/lib/notification-service';

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    transactionId: 'tx1',
    senderId: '1',
    content: 'Transaction has been proposed',
    type: 'system',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'm2',
    transactionId: 'tx1',
    senderId: '1',
    content: 'Hi! I can transfer within the next 2 hours. Is that okay?',
    type: 'text',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
  {
    id: 'm3',
    transactionId: 'tx1',
    senderId: 'me',
    content: 'Perfect! That works for me. I&apos;ll be ready to receive.',
    type: 'text',
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
  },
  {
    id: 'm4',
    transactionId: 'tx1',
    senderId: 'system',
    content: 'Transaction accepted',
    type: 'system',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'm5',
    transactionId: 'tx1',
    senderId: '1',
    content: 'Great! Starting the transfer now. My Orange Money number is +237 6XX XXX XXX',
    type: 'text',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'm6',
    transactionId: 'tx1',
    senderId: 'me',
    content: 'Received! Sending EUR via SEPA now. IBAN: BE71 XXXX XXXX XXXX',
    type: 'text',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { transactions, currentUser } = useApp();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.dark.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chat</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const transaction = transactions.find(tx => tx.id === id);
  const otherUser = transaction?.userA.id === currentUser.id ? transaction.userB : transaction?.userA;

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      transactionId: id as string,
      senderId: currentUser.id,
      content: inputText,
      type: 'text',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    if (otherUser) {
      const senderName = currentUser.firstName && currentUser.lastName 
        ? `${currentUser.firstName} ${currentUser.lastName.charAt(0)}.`
        : currentUser.name;
      
      await sendMessageNotification(
        senderName,
        inputText.substring(0, 100),
        id as string
      ).catch(error => {
        console.error('Failed to send message notification:', error);
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{otherUser?.name || 'Chat'}</Text>
            <Text style={styles.headerSubtitle}>Transaction #{id?.toString().slice(-4)}</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(message => {
            if (message.type === 'system') {
              return (
                <View key={message.id} style={styles.systemMessage}>
                  <Text style={styles.systemMessageText}>{message.content}</Text>
                </View>
              );
            }

            const isMe = message.senderId === currentUser.id;
            return (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  isMe ? styles.messageContainerMe : styles.messageContainerOther,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMe ? styles.messageTextMe : styles.messageTextOther,
                    ]}
                  >
                    {message.content}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      isMe ? styles.messageTimeMe : styles.messageTimeOther,
                    ]}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={colors.dark.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.dark.textSecondary}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  placeholder: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 16,
  },
  systemMessageText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageContainerMe: {
    alignSelf: 'flex-end',
  },
  messageContainerOther: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleMe: {
    backgroundColor: colors.dark.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: colors.dark.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTextMe: {
    color: colors.dark.text,
  },
  messageTextOther: {
    color: colors.dark.text,
  },
  messageTime: {
    fontSize: 11,
  },
  messageTimeMe: {
    color: colors.dark.text,
    opacity: 0.7,
  },
  messageTimeOther: {
    color: colors.dark.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    gap: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.dark.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.primary,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
