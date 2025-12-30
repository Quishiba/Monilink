import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function MessagesScreen() {
  const router = useRouter();
  const { offers } = useApp();

  const conversations = offers.slice(0, 6).map((offer, index) => ({
    id: offer.id,
    user: offer.user,
    lastMessage: [
      'Hey, is this offer still available?',
      'Yes! I can do the exchange tomorrow',
      'Perfect, what time works for you?',
      'I sent the payment',
      'Thanks! Transaction completed',
      'Can you send me your payment details?'
    ][index],
    timestamp: new Date(Date.now() - index * 3600000),
    unread: index % 3 === 0,
  }));

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>{conversations.filter(c => c.unread).length} unread</Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {conversations.map(conversation => {
            const hoursAgo = Math.floor((Date.now() - conversation.timestamp.getTime()) / (1000 * 60 * 60));
            const timeText = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`;

            return (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationCard}
                onPress={() => router.push(`/chat/${conversation.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{conversation.user.name[0]}</Text>
                  {conversation.unread && <View style={styles.unreadDot} />}
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.userName}>{conversation.user.name}</Text>
                    <Text style={styles.timestamp}>{timeText}</Text>
                  </View>
                  <Text
                    style={[styles.lastMessage, conversation.unread && styles.unreadMessage]}
                    numberOfLines={1}
                  >
                    {conversation.lastMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.dark.secondary,
    borderWidth: 2,
    borderColor: colors.dark.surface,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  unreadMessage: {
    color: colors.dark.text,
    fontWeight: '500' as const,
  },
});
