# Gouzhi (钩织管理)

A modern, local-first Progressive Web App (PWA) for managing crochet patterns, projects, yarn inventory, and finished works.
一款现代化的、本地优先的 PWA 应用，用于管理钩织图解、项目、毛线库存和成品作品。

## ✨ Features / 功能特性

- **📂 Pattern Management / 图解管理**: 
  - Organize patterns with categories, difficulty ratings, and tags.
  - Support for image uploads and detailed text instructions.
  - 管理图解，支持分类、难度评级和标签。
  - 支持上传图片和详细的图解文字教程。
  
- **🧶 Yarn Inventory / 毛线库存**: 
  - Track yarn stash with color picker, weight, material, and stock quantity.
  - 追踪毛线库存，支持取色器、粗细、材质和库存数量记录。

- **🚀 Project Tracking / 项目追踪**: 
  - Manage active projects, link them to patterns and yarns, and track progress.
  - 管理进行中的项目，关联图解和毛线，追踪进度。

- **🏆 Finished Works / 成品展示**: 
  - Showcase completed works with photos, ratings, time spent, and notes.
  - 展示已完成的作品，记录照片、评分、耗时和心得。

- **☁️ Data Sync / 数据同步**: 
  - **Local-First**: All data is stored locally in IndexedDB.
  - **WebDAV Sync**: Sync data across devices using any WebDAV-compatible service.
  - **Import/Export**: Full JSON data export and import.
  - **本地优先**: 所有数据存储在本地 IndexedDB。
  - **WebDAV 同步**: 支持通过 WebDAV 服务在多设备间同步数据。
  - **导入/导出**: 支持完整的 JSON 数据导入导出。

- **🌍 Internationalization / 多语言**: 
  - Full support for English and Chinese (Simplified).
  - 完整支持英文和简体中文。

- **🎨 Themes / 主题**: 
  - Light, Dark, and System theme support.
  - 支持浅色、深色和跟随系统主题。

## 🛠️ Tech Stack / 技术栈

- **Framework**: React 19 + Vite
- **Storage**: IndexedDB (using `idb`)
- **PWA**: `vite-plugin-pwa`
- **Routing**: React Router v7
- **Icons**: Lucide React
- **i18n**: i18next + react-i18next

## 🚀 Getting Started / 快速开始

### Prerequisites / 前置要求

- Node.js (v18 or higher)
- npm or yarn

### Installation / 安装

```bash
# Clone the repository
git clone https://github.com/yourusername/gouzhi.git

# Enter directory
cd gouzhi

# Install dependencies
npm install
```

### Development / 开发

```bash
# Start development server
npm run dev
```

### Build / 构建

```bash
# Build for production
npm run build

# Preview build
npm run preview
```

## 📱 Installation (PWA) / 安装应用

This app is a PWA. You can install it on your device:
本应用为 PWA，您可以将其安装到设备上：

- **Desktop (Chrome/Edge)**: Click the install icon in the address bar.
- **Mobile (iOS)**: Safari -> Share -> Add to Home Screen.
- **Mobile (Android)**: Chrome -> Menu -> Install App.

## 📄 License

MIT License
