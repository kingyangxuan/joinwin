import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Slider } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const ASR_MODELS = [
  { id: 'sensevoice', name: 'SenseVoice', desc: '本地部署，响应快' },
  { id: 'whisper', name: 'Whisper Large', desc: '识别准确率高' },
  { id: 'funasr', name: 'FunASR', desc: '中文优化' },
];

const TTS_MODELS = [
  { id: 'cosyvoice3', name: 'CosyVoice 3', desc: '本地部署，自然流畅' },
  { id: 'chattts', name: 'ChatTTS', desc: '对话式语音' },
  { id: 'edge-tts', name: 'Edge TTS', desc: '微软在线语音' },
];

const VOICES = [
  { id: 'female1', name: '温柔女声', sample: '你好，我是Joinwin' },
  { id: 'female2', name: '知性女声', sample: '今天天气不错' },
  { id: 'male1', name: '磁性男声', sample: '有什么可以帮你的' },
  { id: 'male2', name: '沉稳男声', sample: '分析结果如下' },
];

export default function VoiceSettingsScreen({ navigation }) {
  const [asrEnabled, setAsrEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [selectedAsr, setSelectedAsr] = useState('sensevoice');
  const [selectedTts, setSelectedTts] = useState('cosyvoice3');
  const [selectedVoice, setSelectedVoice] = useState('female1');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>语音设置</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>语音输入 (ASR)</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>启用语音输入</Text>
              <Text style={styles.settingDesc}>按住说话，自动转文字</Text>
            </View>
            <Switch value={asrEnabled} onValueChange={setAsrEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />
          </View>
          {asrEnabled && (
            <View style={styles.modelList}>
              {ASR_MODELS.map((model) => (
                <TouchableOpacity key={model.id} style={[styles.modelItem, selectedAsr === model.id && styles.selectedModel]}
                  onPress={() => setSelectedAsr(model.id)}>
                  <View style={styles.modelInfo}>
                    <Text style={styles.modelName}>{model.name}</Text>
                    <Text style={styles.modelDesc}>{model.desc}</Text>
                  </View>
                  {selectedAsr === model.id && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>语音输出 (TTS)</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>启用语音播报</Text>
              <Text style={styles.settingDesc}>AI回复自动朗读</Text>
            </View>
            <Switch value={ttsEnabled} onValueChange={setTtsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>自动播放</Text>
              <Text style={styles.settingDesc}>收到回复自动播放语音</Text>
            </View>
            <Switch value={autoPlay} onValueChange={setAutoPlay}
              trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.background} />
          </View>
          {ttsEnabled && (
            <>
              <Text style={styles.subTitle}>语音模型</Text>
              <View style={styles.modelList}>
                {TTS_MODELS.map((model) => (
                  <TouchableOpacity key={model.id} style={[styles.modelItem, selectedTts === model.id && styles.selectedModel]}
                    onPress={() => setSelectedTts(model.id)}>
                    <View style={styles.modelInfo}>
                      <Text style={styles.modelName}>{model.name}</Text>
                      <Text style={styles.modelDesc}>{model.desc}</Text>
                    </View>
                    {selectedTts === model.id && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.subTitle}>音色选择</Text>
              <View style={styles.voiceGrid}>
                {VOICES.map((voice) => (
                  <TouchableOpacity key={voice.id} style={[styles.voiceItem, selectedVoice === voice.id && styles.selectedVoice]}
                    onPress={() => setSelectedVoice(voice.id)}>
                    <Text style={styles.voiceIcon}>🔊</Text>
                    <Text style={[styles.voiceName, selectedVoice === voice.id && styles.selectedVoiceText]}>{voice.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>语速: {speed.toFixed(1)}x</Text>
                <Slider minimumValue={0.5} maximumValue={2.0} step={0.1} value={speed} onValueChange={setSpeed}
                  minimumTrackTintColor={COLORS.primary} maximumTrackTintColor={COLORS.border} thumbTintColor={COLORS.primary} />
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>音调: {pitch.toFixed(1)}</Text>
                <Slider minimumValue={0.5} maximumValue={2.0} step={0.1} value={pitch} onValueChange={setPitch}
                  minimumTrackTintColor={COLORS.primary} maximumTrackTintColor={COLORS.border} thumbTintColor={COLORS.primary} />
              </View>
            </>
          )}
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
  subTitle: { fontSize: SIZES.fontSizeSmall, fontWeight: '600', color: COLORS.textSecondary, paddingHorizontal: SIZES.padding, marginTop: 16, marginBottom: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingInfo: { flex: 1 },
  settingText: { fontSize: SIZES.fontSize, color: COLORS.text, marginBottom: 2 },
  settingDesc: { fontSize: 12, color: COLORS.textSecondary },
  modelList: { paddingHorizontal: SIZES.padding },
  modelItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8 },
  selectedModel: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  modelInfo: { flex: 1 },
  modelName: { fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  modelDesc: { fontSize: 12, color: COLORS.textSecondary },
  checkIcon: { fontSize: 18, color: COLORS.primary, fontWeight: 'bold' },
  voiceGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SIZES.padding },
  voiceItem: { width: '48%', alignItems: 'center', padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8, marginRight: '4%' },
  voiceItem: { width: '48%', alignItems: 'center', padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8 },
  selectedVoice: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  voiceIcon: { fontSize: 24, marginBottom: 8 },
  voiceName: { fontSize: SIZES.fontSizeSmall, color: COLORS.text },
  selectedVoiceText: { color: COLORS.primary, fontWeight: '600' },
  sliderContainer: { paddingHorizontal: SIZES.padding, marginTop: 12 },
  sliderLabel: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary, marginBottom: 4 },
});
