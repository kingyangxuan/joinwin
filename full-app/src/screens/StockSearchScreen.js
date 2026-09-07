import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const HOT_STOCKS = [
  { code: '600519', name: '贵州茅台', price: 1688.00, change: 1.72 },
  { code: '000858', name: '五粮液', price: 156.80, change: 2.35 },
  { code: '300750', name: '宁德时代', price: 198.50, change: -0.85 },
  { code: '601318', name: '中国平安', price: 48.60, change: 1.12 },
  { code: '000001', name: '平安银行', price: 11.25, change: 0.45 },
  { code: '600036', name: '招商银行', price: 35.80, change: -0.28 },
];

const MY_STOCKS = [
  { code: '600519', name: '贵州茅台', price: 1688.00, change: 1.72 },
  { code: '000858', name: '五粮液', price: 156.80, change: 2.35 },
];

export default function StockSearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('hot');

  const renderStockItem = ({ item }) => {
    const isUp = item.change >= 0;
    return (
      <TouchableOpacity style={styles.stockItem} onPress={() => navigation.navigate('StockDetail', { code: item.code, name: item.name })}>
        <View style={styles.stockInfo}>
          <Text style={styles.stockName}>{item.name}</Text>
          <Text style={styles.stockCode}>{item.code}</Text>
        </View>
        <View style={styles.stockPrice}>
          <Text style={[styles.priceText, { color: isUp ? '#EF4444' : '#22C55E' }]}>{item.price.toFixed(2)}</Text>
          <Text style={[styles.changeText, { color: isUp ? '#EF4444' : '#22C55E' }]}>{isUp ? '+' : ''}{item.change.toFixed(2)}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>股票搜索</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="输入股票代码或名称" placeholderTextColor={COLORS.textMuted}
          value={searchText} onChangeText={setSearchText} returnKeyType="search"
          onSubmitEditing={() => navigation.navigate('StockDetail', { code: searchText })} />
        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('StockDetail', { code: searchText })}>
          <Text style={styles.searchButtonText}>搜索</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'hot' && styles.activeTab]} onPress={() => setActiveTab('hot')}>
          <Text style={[styles.tabText, activeTab === 'hot' && styles.activeTabText]}>热门股票</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'my' && styles.activeTab]} onPress={() => setActiveTab('my')}>
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>我的自选</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={activeTab === 'hot' ? HOT_STOCKS : MY_STOCKS} renderItem={renderStockItem}
        keyExtractor={(item) => item.code} contentContainerStyle={styles.listContent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingTop: 50, paddingBottom: 16, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: COLORS.text },
  headerTitle: { fontSize: SIZES.fontSizeLarge, fontWeight: 'bold', color: COLORS.text },
  searchContainer: { flexDirection: 'row', padding: SIZES.padding, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchInput: { flex: 1, backgroundColor: COLORS.surface, borderRadius: SIZES.radius, paddingHorizontal: 16, paddingVertical: 12, fontSize: SIZES.fontSize, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  searchButton: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: SIZES.radius, marginLeft: 12, justifyContent: 'center' },
  searchButtonText: { color: COLORS.background, fontSize: SIZES.fontSize, fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.background, paddingHorizontal: SIZES.padding, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: SIZES.fontSize, color: COLORS.textSecondary },
  activeTabText: { color: COLORS.primary, fontWeight: '600' },
  listContent: { paddingBottom: 20 },
  stockItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, backgroundColor: COLORS.background, marginBottom: 1, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stockInfo: { flex: 1 },
  stockName: { fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  stockCode: { fontSize: 12, color: COLORS.textSecondary },
  stockPrice: { alignItems: 'flex-end' },
  priceText: { fontSize: SIZES.fontSize, fontWeight: 'bold', marginBottom: 4 },
  changeText: { fontSize: SIZES.fontSizeSmall, fontWeight: '600' },
});
