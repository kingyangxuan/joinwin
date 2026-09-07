import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const SKILL_CATEGORIES = [
  {
    title: '金融分析',
    skills: [
      { id: 'stock', name: '股票行情', icon: '📈', desc: '实时查询股票行情、K线图、大盘指数', enabled: true },
      { id: 'stock-analysis', name: '股票分析', icon: '📊', desc: 'AI智能分析股票走势、资金流向、技术指标', enabled: true },
      { id: 'finance', name: '财务分析', icon: '💰', desc: '分析财报、估值、盈利能力', enabled: false },
    ],
  },
  {
    title: '内容创作',
    skills: [
      { id: 'writing', name: '文章写作', icon: '✍️', desc: '撰写文章、报告、文案', enabled: true },
      { id: 'translate', name: '翻译助手', icon: '🌐', desc: '多语言互译、专业术语翻译', enabled: true },
      { id: 'summary', name: '内容摘要', icon: '📝', desc: '长文本摘要、要点提取', enabled: true },
      { id: 'code', name: '代码助手', icon: '💻', desc: '代码生成、调试、解释', enabled: true },
    ],
  },
  {
    title: '多媒体处理',
    skills: [
      { id: 'image-recognize', name: '图片识别', icon: '🖼️', desc: '识别图片内容、文字提取', enabled: true },
      { id: 'file-parse', name: '文件解析', icon: '📄', desc: '解析PDF、Word、Excel、TXT文件', enabled: true },
      { id: 'voice', name: '语音对话', icon: '🎤', desc: '语音输入输出、实时对话', enabled: true },
      { id: 'mermaid', name: '图表渲染', icon: '📊', desc: 'Mermaid流程图、时序图渲染', enabled: true },
    ],
  },
  {
    title: '生活助手',
    skills: [
      { id: 'search', name: '联网搜索', icon: '🔍', desc: '实时联网搜索最新信息', enabled: true },
      { id: 'weather', name: '天气查询', icon: '🌤️', desc: '查询天气预报、空气质量', enabled: false },
      { id: 'calendar', name: '日程管理', icon: '📅', desc: '管理日程、提醒、待办', enabled: false },
    ],
  },
];

export default function SkillsScreen({ navigation }) {
  const handleSkillPress = (skill) => {
    if (skill.enabled) {
      navigation.navigate('Chat', { skill: skill.id, skillName: skill.name });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>技能中心</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {SKILL_CATEGORIES.map((category, catIndex) => (
          <View key={catIndex} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.skills.map((skill) => (
              <TouchableOpacity key={skill.id} style={[styles.skillItem, !skill.enabled && styles.disabledSkill]}
                onPress={() => handleSkillPress(skill)}>
                <View style={styles.skillIconContainer}>
                  <Text style={styles.skillIcon}>{skill.icon}</Text>
                </View>
                <View style={styles.skillInfo}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillDesc}>{skill.desc}</Text>
                </View>
                {skill.enabled ? (
                  <Text style={styles.useButton}>使用</Text>
                ) : (
                  <Text style={styles.comingSoon}>即将上线</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  category: { marginBottom: 16 },
  categoryTitle: { fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, paddingHorizontal: SIZES.padding, paddingVertical: 12 },
  skillItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, padding: SIZES.padding, marginHorizontal: SIZES.padding, marginBottom: 8, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border },
  disabledSkill: { opacity: 0.6 },
  skillIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  skillIcon: { fontSize: 24 },
  skillInfo: { flex: 1 },
  skillName: { fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  skillDesc: { fontSize: 12, color: COLORS.textSecondary },
  useButton: { fontSize: SIZES.fontSizeSmall, color: COLORS.primary, fontWeight: '600', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.primaryLight, borderRadius: 8 },
  comingSoon: { fontSize: 12, color: COLORS.textMuted, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: COLORS.surface, borderRadius: 6 },
});
