import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import api from '../services/api';

export default function ConversationListScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await api.getConversations();
      setConversations(data.conversations || data || []);
    } catch (error) {
      console.log('加载对话列表失败', error);
      // 使用模拟数据
      setConversations([
        { id: '1', title: '股票分析讨论', lastMessage: '贵州茅台今天涨了3%', updatedAt: '10:30' },
        { id: '2', title: '文件解析助手', lastMessage: '已完成PDF文档分析', updatedAt: '昨天' },
        { id: '3', title: '日常对话', lastMessage: '好的，明白了', updatedAt: '昨天' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, title) => {
    Alert.alert('删除对话', `确定要删除"${title}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteConversation(id);
            setConversations((prev) => prev.filter((c) => c.id !== id));
          } catch (error) {
            setConversations((prev) => prev.filter((c) => c.id !== id));
          }
        },
      },
    ]);
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Chat', { conversationId: item.id, title: item.title })}
      onLongPress={() => handleDelete(item.id, item.title)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>💬</Text>
      </View>
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.conversationLastMessage} numberOfLines={1}>
          {item.lastMessage || item.last_message || '暂无消息'}
        </Text>
      </View>
      <Text style={styles.conversationTime}>{item.updatedAt || item.time || ''}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>对话列表</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.newChatButtonText}>+ 新对话</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>暂无对话</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={styles.emptyButtonText}>开始新对话</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: SIZES.fontSizeLarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  newChatButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
  },
  newChatButtonText: {
    color: COLORS.background,
    fontSize: SIZES.fontSizeSmall,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  conversationLastMessage: {
    fontSize: SIZES.fontSizeSmall,
    color: COLORS.textSecondary,
  },
  conversationTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: SIZES.fontSize,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  emptyButtonText: {
    color: COLORS.background,
    fontSize: SIZES.fontSize,
    fontWeight: '600',
  },
});
