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
- **16进制格式**: 32/48/64 字符（对应 AES-128/192/256）
- **IV**: 32 字符16进制格式

### 📝 输入输出格式
- **明文**: 支持任意文本输入（加密时）
- **密文**: 只支持16进制格式（解密时）
- **🆕 简化JSON输出**: 包含算法、模式、密文和IV信息

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
2. **输入密钥**: 输入16进制格式密钥，可使用随机生成功能
3. **输入IV**: 非ECB模式需要提供16进制格式的初始化向量
4. **输入文本**: 加密时输入明文，解密时输入16进制密文
5. **执行操作**: 点击加密或解密按钮
6. **获取结果**: 查看结果，可点击展开 JSON 输出获取结构化数据

## JSON 输出格式

### 输出示例（加密和解密都使用相同格式）
```json
{
  "algorithm": "AES",
  "mode": "CBC",
  "ciphertextHex": "b889699471f37ae0c32a07b2427e591e",
  "ivHex": "6e386e556c7347645279375a6d373357"
}
```

**字段说明：**
- `algorithm`: 加密算法（固定为 "AES"）
- `mode`: 加密模式（CBC/ECB/CFB/OFB/CTR）
- `ciphertextHex`: 16进制格式的密文
- `ivHex`: 16进制格式的IV（ECB模式时为 undefined）

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
