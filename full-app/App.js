import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { COLORS } from './src/constants/theme';

// 认证相关
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// 主界面
import WelcomeScreen from './src/screens/WelcomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import ConversationListScreen from './src/screens/ConversationListScreen';

// 股票相关
import StockSearchScreen from './src/screens/StockSearchScreen';
import StockDetailScreen from './src/screens/StockDetailScreen';
import MarketOverviewScreen from './src/screens/MarketOverviewScreen';

// 多媒体
import ImagePreviewScreen from './src/screens/ImagePreviewScreen';
import FilePreviewScreen from './src/screens/FilePreviewScreen';
import VoiceSettingsScreen from './src/screens/VoiceSettingsScreen';

// 技能
import SkillsScreen from './src/screens/SkillsScreen';

// 个人中心
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import HelpFeedbackScreen from './src/screens/HelpFeedbackScreen';
import AboutScreen from './src/screens/AboutScreen';

// 管理员
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        {/* 认证相关 */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* 主界面 */}
        <Stack.Screen name="Main" component={WelcomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ConversationList" component={ConversationListScreen} />

        {/* 股票相关 */}
        <Stack.Screen name="StockSearch" component={StockSearchScreen} />
        <Stack.Screen name="StockDetail" component={StockDetailScreen} />
        <Stack.Screen name="MarketOverview" component={MarketOverviewScreen} />

        {/* 多媒体 */}
        <Stack.Screen name="ImagePreview" component={ImagePreviewScreen} />
        <Stack.Screen name="FilePreview" component={FilePreviewScreen} />
        <Stack.Screen name="VoiceSettings" component={VoiceSettingsScreen} />

        {/* 技能 */}
        <Stack.Screen name="Skills" component={SkillsScreen} />

        {/* 个人中心 */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="HelpFeedback" component={HelpFeedbackScreen} />
        <Stack.Screen name="About" component={AboutScreen} />

        {/* 管理员 */}
        <Stack.Screen name="Admin" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
