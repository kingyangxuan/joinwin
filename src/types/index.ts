// Joinwin App 类型定义

// 用户
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
}

// 对话
export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

// 消息
export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  // 附加内容
  images?: string[]; // 图片URL
  files?: FileAttachment[]; // 文件附件
  stockData?: StockData; // 股票数据
  enrich?: any; // 富化数据
}

// 文件附件
export interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
}

// 股票数据
export interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
  turnover?: number;
  pe?: number;
  pb?: number;
  marketCap?: number;
  market: 'A股' | '港股' | '美股';
}

// K线数据
export interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// API 响应
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 管理员统计
export interface AdminStats {
  total_users: number;
  total_conversations: number;
  total_messages: number;
  today_active_users: number;
}

// 管理员用户
export interface AdminUser {
  id: number;
  username: string;
  role: string;
  created_at: string;
  conversation_count: number;
}
