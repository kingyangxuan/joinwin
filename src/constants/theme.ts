// Joinwin App 主题配置 - 浅色风格
export const theme = {
  colors: {
    // 主色
    primary: '#F97316', // 橙色（狮子眼睛色）
    primaryDark: '#EA580C',
    primaryLight: '#FFF7ED',
    
    // 背景
    background: '#FFFFFF',
    backgroundGray: '#F7F7F8',
    backgroundChat: '#FAFAFA',
    
    // 文字
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textWhite: '#FFFFFF',
    
    // 边框
    border: '#E5E5E5',
    borderLight: '#F0F0F0',
    
    // 消息气泡
    userBubble: '#F97316', // 用户消息橙色
    aiBubble: '#F2F2F2', // AI消息浅灰
    
    // 状态
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // 股票
    stockUp: '#EF4444', // A股红涨
    stockDown: '#22C55E', // A股绿跌
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    title: 28,
  },
  
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    xxl: 24,
    pill: 999,
  },
  
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  },
};

export type Theme = typeof theme;
