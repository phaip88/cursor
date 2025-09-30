# 📧 Cloudflare Workers 邮件发送系统

基于 Cloudflare Workers 和 Resend API 的邮件发送系统，支持 Web 界面管理、随机邮箱前缀生成和附件上传。

## ✨ 功能特性

- ✅ **Web 界面管理** - 现代化响应式设计
- ✅ **密码保护** - Token 认证系统
- ✅ **Resend API 集成** - 稳定可靠的邮件服务
- ✅ **随机/自定义邮箱前缀** - 灵活的发件地址管理
- ✅ **附件支持** - 上传并发送邮件附件（最大 40MB）
- ✅ **KV 存储** - Cloudflare KV 持久化配置
- ✅ **全球边缘部署** - 低延迟、高可用

## 🏗️ 技术栈

- **运行环境**: Cloudflare Workers
- **后端框架**: Hono
- **编程语言**: TypeScript
- **前端**: 原生 HTML/CSS/JavaScript
- **存储**: Cloudflare KV
- **邮件服务**: Resend API

## 🚀 快速部署

### 前置要求

- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)（免费）
- [Resend 账号](https://resend.com)（免费额度：100封/天）
- Node.js 16+

### 部署步骤

#### 1. 克隆项目

```bash
git clone https://github.com/phaip88/cursor.git
cd cursor
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 登录 Cloudflare

```bash
npx wrangler login
```

这将打开浏览器进行授权。

#### 4. 创建 KV 命名空间

```bash
# 创建生产环境 KV
npx wrangler kv:namespace create "CONFIG_KV"

# 创建预览环境 KV
npx wrangler kv:namespace create "CONFIG_KV" --preview
```

命令会返回类似以下内容：

```
{ binding = "CONFIG_KV", id = "abc123..." }
{ binding = "CONFIG_KV", preview_id = "xyz789..." }
```

#### 5. 更新配置

将上一步获取的 ID 更新到 `wrangler.toml` 文件：

```toml
[[kv_namespaces]]
binding = "CONFIG_KV"
id = "abc123..."              # 替换为实际的生产环境 ID
preview_id = "xyz789..."      # 替换为实际的预览环境 ID
```

#### 6. 部署到 Cloudflare

```bash
npm run deploy
```

部署成功后会显示您的 Worker URL，例如：
```
https://email-sender.your-subdomain.workers.dev
```

#### 7. 设置管理员密码（可选）

```bash
npx wrangler secret put ADMIN_PASSWORD
```

按提示输入密码。如不设置，默认密码为 `admin123`。

## 📖 使用指南

### 首次配置

1. 访问部署的 URL
2. 使用管理员密码登录（默认：`admin123`）
3. 进入 **设置** 页面
4. 配置 Resend API Key 和发件邮箱
5. 保存设置

### 获取 Resend API Key

1. 注册 [Resend 账号](https://resend.com)
2. 添加并验证您的域名
3. 前往 [API Keys](https://resend.com/api-keys) 页面
4. 创建新的 API Key
5. 复制 API Key（格式：`re_xxxxx`）

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

## 🛠️ 常用命令

```bash
# 本地开发
npm run dev

# 部署到生产环境
npm run deploy

# 查看部署历史
npx wrangler deployments list

# 查看实时日志
npx wrangler tail

# 设置环境变量
npx wrangler secret put ADMIN_PASSWORD

# 查看 KV 数据
npx wrangler kv:key list --binding=CONFIG_KV
npx wrangler kv:key get --binding=CONFIG_KV "RESEND_API_KEY"

# 删除 KV 数据
npx wrangler kv:key delete --binding=CONFIG_KV "key_name"
```

## 🔧 配置说明

### 环境变量

通过 `wrangler secret put` 设置：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ADMIN_PASSWORD` | 管理员登录密码 | `admin123` |

### KV 存储

系统使用 Cloudflare KV 存储以下配置：

| Key | 说明 |
|-----|------|
| `RESEND_API_KEY` | Resend API 密钥 |
| `RESEND_EMAIL` | 发件邮箱地址 |
| `ADMIN_PASSWORD` | 管理员密码（可选） |

## 📊 API 接口

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/` | GET | 登录页面 | ❌ |
| `/dashboard` | GET | 控制台 | ✅ |
| `/send` | GET | 发送邮件页面 | ✅ |
| `/settings` | GET | 设置页面 | ✅ |
| `/api/login` | POST | 用户登录 | ❌ |
| `/api/config` | GET | 获取配置 | ✅ |
| `/api/config` | POST | 更新配置 | ✅ |
| `/api/generate-prefix` | GET | 生成随机前缀 | ✅ |
| `/api/send-email` | POST | 发送邮件 | ✅ |

## 🎨 项目结构

```
cloudflare-email-sender/
├── src/
│   ├── index.ts       # Worker 主入口（含 HTML 模板）
│   ├── auth.ts        # 认证逻辑
│   └── email.ts       # 邮件发送逻辑
├── package.json       # 项目依赖
├── wrangler.toml      # Cloudflare Workers 配置
├── tsconfig.json      # TypeScript 配置
├── .env.example       # 环境变量示例
├── .gitignore         # Git 忽略规则
├── LICENSE            # MIT 许可证
├── README.md          # 本文档
└── USAGE.md           # 详细使用手册
```

## 🔐 安全建议

1. ✅ 部署后立即修改默认密码
2. ✅ 使用强密码（至少 16 位，包含大小写字母、数字、符号）
3. ✅ 定期更换 API Key
4. ✅ 在 Resend 中正确配置 SPF、DKIM、DMARC
5. ✅ 限制访问 IP（如果可能）

## 🐛 故障排查

### 问题 1: 部署失败

**错误**: `Error: No account ID found`

**解决**: 
```bash
npx wrangler login
```

### 问题 2: KV 命名空间错误

**错误**: `KV namespace CONFIG_KV not found`

**解决**:
1. 确认已创建 KV 命名空间
2. 检查 `wrangler.toml` 中的 ID 是否正确
3. 运行 `npx wrangler kv:namespace list` 查看所有命名空间

### 问题 3: 邮件发送失败

**可能原因**:
- API Key 未配置或无效
- 域名未在 Resend 验证
- 发件邮箱不是已验证域名的邮箱

**解决**:
1. 检查 Resend 控制台确认域名验证状态
2. 重新生成 API Key
3. 确保发件邮箱使用已验证的域名

### 问题 4: 无法登录

**解决**: 
重置管理员密码：
```bash
npx wrangler secret put ADMIN_PASSWORD
```

## 💰 成本说明

### Cloudflare Workers

- **免费额度**: 100,000 次请求/天
- **付费计划**: $5/月，包含 10,000,000 次请求

### Cloudflare KV

- **免费额度**: 
  - 100,000 次读取/天
  - 1,000 次写入/天
  - 1 GB 存储
- **超出**: 按使用量计费

### Resend

- **免费版**: 100 封邮件/天
- **付费计划**: 从 $20/月起（10,000 封邮件）

对于个人和小型项目，免费额度通常足够使用。

## 📝 使用场景

- 🎯 营销邮件发送
- 📬 系统通知邮件
- 📊 定期报告发送
- 💬 客服邮件回复
- 🔔 事件提醒通知

## 🔗 相关链接

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Resend 文档](https://resend.com/docs)
- [Hono 框架](https://hono.dev/)

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请在 GitHub 上提交 Issue：
https://github.com/phaip88/cursor/issues

---

**Made with ❤️ for Cloudflare Workers**
