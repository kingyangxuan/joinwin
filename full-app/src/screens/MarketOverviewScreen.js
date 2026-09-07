import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const INDICES = [
  { name: '上证指数', code: '000001.SH', value: 3125.68, change: 15.32, changePercent: 0.49 },
  { name: '深证成指', code: '399001.SZ', value: 9856.32, change: -28.45, changePercent: -0.29 },
  { name: '创业板指', code: '399006.SZ', value: 1923.45, change: 12.67, changePercent: 0.66 },
  { name: '科创50', code: '000688.SH', value: 856.78, change: -5.23, changePercent: -0.61 },
  { name: '沪深300', code: '000300.SH', value: 3654.21, change: 8.90, changePercent: 0.24 },
  { name: '中证500', code: '000905.SH', value: 5432.10, change: 23.45, changePercent: 0.43 },
  { name: '恒生指数', code: 'HSI', value: 17856.32, change: 156.78, changePercent: 0.88 },
  { name: '恒生科技', code: 'HSTECH', value: 3856.45, change: 45.32, changePercent: 1.19 },
  { name: '道琼斯', code: 'DJI', value: 38654.32, change: -123.45, changePercent: -0.32 },
  { name: '纳斯达克', code: 'IXIC', value: 15678.90, change: 56.78, changePercent: 0.36 },
  { name: '标普500', code: 'SPX', value: 5123.45, change: 12.34, changePercent: 0.24 },
  { name: '日经225', code: 'N225', value: 38567.23, change: -234.56, changePercent: -0.60 },
];

export default function MarketOverviewScreen({ navigation }) {
  const renderIndexCard = (item, index) => {
    const isUp = item.change >= 0;
    const color = isUp ? '#EF4444' : '#22C55E';
    return (
      <View key={index} style={styles.indexCard}>
        <Text style={styles.indexName}>{item.name}</Text>
        <Text style={styles.indexCode}>{item.code}</Text>
        <Text style={[styles.indexValue, { color }]}>{item.value.toFixed(2)}</Text>
        <Text style={[styles.indexChange, { color }]}>
          {isUp ? '+' : ''}{item.change.toFixed(2)} ({isUp ? '+' : ''}{item.changePercent.toFixed(2)}%)
        </Text>
      </View>
    );
  };

  const upCount = INDICES.filter(i => i.change >= 0).length;
  const downCount = INDICES.filter(i => i.change < 0).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>大盘概览</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>上涨</Text>
          <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{upCount}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>下跌</Text>
          <Text style={[styles.summaryValue, { color: '#22C55E' }]}>{downCount}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>总数</Text>
          <Text style={styles.summaryValue}>{INDICES.length}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {INDICES.map((item, index) => renderIndexCard(item, index))}
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
  summaryBar: { flexDirection: 'row', backgroundColor: COLORS.background, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  summaryDivider: { width: 1, backgroundColor: COLORS.border },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, paddingBottom: 20 },
  indexCard: { width: '50%', padding: 8 },
  indexCardInner: { backgroundColor: COLORS.background, borderRadius: SIZES.radius, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  indexName: { fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  indexCode: { fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },
  indexValue: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  indexChange: { fontSize: SIZES.fontSizeSmall, fontWeight: '600' },
});
