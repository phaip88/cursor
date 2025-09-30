# 📧 Cloudflare 邮件发送系统

基于 Cloudflare Workers 和 Resend API 的全功能邮件发送系统，支持附件上传、随机邮箱前缀生成等功能。

## ✨ 功能特性

- ✅ **Web 界面管理** - 现代化响应式界面
- ✅ **Resend API 集成** - 稳定可靠的邮件发送服务
- ✅ **密码保护** - Token 认证系统
- ✅ **随机邮箱前缀** - 支持自定义或随机生成发件邮箱前缀
- ✅ **附件支持** - 上传并发送邮件附件
- ✅ **灵活配置** - Web 界面管理 API Key 和邮箱设置
- ✅ **KV 存储** - 使用 Cloudflare KV 持久化配置

## 🏗️ 技术栈

- **后端**: Cloudflare Workers + Hono 框架
- **前端**: 原生 HTML/CSS/JavaScript
- **存储**: Cloudflare KV
- **邮件服务**: Resend API
- **语言**: TypeScript

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd cloudflare-email-sender
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建 KV 命名空间

```bash
# 创建生产环境 KV
wrangler kv:namespace create "CONFIG_KV"

# 创建预览环境 KV
wrangler kv:namespace create "CONFIG_KV" --preview
```

将返回的 `id` 和 `preview_id` 更新到 `wrangler.toml` 文件中。

### 4. 配置 wrangler.toml

编辑 `wrangler.toml`，替换 KV 命名空间 ID：

```toml
[[kv_namespaces]]
binding = "CONFIG_KV"
id = "您的-KV-命名空间-ID"
preview_id = "您的-预览-KV-命名空间-ID"
```

### 5. 本地开发

```bash
npm run dev
```

访问 `http://localhost:8787`

### 6. 部署到 Cloudflare

```bash
npm run deploy
```

### 7. 设置管理员密码（可选）

```bash
wrangler secret put ADMIN_PASSWORD
```

> 默认密码为 `admin123`，建议部署后立即修改

## 📖 使用指南

### 首次使用

1. 访问部署后的 URL
2. 使用管理员密码登录（默认: `admin123`）
3. 进入 **设置** 页面
4. 配置 Resend API Key 和发件邮箱
5. 保存设置

### 获取 Resend API Key

1. 访问 [Resend 官网](https://resend.com)
2. 注册账号并验证域名
3. 前往 [API Keys](https://resend.com/api-keys) 页面
4. 创建新的 API Key
5. 将 API Key 和验证的邮箱配置到系统中

### 发送邮件

1. 进入 **发送邮件** 页面
2. 填写收件人、主题、内容
3. （可选）指定或随机生成邮箱前缀
4. （可选）上传附件
5. 点击发送

### 邮箱前缀说明

- **留空**: 使用默认配置的邮箱地址
- **指定前缀**: 例如输入 `newsletter`，发件地址为 `newsletter@yourdomain.com`
- **随机生成**: 点击"随机生成"按钮，系统自动生成 8 位随机前缀

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `ADMIN_PASSWORD` | 管理员登录密码 | `admin123` | 否 |

### KV 存储

系统使用 Cloudflare KV 存储以下配置：

- `RESEND_API_KEY` - Resend API 密钥
- `RESEND_EMAIL` - 发件邮箱地址
- `ADMIN_PASSWORD` - 管理员密码（可选，优先级低于环境变量）

## 📋 API 接口

### 认证

- `POST /api/login` - 用户登录

### 配置管理

- `GET /api/config` - 获取配置信息（需认证）
- `POST /api/config` - 更新配置（需认证）

### 邮件功能

- `GET /api/generate-prefix` - 生成随机邮箱前缀（需认证）
- `POST /api/send-email` - 发送邮件（需认证）

## 🎨 界面预览

### 登录页面
- 简洁的登录界面
- 密码保护

### 控制台
- 系统状态展示
- 快速导航

### 发送邮件
- 收件人、主题、内容输入
- 邮箱前缀自定义/随机生成
- 附件上传

### 设置页面
- Resend API Key 配置
- 发件邮箱配置
- 管理员密码修改

## 📝 注意事项

1. **Resend 限制**
   - 免费版每天可发送 100 封邮件
   - 需要验证域名才能发送邮件
   - 附件大小限制 40MB

2. **安全建议**
   - 部署后立即修改默认密码
   - 使用强密码
   - 定期更换 API Key

3. **域名验证**
   - 在 Resend 中添加并验证您的域名
   - 使用验证过的域名邮箱作为发件地址

## 🛠️ 开发

### 项目结构

```
cloudflare-email-sender/
├── src/
│   ├── index.ts       # Worker 主入口
│   ├── auth.ts        # 认证逻辑
│   └── email.ts       # 邮件发送逻辑
├── package.json
├── wrangler.toml
├── tsconfig.json
└── README.md
```

### 本地调试

```bash
npm run dev
```

### 部署

```bash
npm run deploy
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Resend 文档](https://resend.com/docs)
- [Hono 框架](https://hono.dev/)

---

**Made with ❤️ for email sending**
