# Joinwin App

Joinwin 智能对话 App，React Native 开发，一套代码同时支持安卓和 iOS。

## 功能

- ✅ 用户登录/注册
- ✅ AI 对话（SSE 流式输出）
- ✅ 欢迎页快捷功能
- ✅ 对话历史记录
- ✅ 图片上传识别（开发中）
- ✅ 文件上传解析（开发中）
- ✅ 语音输入/输出（开发中）
- ✅ 股票分析（开发中）
- ✅ 管理员后台（开发中）

## 技术栈

- React Native + Expo
- TypeScript
- React Navigation（导航）
- Zustand（状态管理 + 持久化）
- 后端 API：https://j.windyme.com

## 项目结构

```
joinwin-app/
├── App.tsx                    # 入口
├── app.json                   # 应用配置
├── eas.json                   # EAS 构建配置
├── android/                   # 安卓原生工程（prebuild 生成）
└── src/
    ├── assets/                # 静态资源（狮子logo）
    ├── constants/theme.ts     # 主题配置
    ├── types/index.ts         # 类型定义
    ├── services/api.ts        # API 封装
    ├── store/useStore.ts      # 全局状态
    └── screens/
        ├── SplashScreen.tsx   # 启动页
        ├── LoginScreen.tsx    # 登录页
        ├── WelcomeScreen.tsx  # 欢迎页
        └── ChatScreen.tsx     # 对话页
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npx expo start

# 安卓预览（需连接手机或模拟器）
npx expo run:android

# 构建 APK
cd android && ./gradlew assembleRelease
# 产物路径：android/app/build/outputs/apk/release/app-release.apk
```

## 环境要求

- Node.js 18+
- JDK 17
- Android SDK（platform 34, build-tools 34.0.0）

## 后端 API

所有请求指向 `https://j.windyme.com`，带 cookie 认证。

主要接口：
- `POST /api/login` - 登录
- `POST /api/logout` - 登出
- `GET /api/conversations` - 对话列表
- `POST /api/conversations` - 创建对话
- `DELETE /api/conversations/:id` - 删除对话
- `GET /api/conversations/:id/messages` - 消息列表
- `POST /api/chat/stream` - 流式对话（SSE）

## 测试账号

- 用户名：testuser_p0
- 密码：test123456
