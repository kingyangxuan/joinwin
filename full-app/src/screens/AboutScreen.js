import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function AboutScreen({ navigation }) {
  const handleOpenUrl = (url) => {
    Linking.openURL(url).catch(() => Alert.alert('提示', '无法打开链接'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>关于 Joinwin</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🦁</Text>
          </View>
          <Text style={styles.appName}>Joinwin</Text>
          <Text style={styles.version}>版本 1.0.0</Text>
          <Text style={styles.slogan}>智能对话助手 · 让AI更懂你</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>功能介绍</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>💬 智能对话 - 基于大语言模型的自然对话</Text>
            <Text style={styles.featureItem}>📈 股票分析 - 实时行情、K线图、大盘概览</Text>
            <Text style={styles.featureItem}>🖼️ 图片识别 - 上传图片智能识别内容</Text>
            <Text style={styles.featureItem}>📄 文件解析 - 支持PDF/Word/Excel/TXT/CSV</Text>
            <Text style={styles.featureItem}>🎤 语音对话 - 语音输入输出，解放双手</Text>
            <Text style={styles.featureItem}>🛡️ 管理后台 - 用户管理、数据统计、对话管理</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>技术支持</Text>
          <TouchableOpacity style={styles.item} onPress={() => handleOpenUrl('https://j.windyme.com')}>
            <Text style={styles.itemIcon}>🌐</Text>
            <Text style={styles.itemText}>官方网站</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('HelpFeedback')}>
            <Text style={styles.itemIcon}>❓</Text>
            <Text style={styles.itemText}>帮助中心</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => Alert.alert('提示', '当前已是最新版本')}>
            <Text style={styles.itemIcon}>🔄</Text>
            <Text style={styles.itemText}>检查更新</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>法律信息</Text>
          <TouchableOpacity style={styles.item} onPress={() => Alert.alert('用户协议', 'Joinwin用户协议...\n\n使用本应用即表示您同意遵守相关条款。')}>
            <Text style={styles.itemIcon}>📜</Text>
            <Text style={styles.itemText}>用户协议</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => Alert.alert('隐私政策', 'Joinwin隐私政策...\n\n我们重视您的隐私，所有数据均加密存储。')}>
            <Text style={styles.itemIcon}>🔒</Text>
            <Text style={styles.itemText}>隐私政策</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => Alert.alert('开源许可', '本应用使用了以下开源项目：\n\n- React Native\n- React Navigation\n- AsyncStorage\n- 以及其他开源组件')}>
            <Text style={styles.itemIcon}>📦</Text>
            <Text style={styles.itemText}>开源许可</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Joinwin. All rights reserved.</Text>
          <Text style={styles.footerText}>Made with ❤️ in China</Text>
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
  logoSection: { alignItems: 'center', padding: 32, backgroundColor: COLORS.background, marginBottom: 12 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoEmoji: { fontSize: 40 },
  appName: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  version: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary, marginBottom: 8 },
  slogan: { fontSize: SIZES.fontSize, color: COLORS.textSecondary },
  section: { backgroundColor: COLORS.background, marginBottom: 12 },
  sectionTitle: { fontSize: SIZES.fontSizeSmall, fontWeight: '600', color: COLORS.textSecondary, paddingHorizontal: SIZES.padding, paddingTop: 16, paddingBottom: 8 },
  featureList: { paddingHorizontal: SIZES.padding, paddingBottom: 16 },
  featureItem: { fontSize: SIZES.fontSizeSmall, color: COLORS.text, lineHeight: 24, marginBottom: 4 },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.padding, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemIcon: { fontSize: 20, marginRight: 12 },
  itemText: { flex: 1, fontSize: SIZES.fontSize, color: COLORS.text },
  arrow: { fontSize: 24, color: COLORS.textMuted },
  footer: { alignItems: 'center', padding: 24 },
  footerText: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
});
