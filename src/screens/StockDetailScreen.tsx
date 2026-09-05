// 股票详情页 - 行情卡片 + K线图 + 大盘概览
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { getStockQuote, getStockKline, getMarketOverview } from '../services/api';
import type { StockData, KlineData } from '../types';

export default function StockDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [stockCode, setStockCode] = useState(route.params?.code || 'sh000001');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [klinePeriod, setKlinePeriod] = useState('day');

  useEffect(() => {
    loadStockData();
  }, [stockCode, klinePeriod]);

  const loadStockData = async () => {
    setLoading(true);
    try {
      const [quoteRes, klineRes, marketRes] = await Promise.all([
        getStockQuote(stockCode),
        getStockKline(stockCode, klinePeriod),
        getMarketOverview(),
      ]);

      if (quoteRes.success && quoteRes.data) setStockData(quoteRes.data);
      if (klineRes.success && klineRes.data) setKlineData(klineRes.data);
      if (marketRes.success && marketRes.data) setMarketData(marketRes.data);
    } catch (error) {
      console.error('加载股票数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  const isUp = (stockData?.changePercent || 0) >= 0;
  const priceColor = isUp ? theme.colors.stockUp : theme.colors.stockDown;

  const renderKlineChart = () => {
    if (klineData.length === 0) {
      return (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>暂无K线数据</Text>
        </View>
      );
    }

    // 简化版K线图 - 用柱状图表示
    const maxVolume = Math.max(...klineData.map((d) => d.volume));
    const minPrice = Math.min(...klineData.map((d) => d.low));
    const maxPrice = Math.max(...klineData.map((d) => d.high));
    const priceRange = maxPrice - minPrice || 1;

    return (
      <View style={styles.chartContainer}>
        {/* 价格区域 */}
        <View style={styles.priceChart}>
          {klineData.slice(-30).map((item, index) => {
            const candleHeight = ((item.high - item.low) / priceRange) * 100;
            const bodyTop = ((item.high - Math.max(item.open, item.close)) / priceRange) * 100;
            const bodyHeight = (Math.abs(item.close - item.open) / priceRange) * 100;
            const isCandleUp = item.close >= item.open;
            return (
              <View key={index} style={styles.candleColumn}>
                <View
                  style={[
                    styles.candleWick,
                    {
                      height: `${candleHeight}%`,
                      top: `${bodyTop}%`,
                      backgroundColor: isCandleUp ? theme.colors.stockUp : theme.colors.stockDown,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.candleBody,
                    {
                      height: `${Math.max(bodyHeight, 2)}%`,
                      top: `${bodyTop}%`,
                      backgroundColor: isCandleUp ? theme.colors.stockUp : theme.colors.stockDown,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
        {/* 成交量区域 */}
        <View style={styles.volumeChart}>
          {klineData.slice(-30).map((item, index) => {
            const volumeHeight = (item.volume / maxVolume) * 100;
            const isVolUp = item.close >= item.open;
            return (
              <View key={index} style={styles.volumeColumn}>
                <View
                  style={[
                    styles.volumeBar,
                    {
                      height: `${volumeHeight}%`,
                      backgroundColor: isVolUp ? theme.colors.stockUp : theme.colors.stockDown,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{stockData?.name || stockCode}</Text>
        <TouchableOpacity onPress={loadStockData} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 行情卡片 */}
          <View style={styles.quoteCard}>
            <View style={styles.priceRow}>
              <Text style={[styles.currentPrice, { color: priceColor }]}>
                {stockData?.price?.toFixed(2) || '--'}
              </Text>
              <View style={styles.changeInfo}>
                <Text style={[styles.changeText, { color: priceColor }]}>
                  {isUp ? '+' : ''}{stockData?.change?.toFixed(2) || '--'}
                </Text>
                <Text style={[styles.changeText, { color: priceColor }]}>
                  {isUp ? '+' : ''}{stockData?.changePercent?.toFixed(2) || '--'}%
                </Text>
              </View>
            </View>

            {/* 详细数据网格 */}
            <View style={styles.dataGrid}>
              <DataItem label="今开" value={stockData?.open?.toFixed(2)} />
              <DataItem label="最高" value={stockData?.high?.toFixed(2)} color={theme.colors.stockUp} />
              <DataItem label="最低" value={stockData?.low?.toFixed(2)} color={theme.colors.stockDown} />
              <DataItem label="成交量" value={formatVolume(stockData?.volume)} />
              <DataItem label="成交额" value={formatAmount(stockData?.amount)} />
              <DataItem label="换手率" value={stockData?.turnover ? `${stockData.turnover.toFixed(2)}%` : '--'} />
              <DataItem label="市盈率" value={stockData?.pe?.toFixed(2)} />
              <DataItem label="市净率" value={stockData?.pb?.toFixed(2)} />
            </View>
          </View>

          {/* K线图 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>K线图</Text>
              <View style={styles.periodTabs}>
                {['day', 'week', 'month'].map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[styles.periodTab, klinePeriod === period && styles.periodTabActive]}
                    onPress={() => setKlinePeriod(period)}
                  >
                    <Text style={[styles.periodText, klinePeriod === period && styles.periodTextActive]}>
                      {period === 'day' ? '日K' : period === 'week' ? '周K' : '月K'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {renderKlineChart()}
          </View>

          {/* 大盘概览 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>大盘概览</Text>
            <View style={styles.marketGrid}>
              {marketData.slice(0, 6).map((item, index) => (
                <View key={index} style={styles.marketItem}>
                  <Text style={styles.marketName} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.marketPrice, { color: (item.changePercent || 0) >= 0 ? theme.colors.stockUp : theme.colors.stockDown }]}>
                    {item.price?.toFixed(2)}
                  </Text>
                  <Text style={[styles.marketChange, { color: (item.changePercent || 0) >= 0 ? theme.colors.stockUp : theme.colors.stockDown }]}>
                    {(item.changePercent || 0) >= 0 ? '+' : ''}{item.changePercent?.toFixed(2)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function DataItem({ label, value, color }: { label: string; value?: string; color?: string }) {
  return (
    <View style={styles.dataItem}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={[styles.dataValue, color ? { color } : null]}>{value || '--'}</Text>
    </View>
  );
}

function formatVolume(vol?: number) {
  if (!vol) return '--';
  if (vol >= 100000000) return `${(vol / 100000000).toFixed(2)}亿`;
  if (vol >= 10000) return `${(vol / 10000).toFixed(2)}万`;
  return vol.toString();
}

function formatAmount(amount?: number) {
  if (!amount) return '--';
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(2)}亿`;
  if (amount >= 10000) return `${(amount / 10000).toFixed(2)}万`;
  return amount.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
  },
  refreshButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  quoteCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: '700',
  },
  changeInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  changeText: {
    fontSize: 15,
    fontWeight: '500',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingTop: 16,
  },
  dataItem: {
    width: '25%',
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text,
  },
  sectionCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  periodTabs: {
    flexDirection: 'row',
    gap: 4,
  },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.colors.backgroundGray,
  },
  periodTabActive: {
    backgroundColor: theme.colors.primary,
  },
  periodText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  periodTextActive: {
    color: theme.colors.textWhite,
  },
  chartContainer: {
    height: 240,
    gap: 8,
  },
  priceChart: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingBottom: 8,
  },
  candleColumn: {
    flex: 1,
    position: 'relative',
    height: '100%',
  },
  candleWick: {
    position: 'absolute',
    width: 2,
    left: '50%',
    marginLeft: -1,
  },
  candleBody: {
    position: 'absolute',
    width: 6,
    left: '50%',
    marginLeft: -3,
  },
  volumeChart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  volumeColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  volumeBar: {
    width: '60%',
    marginLeft: '20%',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  marketItem: {
    width: '31%',
    backgroundColor: theme.colors.backgroundGray,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  marketName: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  marketPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  marketChange: {
    fontSize: 11,
    fontWeight: '500',
  },
});
