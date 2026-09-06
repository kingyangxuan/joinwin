import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const QUICK_PROMPTS = [
  { icon: '📈', title: '股票分析', desc: '查询股票行情和分析' },
  { icon: '📄', title: '文件解析', desc: '上传文档智能分析' },
  { icon: '🖼️', title: '图片识别', desc: '识别图片内容' },
  { icon: '🎤', title: '语音对话', desc: '语音输入输出' },
];

export default function WelcomeScreen({ navigation }) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      navigation.navigate('Chat', { initialMessage: inputText });
      setInputText('');
    }
  };

  const handleQuickPrompt = (prompt) => {
    navigation.navigate('Chat', { initialMessage: prompt });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🦁</Text>
          </View>
          <Text style={styles.welcomeTitle}>你好，我是 Joinwin</Text>
          <Text style={styles.welcomeSubtitle}>有什么可以帮你的吗？</Text>
        </View>

        <View style={styles.quickPrompts}>
          <Text style={styles.sectionTitle}>快捷功能</Text>
          <View style={styles.promptGrid}>
            {QUICK_PROMPTS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.promptCard}
                onPress={() => handleQuickPrompt(item.title)}
              >
                <Text style={styles.promptIcon}>{item.icon}</Text>
                <Text style={styles.promptTitle}>{item.title}</Text>
                <Text style={styles.promptDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="输入你的问题..."
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hintText}>Joinwin 可能会出错，请核实重要信息</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 36,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: SIZES.fontSize,
    color: COLORS.textSecondary,
  },
  quickPrompts: {
    paddingHorizontal: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  promptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  promptCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  promptIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  promptTitle: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  promptDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: SIZES.fontSize,
    color: COLORS.text,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  sendButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintText: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
