import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function ImagePreviewScreen({ route, navigation }) {
  const { imageUrl, imageName = '图片' } = route.params || {};

  const handleSave = () => {
    Alert.alert('提示', '保存图片功能开发中...');
  };

  const handleShare = () => {
    Alert.alert('提示', '分享图片功能开发中...');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{imageName}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Text style={styles.actionButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.imageContainer} contentContainerStyle={styles.imageContent} maximumZoomScale={3} minimumZoomScale={1}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🖼️</Text>
            <Text style={styles.placeholderText}>图片预览</Text>
            <Text style={styles.placeholderDesc}>点击对话中的图片可全屏查看</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleSave}>
          <Text style={styles.bottomButtonIcon}>💾</Text>
          <Text style={styles.bottomButtonText}>保存</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={handleShare}>
          <Text style={styles.bottomButtonIcon}>📤</Text>
          <Text style={styles.bottomButtonText}>分享</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.goBack()}>
          <Text style={styles.bottomButtonIcon}>✖️</Text>
          <Text style={styles.bottomButtonText}>关闭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingTop: 50, paddingBottom: 16, backgroundColor: 'rgba(0,0,0,0.8)' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: '#FFF' },
  headerTitle: { flex: 1, fontSize: SIZES.fontSize, fontWeight: '600', color: '#FFF', textAlign: 'center' },
  actionButton: { paddingHorizontal: 12, paddingVertical: 6 },
  actionButtonText: { fontSize: SIZES.fontSize, color: COLORS.primary, fontWeight: '600' },
  imageContainer: { flex: 1 },
  imageContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderIcon: { fontSize: 64, marginBottom: 16 },
  placeholderText: { fontSize: SIZES.fontSizeLarge, color: '#FFF', marginBottom: 8 },
  placeholderDesc: { fontSize: SIZES.fontSizeSmall, color: '#999' },
  bottomBar: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.8)', paddingVertical: 16, paddingHorizontal: SIZES.padding },
  bottomButton: { flex: 1, alignItems: 'center' },
  bottomButtonIcon: { fontSize: 24, marginBottom: 4 },
  bottomButtonText: { fontSize: 12, color: '#FFF' },
});
