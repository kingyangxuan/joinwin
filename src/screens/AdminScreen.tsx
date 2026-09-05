// 管理员后台页 - 数据统计/用户管理/对话管理
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useStore } from '../store/useStore';
import {
  getAdminStats,
  getAdminUsers,
  getAdminConversations,
  deleteAdminUser,
  deleteAdminConversation,
} from '../services/api';

type TabType = 'stats' | 'users' | 'conversations';

export default function AdminScreen() {
  const navigation = useNavigation<any>();
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'stats') loadStats();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'conversations') loadConversations();
  }, [activeTab]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await getAdminStats();
      if (res.success && res.data) setStats(res.data);
    } catch (error) {
      console.error('加载统计失败', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      if (res.success && res.data) setUsers(res.data);
    } catch (error) {
      console.error('加载用户失败', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await getAdminConversations();
      if (res.success && res.data) setConversations(res.data);
    } catch (error) {
      console.error('加载对话失败', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (item: any) => {
    Alert.alert('删除用户', `确定删除用户"${item.username}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAdminUser(item.username);
            setUsers(users.filter((u) => u.id !== item.id));
          } catch (error) {
            console.error('删除失败', error);
          }
        },
      },
    ]);
  };

  const handleDeleteConversation = (item: any) => {
    Alert.alert('删除对话', '确定删除这个对话吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAdminConversation(item.id);
            setConversations(conversations.filter((c) => c.id !== item.id));
          } catch (error) {
            console.error('删除失败', error);
          }
        },
      },
    ]);
  };

  const renderStats = () => (
    <ScrollView contentContainerStyle={styles.statsContainer}>
      <View style={styles.statsGrid}>
        <StatCard icon="people" label="总用户数" value={stats?.total_users || 0} color={theme.colors.primary} />
        <StatCard icon="chatbubbles" label="总对话数" value={stats?.total_conversations || 0} color={theme.colors.info} />
        <StatCard icon="chatbox" label="总消息数" value={stats?.total_messages || 0} color={theme.colors.success} />
        <StatCard icon="flash" label="今日活跃" value={stats?.today_active_users || 0} color={theme.colors.warning} />
      </View>
    </ScrollView>
  );

  const renderUsers = () => (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      refreshing={loading}
      onRefresh={loadUsers}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <View style={[styles.userAvatar, item.role === 'admin' ? styles.adminAvatar : null]}>
            <Text style={styles.avatarText}>{item.username?.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.username}</Text>
            <Text style={styles.itemSubtitle}>
              {item.role === 'admin' ? '管理员' : '普通用户'} · {item.conversation_count || 0} 个对话
            </Text>
          </View>
          {item.username !== user?.username && (
            <TouchableOpacity onPress={() => handleDeleteUser(item)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
    />
  );

  const renderConversations = () => (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshing={loading}
      onRefresh={loadConversations}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <View style={styles.convIcon}>
            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.title || '未命名对话'}</Text>
            <Text style={styles.itemSubtitle}>{item.username || '未知用户'} · {new Date(item.created_at).toLocaleDateString('zh-CN')}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDeleteConversation(item)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>管理后台</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab 切换 */}
      <View style={styles.tabBar}>
        {(['stats', 'users', 'conversations'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'stats' ? '数据统计' : tab === 'users' ? '用户管理' : '对话管理'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 内容 */}
      <View style={styles.content}>
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'conversations' && renderConversations()}
      </View>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundGray,
  },
  tabItemActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.textWhite,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.backgroundGray,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminAvatar: {
    backgroundColor: theme.colors.primary,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  convIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  deleteBtn: {
    padding: 8,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginLeft: 56,
  },
});
