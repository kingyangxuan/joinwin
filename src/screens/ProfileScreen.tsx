// 个人资料/设置页
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useStore } from '../store/useStore';
import { logout as apiLogout } from '../services/api';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useStore();

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiLogout();
          } catch (error) {
            console.error('退出失败', error);
          }
          logout();
        },
      },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert('清除缓存', '确定要清除所有缓存吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '清除',
        style: 'destructive',
        onPress: () => {
          Alert.alert('成功', '缓存已清除');
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'chatbubbles-outline',
      title: '历史对话',
      subtitle: '查看所有对话记录',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('ConversationList'),
    },
    {
      icon: 'trending-up-outline',
      title: '股票行情',
      subtitle: '查看大盘和个股行情',
      color: theme.colors.stockUp,
      onPress: () => navigation.navigate('StockDetail', { code: 'sh000001' }),
    },
    ...(user?.role === 'admin'
      ? [
          {
            icon: 'settings-outline',
            title: '管理后台',
            subtitle: '用户管理、数据统计',
            color: theme.colors.info,
            onPress: () => navigation.navigate('Admin'),
          },
        ]
      : []),
    {
      icon: 'trash-outline',
      title: '清除缓存',
      subtitle: '释放存储空间',
      color: theme.colors.warning,
      onPress: handleClearCache,
    },
    {
      icon: 'information-circle-outline',
      title: '关于 Joinwin',
      subtitle: '版本 1.0.0',
      color: theme.colors.textSecondary,
      onPress: () => Alert.alert('关于 Joinwin', 'Joinwin 智能对话助手\n版本 1.0.0\n\n基于 React Native 开发\n支持 iOS / Android'),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>个人中心</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 用户信息卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.username || '未登录'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role === 'admin' ? '管理员' : '普通用户'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
        </View>

        {/* 菜单列表 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 退出登录 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        {/* 底部版权 */}
        <Text style={styles.footerText}>Joinwin © 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: theme.colors.background,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textWhite,
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  menuSection: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.error,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
});
