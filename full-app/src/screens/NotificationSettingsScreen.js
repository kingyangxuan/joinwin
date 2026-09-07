import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function NotificationSettingsScreen({ navigation }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [messageNotify, setMessageNotify] = useState(true);
  const [systemNotify, setSystemNotify] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(true);

  const renderItem = (title, desc, value, onValueChange) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{title}</Text>
        {desc ? <Text style={styles.itemDesc}>{desc}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通知设置</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>推送通知</Text>
          {renderItem('允许推送通知', '接收Joinwin的推送通知', pushEnabled, setPushEnabled)}
          {pushEnabled && (
            <>
              {renderItem('新消息通知', '收到AI回复时推送通知', messageNotify, setMessageNotify)}
              {renderItem('系统通知', '系统公告、活动通知', systemNotify, setSystemNotify)}
            </>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>提醒方式</Text>
          {renderItem('声音', '通知时播放提示音', soundEnabled, setSoundEnabled)}
          {renderItem('震动', '通知时震动提醒', vibrationEnabled, setVibrationEnabled)}
          {renderItem('内容预览', '通知栏显示消息内容预览', previewEnabled, setPreviewEnabled)}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>免打扰</Text>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>免打扰时段</Text>
              <Text style={styles.itemDesc}>设置免打扰时间段，期间不接收通知</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>重要联系人</Text>
              <Text style={styles.itemDesc}>免打扰期间仍接收重要联系人通知</Text>
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
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: SIZES.fontSize, color: COLORS.text },
  itemDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  arrow: { fontSize: 24, color: COLORS.textMuted },
});
