// 对话页 - 核心页面
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { theme } from '../constants/theme';
import { useStore } from '../store/useStore';
import {
  sendMessageStream,
  getMessages,
  createConversation,
  getConversations,
} from '../services/api';
import type { Message } from '../types';

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    currentConversationId,
    messages,
    setMessages,
    addMessage,
    updateLastMessage,
    setCurrentConversation,
    setConversations,
    addConversation,
    isStreaming,
    setStreaming,
  } = useStore();

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const initialMessageSent = useRef(false);

  // 初始化：加载对话消息
  useEffect(() => {
    const init = async () => {
      let convId = currentConversationId || route.params?.conversationId;
      
      if (!convId) {
        // 创建新对话
        try {
          const res = await createConversation('新对话');
          if (res.success || res.id) {
            const conv = res.data || res;
            convId = conv.id;
            addConversation(conv);
            setCurrentConversation(conv.id);
          }
        } catch (error) {
          console.error('创建对话失败', error);
        }
      }

      // 加载历史消息
      if (convId) {
        try {
          const res = await getMessages(convId);
          if (res.success && res.data) {
            setMessages(res.data);
          }
        } catch (error) {
          console.error('加载消息失败', error);
        }
      }

      // 发送初始消息（从欢迎页带过来的）
      const initialMsg = route.params?.initialMessage;
      if (initialMsg && !initialMessageSent.current) {
        initialMessageSent.current = true;
        setTimeout(() => handleSend(initialMsg), 300);
      }
    };

    init();
  }, []);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 发送消息
  const handleSend = async (content?: string) => {
    const text = (content || inputText).trim();
    if (!text || isStreaming) return;

    const convId = currentConversationId || route.params?.conversationId;
    if (!convId) {
      Alert.alert('错误', '对话不存在，请返回重试');
      return;
    }

    // 添加用户消息
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      conversation_id: convId,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInputText('');
    setStreaming(true);

    // 添加空的 AI 消息占位
    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      conversation_id: convId,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    };
    addMessage(aiMsg);

    // SSE 流式输出
    try {
      await sendMessageStream(convId, text, {
        onChunk: (chunk) => {
          updateLastMessage(chunk);
        },
        onDone: () => {
          setStreaming(false);
        },
        onError: (error) => {
          console.error('流式输出错误', error);
          updateLastMessage('\n\n[连接中断，请重试]');
          setStreaming(false);
        },
      });
    } catch (error: any) {
      console.error('发送消息失败', error);
      updateLastMessage(`\n\n[发送失败: ${error.message || '网络错误'}]`);
      setStreaming(false);
    }
  };

  // 选择图片
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        Alert.alert('提示', '图片上传功能开发中，敬请期待');
      }
    } catch (error) {
      console.error('选择图片失败', error);
    }
  };

  // 选择文件
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'text/csv'],
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets[0]) {
        Alert.alert('提示', '文件上传功能开发中，敬请期待');
      }
    } catch (error) {
      console.error('选择文件失败', error);
    }
  };

  // 渲染消息
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    const isEmpty = !item.content && item.role === 'assistant';

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && (
          <Image
            source={require('../assets/lion.png')}
            style={styles.aiAvatar}
            resizeMode="contain"
          />
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          {isEmpty ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
              {item.content}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image
            source={require('../assets/lion.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Joinwin</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* 消息列表 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      />

      {/* 底部输入区 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            {/* 附件按钮 */}
            <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
              <Ionicons name="attach" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* 图片按钮 */}
            <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* 输入框 */}
            <TextInput
              style={styles.input}
              placeholder="输入消息..."
              placeholderTextColor={theme.colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              onSubmitEditing={() => handleSend()}
            />

            {/* 语音按钮 */}
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="mic-outline" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* 发送按钮 */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isStreaming) && styles.sendButtonDisabled,
              ]}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || isStreaming}
            >
              {isStreaming ? (
                <ActivityIndicator size="small" color={theme.colors.textWhite} />
              ) : (
                <Ionicons name="arrow-up" size={20} color={theme.colors.textWhite} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundChat,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
  },
  moreButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-end',
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: theme.colors.userBubble,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: theme.colors.aiBubble,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: theme.colors.textWhite,
  },
  aiText: {
    color: theme.colors.text,
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.backgroundGray,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  attachButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 40,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
});
