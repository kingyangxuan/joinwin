// 欢迎页
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useStore } from '../store/useStore';
import { createConversation } from '../services/api';

const quickActions = [
  { icon: 'trending-up', title: '股票分析', desc: '查询行情、K线、大盘', color: '#EF4444' },
  { icon: 'document-text', title: '文件解析', desc: 'PDF/Word/Excel 智能解读', color: '#3B82F6' },
  { icon: 'image', title: '图片识别', desc: '上传图片，AI 理解内容', color: '#8B5CF6' },
  { icon: 'mic', title: '语音对话', desc: '说话就能聊，解放双手', color: '#22C55E' },
];

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const { user, addConversation, setCurrentConversation } = useStore();
  const [inputText, setInputText] = useState('');

  const startChat = async (initialMessage?: string) => {
    try {
      const res = await createConversation('新对话');
      if (res.success || res.id) {
        const conv = res.data || res;
        addConversation(conv);
        setCurrentConversation(conv.id);
        navigation.navigate('Chat', {
          initialMessage: initialMessage || '',
          conversationId: conv.id,
        });
      }
    } catch (error) {
      console.error('创建对话失败', error);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    const messages: Record<string, string> = {
      '股票分析': '帮我分析一下今天的大盘走势',
      '文件解析': '我上传一个文件，帮我解读一下',
      '图片识别': '我发一张图片，帮我看看里面有什么',
      '语音对话': '用语音和我聊天吧',
    };
    startChat(messages[action.title] || '');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/lion.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Joinwin</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 欢迎语 */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            {user ? `你好，${user.username}` : '你好'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            有什么可以帮你的？
          </Text>
        </View>

        {/* 快捷功能 */}
        <View style={styles.quickSection}>
          <Text style={styles.sectionTitle}>快捷功能</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickCard}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.7}
              >
                <View style={[styles.quickIcon, { backgroundColor: action.color + '15' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickTitle}>{action.title}</Text>
                <Text style={styles.quickDesc}>{action.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 历史对话入口 */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons name="time" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.historyText}>查看历史对话</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      </ScrollView>

      {/* 底部输入框 */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="输入消息，开始对话..."
            placeholderTextColor={theme.colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => {
              if (inputText.trim()) {
                const msg = inputText.trim();
                setInputText('');
                startChat(msg);
              }
            }}
            disabled={!inputText.trim()}
          >
            <Ionicons name="arrow-up" size={20} color={theme.colors.textWhite} />
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  menuButton: {
    padding: 6,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 32,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  quickSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 14,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    width: '48%',
    backgroundColor: theme.colors.backgroundGray,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  quickDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: theme.colors.backgroundGray,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.backgroundGray,
    borderRadius: theme.radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    maxHeight: 100,
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
});
