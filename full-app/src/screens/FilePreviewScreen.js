import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const FILE_ICONS = {
  pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗',
  txt: '📄', csv: '📊', md: '📝', zip: '📦', default: '📁',
};

export default function FilePreviewScreen({ route, navigation }) {
  const { fileName = '文件', fileSize = '', fileContent = '' } = route.params || {};
  const ext = fileName.split('.').pop()?.toLowerCase() || 'default';
  const icon = FILE_ICONS[ext] || FILE_ICONS.default;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{fileName}</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileIcon}>{icon}</Text>
        <Text style={styles.fileName}>{fileName}</Text>
        {fileSize ? <Text style={styles.fileSize}>{fileSize}</Text> : null}
      </View>
      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.content}>
        {fileContent ? (
          <Text style={styles.contentText}>{fileContent}</Text>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📄</Text>
            <Text style={styles.placeholderText}>文件预览</Text>
            <Text style={styles.placeholderDesc}>支持 PDF、Word、Excel、TXT、CSV 等格式</Text>
            <Text style={styles.placeholderDesc}>文件内容将作为上下文发送给 AI 分析</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonIcon}>📤</Text>
          <Text style={styles.bottomButtonText}>分享</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonIcon}>💾</Text>
          <Text style={styles.bottomButtonText}>保存</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>用 AI 分析</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingTop: 50, paddingBottom: 16, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: COLORS.text },
  headerTitle: { flex: 1, fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  fileInfo: { alignItems: 'center', padding: 24, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  fileIcon: { fontSize: 48, marginBottom: 12 },
  fileName: { fontSize: SIZES.fontSizeLarge, fontWeight: 'bold', color: COLORS.text, marginBottom: 4, textAlign: 'center' },
  fileSize: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary },
  contentContainer: { flex: 1 },
  content: { padding: SIZES.padding },
  contentText: { fontSize: SIZES.fontSize, color: COLORS.text, lineHeight: 24 },
  placeholder: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  placeholderIcon: { fontSize: 64, marginBottom: 16 },
  placeholderText: { fontSize: SIZES.fontSizeLarge, color: COLORS.text, marginBottom: 8 },
  placeholderDesc: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary, marginBottom: 4, textAlign: 'center' },
  bottomBar: { flexDirection: 'row', backgroundColor: COLORS.background, paddingVertical: 12, paddingHorizontal: SIZES.padding, borderTopWidth: 1, borderTopColor: COLORS.border },
  bottomButton: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  bottomButtonIcon: { fontSize: 20, marginBottom: 4 },
  bottomButtonText: { fontSize: 12, color: COLORS.textSecondary },
  primaryButton: { flex: 1, backgroundColor: COLORS.primary, borderRadius: SIZES.radius, justifyContent: 'center', marginLeft: 12 },
  primaryButtonText: { color: COLORS.background, fontSize: SIZES.fontSize, fontWeight: '600' },
});
