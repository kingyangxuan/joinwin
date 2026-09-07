import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function EditProfileScreen({ navigation }) {
  const [nickname, setNickname] = useState('king');
  const [bio, setBio] = useState('Joinwin 用户');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    Alert.alert('提示', '个人资料已保存');
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('提示', '请填写完整密码信息');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('提示', '两次输入的新密码不一致');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('提示', '新密码长度不能少于6位');
      return;
    }
    Alert.alert('提示', '密码修改成功');
    setOldPassword(''); setNewPassword(''); setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑资料</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <TouchableOpacity style={styles.changeAvatarButton}>
            <Text style={styles.changeAvatarText}>更换头像</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>昵称</Text>
            <TextInput style={styles.input} value={nickname} onChangeText={setNickname} placeholder="请输入昵称" placeholderTextColor={COLORS.textMuted} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>个性签名</Text>
            <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} placeholder="介绍一下自己" placeholderTextColor={COLORS.textMuted} multiline numberOfLines={3} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>修改密码</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>当前密码</Text>
            <TextInput style={styles.input} value={oldPassword} onChangeText={setOldPassword} placeholder="请输入当前密码" placeholderTextColor={COLORS.textMuted} secureTextEntry />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>新密码</Text>
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="请输入新密码（至少6位）" placeholderTextColor={COLORS.textMuted} secureTextEntry />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>确认新密码</Text>
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="请再次输入新密码" placeholderTextColor={COLORS.textMuted} secureTextEntry />
          </View>
          <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
            <Text style={styles.changePasswordText}>确认修改密码</Text>
          </TouchableOpacity>
        </View>
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
  saveButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.primary, borderRadius: SIZES.radius },
  saveButtonText: { color: COLORS.background, fontSize: SIZES.fontSize, fontWeight: '600' },
  content: { paddingBottom: 20 },
  avatarSection: { alignItems: 'center', padding: 24, backgroundColor: COLORS.background, marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 40 },
  changeAvatarButton: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primary, borderRadius: SIZES.radius },
  changeAvatarText: { color: COLORS.primary, fontSize: SIZES.fontSizeSmall, fontWeight: '600' },
  section: { backgroundColor: COLORS.background, marginBottom: 12, paddingBottom: 16 },
  sectionTitle: { fontSize: SIZES.fontSize, fontWeight: '600', color: COLORS.text, padding: SIZES.padding, paddingBottom: 8 },
  inputGroup: { paddingHorizontal: SIZES.padding, marginBottom: 16 },
  label: { fontSize: SIZES.fontSizeSmall, color: COLORS.textSecondary, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 12, fontSize: SIZES.fontSize, color: COLORS.text, backgroundColor: COLORS.surface },
  textArea: { height: 80, textAlignVertical: 'top' },
  changePasswordButton: { marginHorizontal: SIZES.padding, backgroundColor: COLORS.primary, borderRadius: SIZES.radius, padding: 14, alignItems: 'center', marginTop: 8 },
  changePasswordText: { color: COLORS.background, fontSize: SIZES.fontSize, fontWeight: '600' },
});
