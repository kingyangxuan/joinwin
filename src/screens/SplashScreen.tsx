// 启动页
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/lion.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Joinwin</Text>
        <Text style={styles.tagline}>智能对话 · 股票分析</Text>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.loadingText}>正在加载...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  bottom: {
    position: 'absolute',
    bottom: 60,
  },
  loadingText: {
    fontSize: 13,
    color: theme.colors.textTertiary,
  },
});
