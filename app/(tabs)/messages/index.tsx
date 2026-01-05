import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoreVertical } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { useEffect, useState } from 'react';

function ConversationCard({ conversation, onPress }: { conversation: any; onPress: () => void }) {
  const { t } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const hoursAgo = Math.floor((Date.now() - conversation.timestamp.getTime()) / (1000 * 60 * 60));
  const timeText = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`;

  const handleHideMessage = () => {
    setShowMenu(false);
    Alert.alert(t.common.success, t.common.hideMessage);
  };

  const handleReportMessage = () => {
    setShowMenu(false);
    Alert.alert(t.common.success, t.common.reportMessage);
  };

  const handleBlockUser = () => {
    setShowMenu(false);
    Alert.alert(t.common.success, t.common.blockUser);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{conversation.user.name[0]}</Text>
          {conversation.unread && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.userName}>{conversation.user.name}</Text>
            <View style={styles.messageHeaderRight}>
              <Text style={styles.timestamp}>{timeText}</Text>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setShowMenu(true);
                }}
                style={styles.menuButton}
                activeOpacity={0.7}
              >
                <MoreVertical size={18} color={colors.dark.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[styles.lastMessage, conversation.unread && styles.unreadMessage]}
            numberOfLines={1}
          >
            {conversation.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleHideMessage}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t.common.hideMessage}</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleReportMessage}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, styles.menuItemWarning]}>{t.common.reportMessage}</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleBlockUser}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>{t.common.blockUser}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const { offers, isAuthenticated, t } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.authGuardContainer}>
            <Text style={styles.authGuardTitle}>{t.auth.loginRequired}</Text>
            <Text style={styles.authGuardMessage}>{t.auth.loginRequiredMessage}</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>{t.auth.login}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => router.push('/register')}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>{t.auth.signup}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
          {conversations.map(conversation => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onPress={() => router.push(`/chat/${conversation.id}`)}
            />
          ))}
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
  messageHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
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
  authGuardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authGuardTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  authGuardMessage: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  signupButton: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    width: '80%',
    maxWidth: 300,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.dark.text,
    textAlign: 'center',
  },
  menuItemWarning: {
    color: '#F59E0B',
  },
  menuItemDanger: {
    color: '#EF4444',
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.dark.border,
  },
});
