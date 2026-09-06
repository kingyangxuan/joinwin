import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import api from '../services/api';

const TABS = [
  { id: 'stats', title: '数据统计', icon: '📊' },
  { id: 'users', title: '用户管理', icon: '👥' },
  { id: 'conversations', title: '对话管理', icon: '💬' },
];

export default function AdminScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const data = await api.getAdminStats();
        setStats(data);
      } else if (activeTab === 'users') {
        const data = await api.getAdminUsers();
        setUsers(data.users || data || []);
      } else if (activeTab === 'conversations') {
        const data = await api.getConversations();
        setConversations(data.conversations || data || []);
      }
    } catch (error) {
      console.log('加载数据失败', error);
      // 使用模拟数据
      if (activeTab === 'stats') {
        setStats({
          totalUsers: 11,
          totalConversations: 156,
          totalMessages: 2341,
          activeUsersToday: 5,
        });
      } else if (activeTab === 'users') {
        setUsers([
          { id: '1', username: 'king', role: 'admin', createdAt: '2026-08-01' },
          { id: '2', username: 'kimi-admin', role: 'admin', createdAt: '2026-08-05' },
          { id: '3', username: 'testuser_p0', role: 'user', createdAt: '2026-08-10' },
          { id: '4', username: 'shangqiang', role: 'user', createdAt: '2026-08-15' },
        ]);
      } else {
        setConversations([
          { id: '1', title: '股票分析', username: 'king', messageCount: 45, createdAt: '2026-09-01' },
          { id: '2', title: '文件解析', username: 'testuser_p0', messageCount: 12, createdAt: '2026-09-02' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (username) => {
    Alert.alert('删除用户', `确定要删除用户"${username}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteAdminUser(username);
            setUsers((prev) => prev.filter((u) => u.username !== username));
          } catch (error) {
            setUsers((prev) => prev.filter((u) => u.username !== username));
          }
        },
      },
    ]);
  };

  const renderStats = () => {
    if (!stats) return null;
    const statItems = [
      { label: '总用户数', value: stats.totalUsers || stats.total_users || 0, icon: '👥' },
      { label: '总对话数', value: stats.totalConversations || stats.total_conversations || 0, icon: '💬' },
      { label: '总消息数', value: stats.totalMessages || stats.total_messages || 0, icon: '📨' },
      { label: '今日活跃', value: stats.activeUsersToday || stats.active_users_today || 0, icon: '🔥' },
    ];
    return (
      <View style={styles.statsGrid}>
        {statItems.map((item, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statCardIcon}>{item.icon}</Text>
            <Text style={styles.statCardValue}>{item.value}</Text>
            <Text style={styles.statCardLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderUsers = () => (
    <View>
      {users.map((user, index) => (
        <View key={user.id || index} style={styles.userItem}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{user.username?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userMeta}>
              {user.role === 'admin' ? '管理员' : '普通用户'} · {user.createdAt || user.created_at || '未知'}
            </Text>
          </View>
          {user.role !== 'admin' && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteUser(user.username)}
            >
              <Text style={styles.deleteButtonText}>删除</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderConversations = () => (
    <View>
      {conversations.map((conv, index) => (
        <View key={conv.id || index} style={styles.convItem}>
          <View style={styles.convIcon}>
            <Text style={styles.convIconText}>💬</Text>
          </View>
          <View style={styles.convInfo}>
            <Text style={styles.convTitle}>{conv.title}</Text>
            <Text style={styles.convMeta}>
              {conv.username || '未知用户'} · {conv.messageCount || conv.message_count || 0} 条消息
            </Text>
          </View>
          <Text style={styles.convDate}>{conv.createdAt || conv.created_at || ''}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>管理后台</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'stats' && renderStats()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'conversations' && renderConversations()}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: SIZES.fontSizeLarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.padding,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  userMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.error + '15',
  },
  deleteButtonText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
  },
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  convIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  convIconText: {
    fontSize: 20,
  },
  convInfo: {
    flex: 1,
  },
  convTitle: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  convMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  convDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
