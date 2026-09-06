import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import api from '../services/api';

const STOCK_DATA = {
  name: '贵州茅台',
  code: '600519.SH',
  price: 1688.00,
  change: 28.50,
  changePercent: 1.72,
  open: 1665.00,
  high: 1695.00,
  low: 1660.00,
  prevClose: 1659.50,
  volume: '2.35万手',
  amount: '39.68亿',
  turnover: '0.19%',
  pe: 28.5,
  pb: 9.8,
  marketCap: '2.12万亿',
};

export default function StockDetailScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState(STOCK_DATA);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    try {
      const data = await api.getStockQuote(searchText);
      if (data) {
        setStockData({
          name: data.name || searchText,
          code: data.code || '',
          price: data.price || 0,
          change: data.change || 0,
          changePercent: data.changePercent || data.change_percent || 0,
          open: data.open || 0,
          high: data.high || 0,
          low: data.low || 0,
          prevClose: data.prevClose || data.prev_close || 0,
          volume: data.volume || '-',
          amount: data.amount || '-',
          turnover: data.turnover || '-',
          pe: data.pe || '-',
          pb: data.pb || '-',
          marketCap: data.marketCap || data.market_cap || '-',
        });
      }
    } catch (error) {
      console.log('查询股票失败', error);
    } finally {
      setLoading(false);
    }
  };

  const isUp = stockData.change >= 0;
  const priceColor = isUp ? '#EF4444' : '#22C55E';

  const renderDataItem = (label, value) => (
    <View style={styles.dataItem}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>股票详情</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="输入股票代码或名称"
          placeholderTextColor={COLORS.textMuted}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>查询</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>查询中...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.stockHeader}>
            <View>
              <Text style={styles.stockName}>{stockData.name}</Text>
              <Text style={styles.stockCode}>{stockData.code}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={[styles.currentPrice, { color: priceColor }]}>
                {stockData.price.toFixed(2)}
              </Text>
              <Text style={[styles.changeText, { color: priceColor }]}>
                {isUp ? '+' : ''}{stockData.change.toFixed(2)} ({isUp ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartIcon}>📈</Text>
            <Text style={styles.chartText}>K线图（开发中）</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>行情数据</Text>
            <View style={styles.dataGrid}>
              {renderDataItem('今开', stockData.open.toFixed(2))}
              {renderDataItem('最高', stockData.high.toFixed(2))}
              {renderDataItem('最低', stockData.low.toFixed(2))}
              {renderDataItem('昨收', stockData.prevClose.toFixed(2))}
              {renderDataItem('成交量', stockData.volume)}
              {renderDataItem('成交额', stockData.amount)}
              {renderDataItem('换手率', stockData.turnover)}
              {renderDataItem('市盈率', stockData.pe)}
              {renderDataItem('市净率', stockData.pb)}
              {renderDataItem('总市值', stockData.marketCap)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>快捷操作</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonIcon}>📊</Text>
                <Text style={styles.actionButtonText}>技术分析</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonIcon}>📰</Text>
                <Text style={styles.actionButtonText}>相关资讯</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonIcon}>⭐</Text>
                <Text style={styles.actionButtonText}>加入自选</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonIcon}>🔔</Text>
                <Text style={styles.actionButtonText}>设置提醒</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: SIZES.fontSizeLarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: SIZES.fontSize,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    marginLeft: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: COLORS.background,
    fontSize: SIZES.fontSize,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    marginBottom: 12,
  },
  stockName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  stockCode: {
    fontSize: SIZES.fontSizeSmall,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  changeText: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: COLORS.background,
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  chartText: {
    fontSize: SIZES.fontSize,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.background,
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dataItem: {
    width: '50%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dataLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: SIZES.fontSize,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  actionButton: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionButtonIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
