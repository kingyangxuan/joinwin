// 对话列表页 - 历史对话记录
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useStore } from '../store/useStore';
import { getConversations, deleteConversation, createConversation } from '../services/api';
import type { Conversation } from '../types';

export default function ConversationListScreen() {
  const navigation = useNavigation<any>();
  const { conversations, setConversations, setCurrentConversation, removeConversation } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
      }
    } catch (error) {
      console.error('加载对话失败', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await createConversation('新对话');
      if (res.success || res.id) {
        const conv = res.data || res;
        setCurrentConversation(conv.id);
        navigation.navigate('Chat', { conversationId: conv.id });
      }
    } catch (error) {
      console.error('创建对话失败', error);
    }
  };

  const handlePress = (item: Conversation) => {
    setCurrentConversation(item.id);
    navigation.navigate('Chat', { conversationId: item.id });
  };

  const handleDelete = (item: Conversation) => {
    Alert.alert('删除对话', `确定删除"${item.title}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteConversation(item.id);
            removeConversation(item.id);
          } catch (error) {
            console.error('删除失败', error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handlePress(item)}
      onLongPress={() => handleDelete(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.conversationTime}>{formatTime(item.updated_at)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color={theme.colors.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>历史对话</Text>
        <TouchableOpacity onPress={handleNewChat} style={styles.newButton}>
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 对话列表 */}
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadConversations}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>暂无对话</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleNewChat}>
              <Text style={styles.emptyButtonText}>开始新对话</Text>
            </TouchableOpacity>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
  },
  newButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-end',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  conversationTime: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  deleteButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginLeft: 56,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textTertiary,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textWhite,
  },
});
