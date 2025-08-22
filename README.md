# AES 加密解密工具

这是一个基于 Next.js 开发的安全可靠的 AES 加密解密工具，支持多种加密模式和格式。

## 功能特性

### 🔐 加密模式支持
- **CBC** (Cipher Block Chaining) - 推荐模式
- **ECB** (Electronic Codebook)
- **CFB** (Cipher Feedback)
- **OFB** (Output Feedback)
- **CTR** (Counter)

### 🔑 密钥格式支持
- **文本格式**: 16/24/32 字符（对应 AES-128/192/256）
- **16进制格式**: 32/48/64 字符

### 📝 输入输出格式
- **明文**: 支持任意文本输入
- **密文输出**: Base64 和 16进制 双格式
- **密文输入**: 自动识别 Base64 或 16进制格式

### 🛡️ 安全特性
- 客户端本地加密，数据不会上传到服务器
- 支持随机密钥和IV生成
- 格式转换功能（文本 ↔ 16进制）
- 实时长度检验和格式提示

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用方法

1. **选择加密模式**: 从下拉菜单选择所需的加密模式
2. **输入密钥**: 支持文本或16进制格式，可使用随机生成功能
3. **输入IV**: 非ECB模式需要提供初始化向量
4. **输入文本**: 加密时输入明文，解密时输入密文
5. **执行操作**: 点击加密或解密按钮

## 技术栈

- **框架**: Next.js 15.5.0
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **加密库**: crypto-js
- **构建工具**: Turbopack

## 项目结构

```
src/
├── app/
│   ├── layout.tsx        # 应用布局
│   ├── page.tsx          # 主页面
│   └── globals.css       # 全局样式
└── components/
    └── AESEncryption.tsx # AES加密组件
```

## 开发说明

### 代码规范
- 使用 ESLint 进行代码检查
- 采用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践

### 安全注意事项
- 所有加密操作在客户端执行
- 不存储用户的密钥和敏感数据
- 建议在生产环境使用 HTTPS

## 许可证

MIT License
