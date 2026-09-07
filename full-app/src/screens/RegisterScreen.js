import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }
    if (password.length < 6) {
      Alert.alert('提示', '密码长度不能少于6位');
      return;
    }
    setLoading(true);
    try {
      const result = await api.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (result.username || result.success) {
        Alert.alert('注册成功', '请使用新账号登录', [
          { text: '确定', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('注册失败', result.error || '注册失败，请稍后重试');
      }
    } catch (error) {
      Alert.alert('注册失败', error.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← 返回登录</Text>
        </TouchableOpacity>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🦁</Text>
          </View>
          <Text style={styles.appName}>注册 Joinwin</Text>
          <Text style={styles.welcomeText}>创建你的账号</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>用户名</Text>
            <TextInput style={styles.input} placeholder="请输入用户名" placeholderTextColor={COLORS.textMuted}
              value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>密码</Text>
            <TextInput style={styles.input} placeholder="请输入密码（至少6位）" placeholderTextColor={COLORS.textMuted}
              value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>确认密码</Text>
            <TextInput style={styles.input} placeholder="请再次输入密码" placeholderTextColor={COLORS.textMuted}
              value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" />
          </View>
          <TouchableOpacity style={[styles.registerButton, loading && styles.disabled]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.registerButtonText}>注 册</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SIZES.padding * 2, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: SIZES.padding * 2 },
  backButtonText: { fontSize: SIZES.fontSize, color: COLORS.primary, fontWeight: '600' },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  welcomeText: { fontSize: SIZES.fontSize, color: COLORS.textSecondary },
  form: { marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 14, fontSize: SIZES.fontSize, color: COLORS.text, backgroundColor: COLORS.surface },
  registerButton: { backgroundColor: COLORS.primary, borderRadius: SIZES.radius, padding: 16, alignItems: 'center', marginTop: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  disabled: { opacity: 0.7 },
  registerButtonText: { color: COLORS.background, fontSize: SIZES.fontSize, fontWeight: 'bold', letterSpacing: 2 },
});
