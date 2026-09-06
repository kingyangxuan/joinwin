import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://j.windyme.com';

class ApiService {
  constructor() {
    this.token = null;
    this.init();
  }

  async init() {
    try {
      const token = await AsyncStorage.getItem('joinwin_token');
      if (token) this.token = token;
    } catch (e) {
      console.log('读取 token 失败', e);
    }
  }

  async setToken(token) {
    this.token = token;
    try {
      await AsyncStorage.setItem('joinwin_token', token);
    } catch (e) {
      console.log('保存 token 失败', e);
    }
  }

  async clearToken() {
    this.token = null;
    try {
      await AsyncStorage.removeItem('joinwin_token');
    } catch (e) {
      console.log('清除 token 失败', e);
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.token) {
      headers['Cookie'] = this.token;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API 请求失败 ${endpoint}:`, error);
      throw error;
    }
  }

  async login(username, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.username) {
      // 登录成功，token 从响应头获取（简化处理，实际应从 cookie 提取）
      await this.setToken(`session=login_${Date.now()}`);
    }
    return data;
  }

  async logout() {
    await this.request('/api/auth/logout', { method: 'POST' });
    await this.clearToken();
  }

  async getModels() {
    return this.request('/api/models');
  }

  async sendMessage(messages, model = 'qwen3.6 35B') {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ model, messages, stream: false }),
    });
  }

  async getConversations() {
    return this.request('/api/conversations');
  }

  async createConversation(title) {
    return this.request('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async deleteConversation(id) {
    return this.request(`/api/conversations/${id}`, { method: 'DELETE' });
  }

  async getMessages(conversationId) {
    return this.request(`/api/conversations/${conversationId}/messages`);
  }

  async getAdminStats() {
    return this.request('/api/admin/stats');
  }

  async getAdminUsers() {
    return this.request('/api/admin/users');
  }

  async deleteAdminUser(username) {
    return this.request(`/api/admin/users/${username}`, { method: 'DELETE' });
  }

  async getStockQuote(symbol) {
    return this.request(`/api/stock/quote?symbol=${encodeURIComponent(symbol)}`);
  }
}

export const api = new ApiService();
export default api;
