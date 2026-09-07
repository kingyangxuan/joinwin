import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  const [markdownEnabled, setMarkdownEnabled] = useState(true);
  const [streamOutput, setStreamOutput] = useState(true);

  const handleClearCache = () => {
    Alert.alert('清除缓存', '确定要清除所有缓存数据吗？', [
      { text: '取消', style: 'cancel' },
      { text: '清除', style: 'destructive', onPress: () => Alert.alert('提示', '缓存已清除') },
    ]);
  };

  const renderSettingItem = (icon, title, desc, right) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingInfo}>
          <Text style={styles.settingText}>{title}</Text>
          {desc ? <Text style={styles.settingDesc}>{desc}</Text> : null}
        </View>
      </View>
      {right}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通用设置</Text>
          {renderSettingItem('🌙', '深色模式', '切换深色/浅色主题',
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />)}
          {renderSettingItem('📜', '自动滚动', '新消息自动滚动到底部',
            <Switch value={autoScroll} onValueChange={setAutoScroll} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />)}
          {renderSettingItem('👤', '显示头像', '对话中显示用户和AI头像',
            <Switch value={showAvatar} onValueChange={setShowAvatar} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />)}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>对话设置</Text>
          {renderSettingItem('📝', 'Markdown渲染', '启用Markdown和代码高亮',
            <Switch value={markdownEnabled} onValueChange={setMarkdownEnabled} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />)}
          {renderSettingItem('⚡', '流式输出', 'AI回复逐字显示',
            <Switch value={streamOutput} onValueChange={setStreamOutput} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />)}
          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('VoiceSettings')}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🎤</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>语音设置</Text>
                <Text style={styles.settingDesc}>ASR/TTS模型、音色、语速</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据管理</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🗑️</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>清除缓存</Text>
                <Text style={styles.settingDesc}>清除本地缓存数据</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('提示', '数据导出功能开发中...')}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📤</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>导出对话</Text>
                <Text style={styles.settingDesc}>导出对话记录为文件</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('NotificationSettings')}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>通知设置</Text>
                <Text style={styles.settingDesc}>消息通知、推送设置</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('HelpFeedback')}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>❓</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>帮助与反馈</Text>
                <Text style={styles.settingDesc}>常见问题、意见反馈</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('About')}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>ℹ️</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>关于 Joinwin</Text>
                <Text style={styles.settingDesc}>版本信息、用户协议</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingTop: 50, paddingBottom: 16, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: COLORS.text },
  headerTitle: { fontSize: SIZES.fontSizeLarge, fontWeight: 'bold', color: COLORS.text },
  content: { paddingBottom: 20 },
  section: { backgroundColor: COLORS.background, marginBottom: 12 },
  sectionTitle: { fontSize: SIZES.fontSizeSmall, fontWeight: '600', color: COLORS.textSecondary, paddingHorizontal: SIZES.padding, paddingTop: 16, paddingBottom: 8 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { fontSize: 20, marginRight: 12 },
  settingInfo: { flex: 1 },
  settingText: { fontSize: SIZES.fontSize, color: COLORS.text },
  settingDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  arrow: { fontSize: 24, color: COLORS.textMuted },
});
