import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const FAQ = [
  { q: '如何使用股票功能？', a: '在对话中直接输入股票名称或代码，Joinwin会自动识别并查询实时行情，支持A股、港股、美股。' },
  { q: '支持哪些文件格式？', a: '支持PDF、DOCX、XLSX、TXT、CSV等常见格式，文件大小不超过20MB。' },
  { q: '图片识别怎么用？', a: '在对话中点击图片按钮上传图片，Joinwin会自动识别图片内容并作为上下文进行分析。' },
  { q: '语音对话如何开启？', a: '在设置中开启语音输入输出，对话中按住麦克风按钮说话，AI回复会自动朗读。' },
  { q: '对话记录会保存吗？', a: '所有对话记录都会保存在服务器上，登录后可以在对话列表中查看历史记录。' },
  { q: '如何联系客服？', a: '可以通过下方反馈按钮提交问题，或发送邮件至 support@joinwin.com。' },
];

export default function HelpFeedbackScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('提示', '请输入反馈内容');
      return;
    }
    Alert.alert('提交成功', '感谢您的反馈，我们会尽快处理！', [
      { text: '确定', onPress: () => { setFeedback(''); setContact(''); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>帮助与反馈</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常见问题</Text>
          {FAQ.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity style={styles.faqQuestion} onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                <Text style={styles.faqQuestionText}>{item.q}</Text>
                <Text style={styles.faqArrow}>{expandedIndex === index ? '−' : '+'}</Text>
              </TouchableOpacity>
              {expandedIndex === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>意见反馈</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>反馈内容</Text>
            <TextInput style={[styles.input, styles.textArea]} value={feedback} onChangeText={setFeedback}
              placeholder="请描述您遇到的问题或建议..." placeholderTextColor={COLORS.textMuted}
              multiline numberOfLines={5} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>联系方式（选填）</Text>
            <TextInput style={styles.input} value={contact} onChangeText={setContact}
              placeholder="手机号或邮箱，方便我们联系您" placeholderTextColor={COLORS.textMuted} />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
            <Text style={styles.submitButtonText}>提交反馈</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>联系我们</Text>
          <Text style={styles.contactItem}>📧 support@joinwin.com</Text>
          <Text style={styles.contactItem}>🌐 https://j.windyme.com</Text>
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
  section: { backgroundColor: COLORS.background, marginBottom: 12, paddingBottom: 16 },
  sectionTitle: { fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, padding: SIZES.padding, paddingBottom: 8 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  faqQuestion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.padding, paddingVertical: 14 },
  faqQuestionText: { flex: 1, fontSize: SIZES.fontSize, color: COLORS.text, fontWeight: '500' },
  faqArrow: { fontSize: 20, color: COLORS.textSecondary, marginLeft: 12 },
  faqAnswer: { paddingHorizontal: SIZES.padding, paddingBottom: 14, backgroundColor: COLORS.surface },
  faqAnswerText: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary, lineHeight: 20 },
  inputGroup: { paddingHorizontal: SIZES.padding, marginBottom: 16 },
  label: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 12, fontSize: SIZES.fontSize, color: COLORS.text, backgroundColor: COLORS.surface },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: { marginHorizontal: SIZES.padding, backgroundColor: COLORS.primary, borderRadius: SIZES.radius, padding: 14, alignItems: 'center' },
  submitButtonText: { color: COLORS.background, fontSize: SIZES.fontSize, fontWeight: '600' },
  contactSection: { alignItems: 'center', padding: 24 },
  contactTitle: { fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  contactItem: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary, marginBottom: 8 },
});
