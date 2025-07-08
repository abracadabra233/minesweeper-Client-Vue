# 🎮 扫雷游戏 - Vue 3 客户端

一个现代化的扫雷游戏前端应用，使用 Vue 3 + Vite + Pinia 构建，支持多人对战。

## ✨ 特性

- 🎯 **现代化技术栈**: Vue 3 + Vite + Pinia + TypeScript
- 🎮 **经典扫雷游戏**: 支持初级、中级、高级难度
- 👥 **多人对战**: 支持 1-10 人同时游戏
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🎨 **现代化 UI**: 美观的渐变背景和动画效果
- ⚡ **高性能**: 基于 Vite 的快速构建和热重载
- 🔧 **开发友好**: 完整的 TypeScript 支持和 ESLint 配置

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
# 检查代码质量
npm run lint:check

# 自动修复代码问题
npm run lint

# 类型检查
npm run type-check
```

### 代码格式化

```bash
npm run format
```

## 📁 项目结构

```
src/
├── components/          # Vue 组件
│   ├── common/         # 通用组件
│   ├── modals/         # 模态框组件
│   ├── GamePage.vue    # 游戏页面
│   ├── HomePage.vue    # 首页
│   └── WaitingRoom.vue # 等待室
├── stores/             # Pinia 状态管理
│   └── game.js         # 游戏状态
├── router/             # 路由配置
│   └── index.js
├── directives/         # 自定义指令
│   └── LongPressDirective.js
├── styles/             # 样式文件
│   └── cell1.css       # 扫雷单元格样式
├── assets/             # 静态资源
├── App.vue             # 根组件
└── main.js             # 应用入口
```

## 🎮 游戏功能

### 游戏模式

- **初级**: 8×8 棋盘，10 个地雷
- **中级**: 16×16 棋盘，40 个地雷
- **高级**: 30×16 棋盘，99 个地雷
- **自定义**: 可自定义棋盘大小和地雷数量

### 操作方式

- **左键点击**: 开启单元格
- **右键点击**: 标记/取消标记地雷
- **长按**: 标记地雷（移动端）

### 多人游戏

- 支持 1-10 人同时游戏
- 实时同步游戏状态
- 玩家准备状态管理
- 游戏结果排行榜

## 🛠️ 技术栈

### 前端框架

- **Vue 3**: 渐进式 JavaScript 框架
- **Vite**: 下一代前端构建工具
- **Pinia**: Vue 3 状态管理库
- **Vue Router**: Vue.js 官方路由管理器

### UI 框架

- **Bootstrap 5**: 响应式 CSS 框架
- **Bootstrap Icons**: 图标库

### 开发工具

- **TypeScript**: JavaScript 的超集
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Vitest**: 单元测试框架

### 其他依赖

- **@dicebear/core**: 头像生成库
- **@vueuse/core**: Vue 组合式 API 工具集

## 🔧 配置

### 环境变量

复制 `env.example` 为 `.env.local` 并配置：

```bash
# 应用配置
VITE_APP_TITLE=扫雷游戏

# WebSocket 服务器地址
VITE_WEBSOCKET_URL=ws://localhost:8080/ws

# 开发环境配置
NODE_ENV=development
```

### 开发配置

项目包含完整的开发工具配置：

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查
- **Vite**: 快速构建和热重载

## 📱 响应式设计

应用采用响应式设计，完美适配：

- **桌面端**: 完整功能体验
- **平板端**: 优化的触摸操作
- **手机端**: 移动端友好的界面

## 🎨 设计特色

- **现代化 UI**: 渐变背景和毛玻璃效果
- **流畅动画**: 平滑的过渡和悬停效果
- **深色模式**: 支持系统深色模式
- **无障碍支持**: 键盘导航和屏幕阅读器支持

## 🚀 部署

### 静态部署

```bash
npm run build
```

构建产物在 `dist` 目录，可直接部署到任何静态文件服务器。

### Tauri 桌面应用

```bash
npm run build:tauri
```

构建 Tauri 桌面应用版本。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- Vue.js 团队提供的优秀框架
- Bootstrap 团队提供的 UI 组件
- 所有贡献者的支持

---

**享受游戏！** 🎮✨
