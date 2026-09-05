// Joinwin API 服务封装
import { Platform } from 'react-native';

// API 基础地址 - 直接调香港服务器
const API_BASE = 'https://j.windyme.com';

// 存储 cookie（React Native 没有浏览器 cookie，手动管理）
let authCookie: string | null = null;

export const setAuthCookie = (cookie: string) => {
  authCookie = cookie;
};

export const getAuthCookie = () => authCookie;

export const clearAuthCookie = () => {
  authCookie = null;
};

// 通用请求
async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  // 带上认证 cookie
  if (authCookie) {
    headers['Cookie'] = authCookie;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  // 从响应头提取 set-cookie（登录时用）
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    // 提取 session=xxx 部分
    const match = setCookie.match(/session=[^;]+/);
    if (match) {
      authCookie = match[0];
    }
  }
  
  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { success: response.ok, message: text };
  }
  
  if (!response.ok && !data.success) {
    throw new Error(data.error || data.message || `请求失败: ${response.status}`);
  }
  
  return data as T;
}

// ============ 认证相关 ============

// 登录
export async function login(username: string, password: string) {
  const res = await request<any>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return res;
}

// 登出
export async function logout() {
  const res = await request<any>('/api/logout', { method: 'POST' });
  clearAuthCookie();
  return res;
}

// 获取当前用户
export async function getCurrentUser() {
  return request<any>('/api/me');
}

// ============ 对话相关 ============

// 获取对话列表
export async function getConversations() {
  return request<any>('/api/conversations');
}

// 创建对话
export async function createConversation(title?: string) {
  return request<any>('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ title: title || '新对话' }),
  });
}

// 删除对话
export async function deleteConversation(id: string) {
  return request<any>(`/api/conversations/${id}`, { method: 'DELETE' });
}

// 获取对话消息
export async function getMessages(conversationId: string) {
  return request<any>(`/api/conversations/${conversationId}/messages`);
}

// 发送消息（SSE 流式）
export async function sendMessageStream(
  conversationId: string,
  content: string,
  options?: {
    images?: string[];
    files?: any[];
    onChunk: (chunk: string) => void;
    onDone: () => void;
    onError: (error: Error) => void;
  }
) {
  const url = `${API_BASE}/api/chat/stream`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  };
  if (authCookie) {
    headers['Cookie'] = authCookie;
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        conversation_id: conversationId,
        content,
        images: options?.images || [],
        files: options?.files || [],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }
    
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            options?.onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              options?.onChunk(parsed.content);
            }
          } catch {
            // 非 JSON 数据，直接作为内容
            if (data) {
              options?.onChunk(data);
            }
          }
        }
      }
    }
    
    options?.onDone();
  } catch (error: any) {
    options?.onError(error);
  }
}

// 发送消息（非流式，备用）
export async function sendMessage(conversationId: string, content: string) {
  return request<any>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ conversation_id: conversationId, content }),
  });
}

// ============ 股票相关 ============

// 查询股票行情
export async function getStockQuote(code: string) {
  return request<any>(`/api/stock/quote?code=${encodeURIComponent(code)}`);
}

// 查询K线
export async function getStockKline(code: string, period: string = 'day') {
  return request<any>(`/api/stock/kline?code=${encodeURIComponent(code)}&period=${period}`);
}

// 大盘概览
export async function getMarketOverview() {
  return request<any>('/api/stock/market-overview');
}

// ============ 管理员相关 ============

// 获取统计
export async function getAdminStats() {
  return request<any>('/api/admin/stats');
}

// 获取用户列表
export async function getAdminUsers() {
  return request<any>('/api/admin/users');
}

// 删除用户
export async function deleteAdminUser(username: string) {
  return request<any>(`/api/admin/users/${username}`, { method: 'DELETE' });
}

// 获取所有对话
export async function getAdminConversations() {
  return request<any>('/api/admin/conversations');
}

// 删除对话（管理员）
export async function deleteAdminConversation(id: string) {
  return request<any>(`/api/admin/conversations/${id}`, { method: 'DELETE' });
}

// 获取对话消息（管理员）
export async function getAdminConversationMessages(id: string) {
  return request<any>(`/api/admin/conversations/${id}/messages`);
}

// ============ 文件上传 ============

// 上传图片
export async function uploadImage(uri: string, fileName: string) {
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: fileName,
    type: 'image/png',
  } as any);
  
  const url = `${API_BASE}/api/upload/image`;
  const headers: Record<string, string> = {};
  if (authCookie) {
    headers['Cookie'] = authCookie;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  return response.json();
}

// 上传文件
export async function uploadFile(uri: string, fileName: string, fileType: string) {
  const formData = new FormData();
  formData.append('file', {
    uri,
    name: fileName,
    type: fileType,
  } as any);
  
  const url = `${API_BASE}/api/upload/file`;
  const headers: Record<string, string> = {};
  if (authCookie) {
    headers['Cookie'] = authCookie;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  return response.json();
}

export default {
  login,
  logout,
  getCurrentUser,
  getConversations,
  createConversation,
  deleteConversation,
  getMessages,
  sendMessageStream,
  sendMessage,
  getStockQuote,
  getStockKline,
  getMarketOverview,
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminConversations,
  deleteAdminConversation,
  getAdminConversationMessages,
  uploadImage,
  uploadFile,
  setAuthCookie,
  getAuthCookie,
  clearAuthCookie,
};
